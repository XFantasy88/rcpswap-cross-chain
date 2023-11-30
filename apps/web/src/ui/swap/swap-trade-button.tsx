import { ButtonConfirmed, ButtonError } from "@/components/Button"
import Checker from "@/components/Checker"
import Column from "@/components/Column"
import Loader from "@/components/Loader"
import { AutoRow, RowBetween } from "@/components/Row"
import {
  useDerivedSwapState,
  useSwapTrade,
  useSymbiosisTrade,
} from "@/ui/swap/derived-swap-state-provider"
import {
  ApprovalState,
  fetchBlockNumber,
  getEtherscanLink,
  getPublicClient,
  getShortenAddress,
  isAddress,
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
  useTokenApproval,
  waitForTransaction,
} from "@rcpswap/wagmi"
import {
  META_ROUTE_PROCESSOR_ADDRESS,
  ROUTE_PROCESSOR_3_ADDRESS,
} from "rcpswap/config"
import { Amount, tryParseAmount } from "rcpswap/currency"
import { useCallback, useMemo, useRef } from "react"
import { Text } from "rebass"
import ProgressSteps from "@/components/ProgressSteps"
import { useDerivedSwapTradeState } from "./derived-swap-trade-state-provider"
import { UseTradeReturn } from "@rcpswap/router"
import { useExpertMode } from "@rcpswap/hooks"
import { convertAmountFromSymbiosis, warningSeverity } from "@/utils"
import { metaRouteProcessorAbi, routeProcessor2Abi } from "rcpswap/abi"
import { RouteStatus } from "@rcpswap/tines"
import { gasMargin } from "rcpswap/calculate"
import confirmPriceImpactWithoutFee from "@/components/swap/confirmPriceImpactWithoutFee"
import { useAddTransaction, finalizeTransaction } from "@rcpswap/dexie"
import { useAddPopup } from "@/state/application/hooks"
import { ErrorCode, Symbiosis } from "@rcpswap/symbiosis"
import { TransactionExecutionError, zeroAddress } from "viem"
import { ethers } from "ethers"
import { getEthersTransactionReceipt } from "@/utils/getEthersTransactionReceipt"
import { SYMBIOSIS_CONFIRMATION_BLOCK_COUNT } from "@/config"
import { StepType } from "@/components/TransactionConfirmationModal"

