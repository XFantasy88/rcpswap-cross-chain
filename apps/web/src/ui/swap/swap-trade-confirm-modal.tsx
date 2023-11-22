import ConfirmSwapModal from "@/components/swap/ConfirmSwapModal"
import {
  useDerivedSwapState,
  useSwapTrade,
  useSymbiosisTrade,
} from "@/ui/swap/derived-swap-state-provider"
import { useDerivedSwapTradeState } from "./derived-swap-trade-state-provider"
import { useCallback, useMemo, useRef } from "react"
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi"
import {
  META_ROUTE_PROCESSOR_ADDRESS,
  ROUTE_PROCESSOR_3_ADDRESS,
} from "rcpswap/config"
import { mainnetConfig } from "@rcpswap/symbiosis"
import { metaRouteProcessorAbi, routeProcessor2Abi } from "rcpswap/abi"
import {
  getPublicClient,
  getShortenAddress,
  isAddress,
  waitForTransaction,
} from "@rcpswap/wagmi"
import { Amount, tryParseAmount } from "rcpswap/currency"
import { finalizeTransaction, useAddTransaction } from "@rcpswap/dexie"
import { useAddPopup } from "@/state/application/hooks"
import { RouteStatus } from "@rcpswap/tines"
import { gasMargin } from "rcpswap"
import confirmPriceImpactWithoutFee from "@/components/swap/confirmPriceImpactWithoutFee"
import { getEthersTransactionReceipt } from "@/utils/getEthersTransactionReceipt"
import { ethers } from "ethers"
import { getAddress } from "viem"

export default function SwapTradeConfirmModal() {
  const {
    state: { swapMode, recipient, chainId0, chainId1, swapAmount, token0 },
    mutate: { setSwapAmount },
  } = useDerivedSwapState()

  const { data: trade } = useSwapTrade()
  const { data: symbiosis } = useSymbiosisTrade()

  const addTransaction = useAddTransaction()
  const addPopup = useAddPopup()
  const { address } = useAccount()

  const symbiosisRef = useRef<any>()

  const parsedAmount = useMemo(
    () => tryParseAmount(swapAmount, token0),
    [swapAmount, token0]
  )

  const {
    state: {
      showConfirm,
      tradeToConfirm,
      attemptingTxn,
      txHash,
      swapErrorMessage,
    },
    mutate: {
      setTradeToConfirm,
      setShowConfirm,
      setSwapErrorMessage,
      setAttemptingTxn,
      setTxHash,
    },
  } = useDerivedSwapTradeState()

  const { config, error } = usePrepareContractWrite({
    chainId: chainId0,
    address: ROUTE_PROCESSOR_3_ADDRESS[chainId0],
    abi: routeProcessor2Abi,
    functionName: tradeToConfirm?.functionName,
    args: tradeToConfirm?.writeArgs as any,
    enabled: Boolean(
      tradeToConfirm?.writeArgs &&
        tradeToConfirm.route.status !== RouteStatus.NoWay
    ),
    value: tradeToConfirm?.value ?? 0n,
    staleTime: 5000,
  })

  const { writeAsync } = useContractWrite({
    ...config,
    request: config?.request
      ? {
          ...config.request,
          gas:
            typeof config.request.gas === "bigint"
              ? gasMargin(config.request.gas)
              : undefined,
        }
      : undefined,
    onSuccess: async (data) => {
      console.log(data)
      setAttemptingTxn(false)
      setTxHash(data.hash)
      setSwapErrorMessage(undefined)

      const baseText = `Swap ${tradeToConfirm?.amountIn?.toSignificant(3)} ${
        tradeToConfirm?.amountIn?.currency.symbol
      } for ${tradeToConfirm?.amountOut
        ?.subtract(
          tradeToConfirm.feeAmount ??
            Amount.fromRawAmount(tradeToConfirm.amountOut.currency, 0)
        )
        .toSignificant(3)} ${tradeToConfirm?.amountOut?.currency.symbol} ${
        recipient !== undefined && recipient !== address && isAddress(recipient)
          ? `to ${getShortenAddress(recipient)}`
          : ""
      }`

      addTransaction(address ?? "", chainId0, data.hash, baseText)

      waitForTransaction({ hash: data.hash }).then((receipt) => {
        finalizeTransaction(data.hash, receipt)

        addPopup(
          {
            txn: {
              hash: data.hash,
              success: receipt.status === "success",
              summary: baseText,
            },
          },
          data.hash
        )
      })
    },
    onError: (error) => {
      setSwapErrorMessage(error.message)
      setAttemptingTxn(false)
      setTxHash(undefined)
    },
  })

  const { config: symbiosisConfig, error: symbiosisTxError } =
    usePrepareContractWrite({
      chainId: chainId0,
      abi: metaRouteProcessorAbi,
      address: META_ROUTE_PROCESSOR_ADDRESS[chainId0],
      functionName: "processRoute",
      args: [
        (token0?.isNative
          ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
          : token0?.address) ?? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        parsedAmount?.quotient ?? 0n,
        token0?.isNative ?? false,
        symbiosis?.transaction?.data,
      ],
      value: token0?.isNative ? parsedAmount?.quotient ?? 0n : 0n,
      enabled: Boolean(symbiosis && symbiosis.transaction),
      staleTime: 5000,
    })

  const { writeAsync: symbiosisWriteAsync } = useContractWrite({
    ...symbiosisConfig,
    request: symbiosisConfig.request
      ? {
          ...symbiosisConfig.request,
          gas:
            typeof symbiosisConfig.request.gas === "bigint"
              ? gasMargin(symbiosisConfig.request.gas)
              : undefined,
        }
      : undefined,
    onMutate: () => {
      if (symbiosisRef && symbiosis) {
        symbiosisRef.current = symbiosis
      }
    },
    onSuccess: async (data) => {
      const baseText = `Swap ${symbiosisRef.current?.amountIn?.toSignificant(
        3
      )} ${
        symbiosisRef.current?.amountIn?.currency.symbol
      } for ${symbiosisRef.current?.amountOut?.toSignificant(3)} ${
        symbiosisRef.current?.amountOut?.currency.symbol
      } ${
        recipient !== undefined && recipient !== address && isAddress(recipient)
          ? `to ${getShortenAddress(recipient)}`
          : ""
      }`

      addTransaction(address ?? "", chainId0, data.hash, baseText)

      waitForTransaction({ hash: data.hash }).then(async (receipt) => {
        await symbiosisRef.current?.symbiosis
          ?.waitForComplete(getEthersTransactionReceipt(receipt))
          .then(async (log: any) => {
            console.log(log)
            const swapData = symbiosisRef.current
            if (!log || !swapData) return
            const expectedTokenOut = swapData.amountOut?.currency

            const transitTokenSent =
              await symbiosisRef.current?.symbiosis?.findTransitTokenSent(
                log.transactionHash
              )

            console.log(transitTokenSent)

            let formatedText

            if (transitTokenSent) {
              formatedText = `Received ${transitTokenSent?.token?.symbol} instead of ${expectedTokenOut?.symbol} to avoid any loss due to an adverse exchange rate change on the destination network.`
            } else {
              formatedText = `Swap ${symbiosisRef.current?.amountIn?.toSignificant(
                3
              )} ${
                symbiosisRef.current?.amountIn?.currency.symbol
              } for ${symbiosisRef.current?.amountOut?.toSignificant(3)} ${
                symbiosisRef.current?.amountOut?.currency.symbol
              } ${
                recipient !== undefined &&
                recipient !== address &&
                isAddress(recipient)
                  ? `to ${getShortenAddress(recipient)}`
                  : ""
              }`
            }

            console.log(formatedText)

            addPopup(
              {
                txn: {
                  hash: log?.transactionHash,
                  success: !transitTokenSent,
                  summary: formatedText,
                  chainId: expectedTokenOut?.chainId,
                },
              },
              log.transactionHash
            )
          })

        finalizeTransaction(data.hash, receipt)
        setAttemptingTxn(false)
        setTxHash(data.hash)
        setSwapErrorMessage(undefined)
      })
    },
    onError: (error) => {
      setSwapErrorMessage(error.message)
      setAttemptingTxn(false)
      setTxHash(undefined)
    },
  })

  const handleAcceptChanges = useCallback(() => {
    setTradeToConfirm(chainId0 === chainId1 ? trade : symbiosis)
  }, [setTradeToConfirm, trade, symbiosis, chainId0, chainId1])

  const handleConfirmDismiss = useCallback(() => {
    setShowConfirm(false)

    if (txHash) {
      setSwapAmount("")
    }
  }, [setShowConfirm, txHash, setSwapAmount])

  const handleSwap = useCallback(async () => {
    try {
      console.log(symbiosisConfig, symbiosisTxError, symbiosis)
      if (
        (chainId0 === chainId1 && error) ||
        (chainId0 !== chainId1 && symbiosisTxError)
      ) {
        setSwapErrorMessage(
          chainId0 === chainId1 ? error?.message : symbiosisTxError?.message
        )
        setAttemptingTxn(false)
        setTxHash(undefined)
        return
      }
      if (
        tradeToConfirm?.priceImpact &&
        !confirmPriceImpactWithoutFee(tradeToConfirm.priceImpact)
      ) {
        return
      }

      setAttemptingTxn(true)
      setSwapErrorMessage(undefined)
      setTxHash(undefined)

      if (chainId0 === chainId1) await writeAsync?.()
      else {
        await symbiosisWriteAsync?.()
      }
    } catch (err) {
      console.log(err)
    }
  }, [
    tradeToConfirm,
    writeAsync,
    error,
    symbiosisWriteAsync,
    symbiosisTxError,
    chainId0,
    chainId1,
    setAttemptingTxn,
    setSwapErrorMessage,
    setTxHash,
  ])

  return (
    <ConfirmSwapModal
      swapMode={swapMode}
      isOpen={showConfirm}
      trade={chainId0 === chainId1 ? trade : symbiosis}
      originalTrade={tradeToConfirm}
      onAcceptChanges={handleAcceptChanges}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      recipient={recipient}
      onConfirm={handleSwap}
      swapErrorMessage={swapErrorMessage}
      onDismiss={handleConfirmDismiss}
    />
  )
}