export default function SwapTradeButton() {
  const {
    state: { chainId0, token0, swapAmount, token1, recipient, chainId1 },
  } = useDerivedSwapState()

  const [isExpertMode] = useExpertMode()
  const tradeRef = useRef<UseTradeReturn | undefined>()
  const symbiosisRef = useRef<any>()
  const { address } = useAccount()

  const {
    state: { steps },
    mutate: {
      setTradeToConfirm,
      setAttemptingTxn,
      setSwapErrorMessage,
      setShowConfirm,
      setTxHash,
      setSteps,
      setSwapWarningMessage,
      setCurrencyToAdd,
    },
  } = useDerivedSwapTradeState()

  const { data, isInitialLoading: isLoading } = useSwapTrade()

  const trade = data as UseTradeReturn
  const {
    data: symbiosis,
    error: symbiosisError,
    isInitialLoading: isSymbiosisLoading,
  } = useSymbiosisTrade()
  const addTransaction = useAddTransaction()
  const addPopup = useAddPopup()

  const parsedAmount = useMemo(
    () => tryParseAmount(swapAmount, token0),
    [token0, swapAmount]
  )

  const [approvalState] = useTokenApproval({
    amount: parsedAmount,
    spender:
      chainId0 !== chainId1
        ? META_ROUTE_PROCESSOR_ADDRESS[chainId0]
        : ROUTE_PROCESSOR_3_ADDRESS[chainId0],
    enabled: Boolean(parsedAmount),
  })

  const { config, error } = usePrepareContractWrite({
    chainId: chainId0,
    address: ROUTE_PROCESSOR_3_ADDRESS[chainId0],
    abi: routeProcessor2Abi,
    functionName: trade?.functionName,
    args: trade?.writeArgs as any,
    enabled: Boolean(
      trade?.writeArgs &&
        trade.route.status !== RouteStatus.NoWay &&
        chainId0 === chainId1 &&
        approvalState === ApprovalState.APPROVED
    ),
    value: trade?.value ?? 0n,
    staleTime: 5000,
    cacheTime: 10000,
    onError: () => {},
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
    onMutate: () => {
      if (tradeRef && trade) {
        tradeRef.current = trade
      }
    },
    onSuccess: async (data) => {
      setAttemptingTxn(false)
      setTxHash(data.hash)
      setSwapErrorMessage(undefined)
      setSteps([
        {
          ...steps[0],
          status: "success",
          link: getEtherscanLink(chainId0, data.hash, "transaction"),
        },
      ])

      const baseText = `Swap ${tradeRef.current?.amountIn?.toSignificant(3)} ${
        tradeRef.current?.amountIn?.currency.symbol
      } for ${tradeRef.current?.amountOut
        ?.subtract(
          tradeRef.current.feeAmount ??
            Amount.fromRawAmount(tradeRef.current.amountOut.currency, 0)
        )
        .toSignificant(3)} ${tradeRef.current?.amountOut?.currency.symbol} ${
        recipient !== undefined && recipient !== address && isAddress(recipient)
          ? `to ${getShortenAddress(recipient)}`
          : ""
      }`

      addTransaction(address ?? "", chainId0, data.hash, baseText)

      // symbiosisRef.current?.symbiosis?.waitForComplete()

      waitForTransaction({ hash: data.hash }).then((receipt) => {
        finalizeTransaction(data.hash, "success", receipt)

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
      setSwapErrorMessage(
        error instanceof TransactionExecutionError
          ? "User rejected the transaction."
          : "Transaction failed, this can be caused by prices changes - try increasing slippage"
      )
      setAttemptingTxn(false)
      setTxHash(undefined)
    },
  })

  // const { config: symbiosisConfig, error: symbiosisTxError } =
  //   usePrepareSendTransaction({
  //     ...symbiosis?.transaction,
  //     enabled: symbiosis && symbiosis.transaction && chainId0 !== chainId1,
  //   })

  const { data: symbiosisConfig, error: symbiosisTxError } =
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
      enabled: Boolean(
        symbiosis &&
          symbiosis.transaction &&
          approvalState === ApprovalState.APPROVED
      ),
      staleTime: 5000,
      cacheTime: 10000,
    })

  const { writeAsync: symbiosisWriteAsync } = useContractWrite({
    ...symbiosisConfig,
    request: symbiosisConfig?.request
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

      const newSteps: StepType[] = [
        {
          ...steps[0],
          status: "success",
          link: getEtherscanLink(chainId0, data.hash, "transaction"),
        },
        {
          ...steps[1],
          status: "pending",
          currentRounds: 0,
        },
        ...steps.slice(2),
      ]

      setSteps(newSteps)

      addTransaction(address ?? "", chainId0, data.hash, baseText)

      try {
        waitForTransaction({ hash: data.hash })
          .then(async (receipt) => {
            const publicClient = getPublicClient({ chainId: chainId0 })

            const currentBlockNo = await fetchBlockNumber({ chainId: chainId0 })
            const unwatch = publicClient.watchBlockNumber({
              onBlockNumber: (blockNo) => {
                const offset = Number(blockNo - currentBlockNo)
                if (offset >= SYMBIOSIS_CONFIRMATION_BLOCK_COUNT[chainId0]) {
                  newSteps[1] = {
                    ...newSteps[1],
                    currentRounds: newSteps[1].totalRounds,
                    status: "success",
                  }
                  newSteps[2] = { ...newSteps[2], status: "pending" }
                  setSteps(newSteps)
                } else {
                  newSteps[1] = { ...newSteps[1], currentRounds: offset }
                  setSteps(newSteps)
                }
              },
            })

            const symbiosisData = await symbiosisRef.current?.symbiosis
              ?.waitForComplete(getEthersTransactionReceipt(receipt))
              .then(async (log: any) => {
                unwatch?.()
                newSteps[1] = {
                  ...newSteps[1],
                  currentRounds: newSteps[1].totalRounds,
                  status: "success",
                }
                newSteps[2] = { ...newSteps[2], status: "pending" }
                setSteps(newSteps)
                const swapData = symbiosisRef.current
                if (!log || !swapData) return
                const expectedTokenOut = swapData.amountOut?.currency

                const transitTokenSent =
                  await symbiosisRef.current?.symbiosis?.findTransitTokenSent(
                    log.transactionHash
                  )

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

                newSteps[2] = {
                  ...newSteps[2],
                  status: transitTokenSent ? "failed" : "success",
                  link: getEtherscanLink(
                    chainId1,
                    log?.transactionHash,
                    "transaction"
                  ),
                }
                setSteps(newSteps)

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

                return { transitTokenSent, hash: log?.transactionHash }
              })

            finalizeTransaction(data.hash, "success", receipt)
            if (symbiosisData?.transitTokenSent) {
              setAttemptingTxn(false)
              setTxHash(symbiosisData.hash)
              setCurrencyToAdd(
                convertAmountFromSymbiosis(symbiosisData.transitTokenSent)
                  .currency
              )
              setSwapWarningMessage(
                `Received ${symbiosisData?.transitTokenSent?.token?.symbol} instead of ${token1?.symbol} to avoid any loss due to an adverse exchange rate change on the destination network.`
              )
            }
          })
          .catch((err) => {
            finalizeTransaction(data.hash, "failed")
            setAttemptingTxn(false)
            setTxHash(data.hash)
            setSwapErrorMessage("Failed to listen event")
          })
      } catch (err) {
        finalizeTransaction(data.hash, "failed")
        setAttemptingTxn(false)
        setTxHash(data.hash)
        setSwapErrorMessage("Failed to listen event")
      }
    },
    onError: (error) => {
      setSwapErrorMessage(
        error instanceof TransactionExecutionError
          ? "User rejected the transaction."
          : "Transaction failed, this can be caused by prices changes - try increasing slippages"
      )
      setAttemptingTxn(false)
      setTxHash(undefined)
    },
  })

  const handleSwap = useCallback(async () => {
    try {
      // if (
      //   (chainId0 === chainId1 && error) ||
      //   (chainId0 !== chainId1 && symbiosisTxError)
      // ) {
      //   setSwapErrorMessage(
      //     chainId0 === chainId1 ? error?.message : symbiosisTxError?.message
      //   )
      //   setAttemptingTxn(false)
      //   setTxHash(undefined)
      //   return
      // }
      if (!isExpertMode) {
        setTradeToConfirm(chainId0 === chainId1 ? trade : symbiosis)
        setAttemptingTxn(false)
        setSwapErrorMessage(undefined)
        setShowConfirm(true)
        setTxHash(undefined)
      } else {
        setSwapErrorMessage(undefined)
        setTxHash(undefined)
        setSwapWarningMessage(undefined)
        setCurrencyToAdd(undefined)
        if (
          (chainId0 === chainId1 &&
            trade?.priceImpact &&
            !confirmPriceImpactWithoutFee(trade?.priceImpact)) ||
          (chainId0 !== chainId1 &&
            symbiosis?.priceImpact &&
            !confirmPriceImpactWithoutFee(symbiosis?.priceImpact))
        ) {
          return
        }
        setSteps(
          chainId0 === chainId1
            ? [
                {
                  title: "Sending the transaction to Arbitrum Nova",
                  desc: "Explore the Sent Transaction",
                  status: "pending",
                },
              ]
            : [
                {
                  title: `Sending the transaction to ${
                    chainId0 === 137 ? "Polygon" : "Arbitrum Nova"
                  }`,
                  desc: "Explore the Sent Transaction",
                  status: "pending",
                },
                {
                  title: `Waiting for the transaction to be mined...`,
                  desc: "Getting Block Confirmations",
                  totalRounds: SYMBIOSIS_CONFIRMATION_BLOCK_COUNT[chainId0],
                  currentRounds: 0,
                },
                {
                  title: `Getting ${token1?.symbol} on ${
                    chainId1 === 137 ? "Polygon" : "Arbitrum Nova"
                  }`,
                  desc: "Check in the Explorer",
                },
              ]
        )
        setAttemptingTxn(true)
        if (chainId0 === chainId1) await writeAsync?.()
        else await symbiosisWriteAsync?.()
      }
    } catch (err) {}
  }, [
    setTradeToConfirm,
    setAttemptingTxn,
    setSwapErrorMessage,
    setShowConfirm,
    setTxHash,
    trade,
    writeAsync,
    config,
    isExpertMode,
    error,
    symbiosisWriteAsync,
    symbiosisConfig,
    symbiosisTxError,
    approvalState,
  ])

  const isWrap = token0?.isNative && token1?.equals(token0.wrapped)
  const isUnWrap = token1?.isNative && token0?.equals(token1.wrapped)

  const priceImpactSeverity = useMemo(
    () => warningSeverity((trade as UseTradeReturn)?.priceImpact),
    [trade]
  )

  return (
    <Checker.Error
      error={
        chainId0 !== chainId1 && symbiosisError
          ? (symbiosisError as any)?.code === ErrorCode.AMOUNT_LESS_THAN_FEE ||
            (symbiosisError as any)?.code === ErrorCode.AMOUNT_TOO_LOW
            ? "Amount is too low"
            : (symbiosisError as any)?.code === ErrorCode.AMOUNT_TOO_HIGH
            ? "Amount is too high"
            : "Invalid Trade"
          : undefined
      }
    >
      <Checker.Connect>
        <Checker.Network chainId={chainId0}>
          <Checker.Amounts chainId={chainId0} amounts={[parsedAmount]}>
            <Checker.Tokens tokens={[token0, token1]}>
              <Checker.Error
                error={
                  isLoading || isSymbiosisLoading
                    ? "Fetching the best price"
                    : trade?.route?.status === RouteStatus.NoWay
                    ? "Insufficient liquidity for this trade."
                    : undefined
                }
              >
                <Checker.ApproveERC20
                  amount={parsedAmount}
                  contract={
                    chainId0 !== chainId1
                      ? META_ROUTE_PROCESSOR_ADDRESS[chainId0]
                      : ROUTE_PROCESSOR_3_ADDRESS[chainId0]
                  }
                >
                  {(approvalSubmitted, approvalState, approve) =>
                    approvalState === ApprovalState.NOT_APPROVED ||
                    approvalState === ApprovalState.PENDING ||
                    (approvalSubmitted &&
                      approvalState === ApprovalState.APPROVED) ? (
                      <>
                        <RowBetween>
                          <ButtonConfirmed
                            onClick={() => {
                              approve?.()
                            }}
                            disabled={
                              approvalState !== ApprovalState.NOT_APPROVED ||
                              approvalSubmitted
                            }
                            width="48%"
                            altDisabledStyle={
                              approvalState === ApprovalState.PENDING
                            }
                            confirmed={approvalState === ApprovalState.APPROVED}
                          >
                            {approvalState === ApprovalState.PENDING ? (
                              <AutoRow gap="6px" justify="center">
                                Approving <Loader stroke="white" />
                              </AutoRow>
                            ) : approvalSubmitted &&
                              approvalState === ApprovalState.APPROVED ? (
                              "Approved"
                            ) : (
                              "Approve " + token0?.symbol
                            )}
                          </ButtonConfirmed>
                          <ButtonError
                            onClick={handleSwap}
                            width="48%"
                            id="swap-button"
                            disabled={
                              approvalState !== ApprovalState.APPROVED ||
                              (priceImpactSeverity > 3 && !isExpertMode)
                            }
                          >
                            <Text fontSize={16} fontWeight={500}>
                              {isWrap
                                ? "Wrap"
                                : isUnWrap
                                ? "Unwrap"
                                : priceImpactSeverity > 3 && !isExpertMode
                                ? "Price Impact High"
                                : `Swap${
                                    priceImpactSeverity > 2 ? " Anyway" : ""
                                  }`}
                            </Text>
                          </ButtonError>
                        </RowBetween>
                        <Column style={{ marginTop: "1rem" }}>
                          <ProgressSteps
                            steps={[approvalState === ApprovalState.APPROVED]}
                          />
                        </Column>
                      </>
                    ) : (
                      <ButtonError
                        onClick={handleSwap}
                        id="swap-button"
                        disabled={
                          approvalState !== ApprovalState.APPROVED ||
                          (priceImpactSeverity > 3 && !isExpertMode)
                        }
                      >
                        <Text fontSize={20} fontWeight={500}>
                          {isWrap
                            ? "Wrap"
                            : isUnWrap
                            ? "Unwrap"
                            : priceImpactSeverity > 3 && !isExpertMode
                            ? "Price Impact High"
                            : `Swap${priceImpactSeverity > 2 ? " Anyway" : ""}`}
                        </Text>
                      </ButtonError>
                    )
                  }
                </Checker.ApproveERC20>
              </Checker.Error>
            </Checker.Tokens>
          </Checker.Amounts>
        </Checker.Network>
      </Checker.Connect>
    </Checker.Error>
  )
}
