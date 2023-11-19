"use client"

import React, { useCallback, useContext, useMemo, useState } from "react"
import { FiPlus } from "react-icons/fi"
import { Text } from "rebass"
import { ThemeContext } from "styled-components"
import { ButtonError } from "@/components/Button"
import { BlueCard, LightCard } from "@/components/Card"
import { AutoColumn, ColumnCenter } from "@/components/Column"
import TransactionConfirmationModal, {
  ConfirmationModalContent,
} from "@/components/TransactionConfirmationModal"
import CurrencyInputPanel from "@/components/CurrencyInputPanel"
import DoubleCurrencyLogo from "@/components/DoubleLogo"
import { MinimalPositionCard } from "@/components/PositionCard"
import Row, { RowBetween, RowFlat } from "@/components/Row"

import { TYPE } from "@/theme"

import { Wrapper, BodyWrapper } from "./styleds"
import { ConfirmAddModalBottom } from "./ConfirmAddModalBottom"
import { getCurrencyId } from "@/utils"
import { PoolPriceBar } from "./PoolPriceBar"

import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi"
import { ChainId } from "rcpswap/chain"
import {
  SwapV2PoolState,
  useCurrency,
  waitForTransaction,
} from "@rcpswap/wagmi"
import { useExpertMode, useSlippageTolerance } from "@rcpswap/hooks"
import { AddRemoveTabs } from "@/components/NavigationTabs"
import { Amount, Native, Type } from "rcpswap/currency"
import { finalizeTransaction, useAddTransaction } from "@rcpswap/dexie"
import {
  Field,
  useDerivedPoolAddState,
  usePoolAddInfo,
} from "./derived-pool-add-state-provider"
import { usePathname, useRouter } from "next/navigation"
import Checker from "@/components/Checker"
import { RCPSWAP_ROUTER_ADDRESS } from "@rcpswap/v2-sdk"
import { uniswapV2RouterAbi } from "rcpswap/abi"
import { Percent, gasMargin, slippageAmount } from "rcpswap"
import { useAddPopup } from "@/state/application/hooks"

export default function PoolAddWidget({
  currencyIdA,
  currencyIdB,
}: {
  currencyIdA?: string
  currencyIdB?: string
}) {
  const router = useRouter()
  const pathname = usePathname()

  const { address } = useAccount()
  const theme = useContext(ThemeContext)
  const chainId = ChainId.ARBITRUM_NOVA

  const currencyA = useCurrency(currencyIdA, chainId)
  const currencyB = useCurrency(currencyIdB, chainId)

  const {
    state: { inputs, independentField },
    mutate: { setTypedAmounts, setIndependentField },
  } = useDerivedPoolAddState()

  const {
    currencies,
    currencyBalances,
    liquidityMinted,
    noLiquidity,
    parsedAmounts,
    pool,
    poolState,
    poolTokenPercentage,
    price,
  } = usePoolAddInfo(currencyA, currencyB)

  const oneCurrencyIsWETH = Boolean(
    chainId &&
      ((currencyA && currencyA?.equals(Native.onChain(chainId).wrapped)) ||
        (currencyB && currencyB?.equals(Native.onChain(chainId).wrapped)))
  )

  const [expertMode] = useExpertMode()

  const atMaxAmounts: { [field in Field]?: boolean | undefined } = [
    Field.CURRENCY_A,
    Field.CURRENCY_B,
  ].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: currencyBalances[field]?.equalTo(parsedAmounts[field] ?? "0"),
    }
  }, {})

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const [allowedSlippage] = useSlippageTolerance() // custom from users
  const [txHash, setTxHash] = useState<string>("")

  const onFieldInput = useCallback(
    (field: Field) => {
      return (value: string) => {
        if (noLiquidity) {
          setTypedAmounts({ ...inputs, [field]: value })
        } else {
          setTypedAmounts({
            ...inputs,
            [field]: value,
            [field === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A]:
              "",
          })
        }
        setIndependentField(field)
      }
    },
    [independentField, inputs, setIndependentField]
  )

  const addTransaction = useAddTransaction()

  const addPopup = useAddPopup()

  const calldata = useMemo(() => {
    if (
      !currencies[Field.CURRENCY_A] ||
      !currencies[Field.CURRENCY_B] ||
      !parsedAmounts[Field.CURRENCY_A] ||
      !parsedAmounts[Field.CURRENCY_B]
    )
      return undefined

    const withNative =
      currencies[Field.CURRENCY_A].isNative ||
      currencies[Field.CURRENCY_B].isNative

    const slippageTolerance = new Percent(
      Math.floor(Number(allowedSlippage) * 100),
      10000
    )

    const minAmount0 =
      poolState === SwapV2PoolState.NOT_EXISTS
        ? parsedAmounts[Field.CURRENCY_A]
        : Amount.fromRawAmount(
            currencies[Field.CURRENCY_A],
            slippageAmount(
              parsedAmounts[Field.CURRENCY_A],
              slippageTolerance
            )[0]
          )

    const minAmount1 =
      poolState === SwapV2PoolState.NOT_EXISTS
        ? parsedAmounts[Field.CURRENCY_B]
        : Amount.fromRawAmount(
            currencies[Field.CURRENCY_B],
            slippageAmount(
              parsedAmounts[Field.CURRENCY_B],
              slippageTolerance
            )[0]
          )

    const deadline = BigInt(Math.floor(Date.now() / 1000 + 1800).toString())

    if (withNative) {
      const aNative = currencies[Field.CURRENCY_A].isNative

      const value = aNative
        ? parsedAmounts[Field.CURRENCY_A].quotient
        : parsedAmounts[Field.CURRENCY_B].quotient

      const args = [
        (aNative ? currencies[Field.CURRENCY_B] : currencies[Field.CURRENCY_A])
          .wrapped.address,
        (aNative
          ? parsedAmounts[Field.CURRENCY_B]
          : parsedAmounts[Field.CURRENCY_A]
        ).quotient,
        (aNative ? minAmount1 : minAmount0).quotient,
        (aNative ? minAmount0 : minAmount1).quotient,
        address,
        deadline,
      ]

      return { args, value, functionName: "addLiquidityETH" }
    } else {
      const args = [
        currencies[Field.CURRENCY_A].wrapped.address,
        currencies[Field.CURRENCY_B].wrapped.address,
        parsedAmounts[Field.CURRENCY_A].quotient,
        parsedAmounts[Field.CURRENCY_B].quotient,
        minAmount0.quotient,
        minAmount1.quotient,
        address,
        deadline,
      ]

      return { args, functionName: "addLiquidity" }
    }
  }, [currencies, parsedAmounts, poolState, pool, allowedSlippage])

  const { config, error } = usePrepareContractWrite({
    abi: uniswapV2RouterAbi as any,
    address: RCPSWAP_ROUTER_ADDRESS[chainId],
    account: address,
    args: [...(calldata?.args ?? [])] as any,
    functionName: (calldata?.functionName ?? "") as any,
    value: calldata?.value,
    enabled: Boolean(calldata && calldata.args && calldata?.functionName),
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
      setAttemptingTxn(false)

      const baseText =
        "Add " +
        parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
        " " +
        currencies[Field.CURRENCY_A]?.symbol +
        " and " +
        parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
        " " +
        currencies[Field.CURRENCY_B]?.symbol
      addTransaction(address ?? "", chainId, data.hash, baseText)

      setTxHash(data.hash)

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
    onError: () => {
      setAttemptingTxn(false)
    },
  })

  const onAdd = async () => {
    try {
      setAttemptingTxn(true)
      await writeAsync?.()
    } catch (err) {
      console.log(err)
    }
  }

  const modalHeader = () => {
    return noLiquidity ? (
      <AutoColumn gap="20px">
        <LightCard mt="20px" borderRadius="20px">
          <RowFlat>
            <Text
              fontSize="48px"
              fontWeight={500}
              lineHeight="42px"
              marginRight={10}
            >
              {currencies[Field.CURRENCY_A]?.symbol +
                "/" +
                currencies[Field.CURRENCY_B]?.symbol}
            </Text>
            <DoubleCurrencyLogo
              currency0={currencies[Field.CURRENCY_A]}
              currency1={currencies[Field.CURRENCY_B]}
              size={30}
            />
          </RowFlat>
        </LightCard>
      </AutoColumn>
    ) : (
      <AutoColumn gap="20px">
        <RowFlat style={{ marginTop: "20px" }}>
          <Text
            fontSize="48px"
            fontWeight={500}
            lineHeight="42px"
            marginRight={10}
          >
            {liquidityMinted?.toSignificant(6)}
          </Text>
          <DoubleCurrencyLogo
            currency0={currencies[Field.CURRENCY_A]}
            currency1={currencies[Field.CURRENCY_B]}
            size={30}
          />
        </RowFlat>
        <Row>
          <Text fontSize="24px">
            {currencies[Field.CURRENCY_A]?.symbol +
              "/" +
              currencies[Field.CURRENCY_B]?.symbol +
              " Pool Tokens"}
          </Text>
        </Row>
        <TYPE.italic fontSize={12} textAlign="left" padding={"8px 0 0 0 "}>
          {`Output is estimated. If the price changes by more than ${allowedSlippage}% your transaction will revert.`}
        </TYPE.italic>
      </AutoColumn>
    )
  }

  const modalBottom = () => {
    return (
      <ConfirmAddModalBottom
        price={price}
        currencies={currencies}
        parsedAmounts={parsedAmounts}
        noLiquidity={noLiquidity}
        onAdd={onAdd}
        poolTokenPercentage={poolTokenPercentage}
      />
    )
  }

  const pendingText = `Supplying ${parsedAmounts[
    Field.CURRENCY_A
  ]?.toSignificant(6)} ${
    currencies[Field.CURRENCY_A]?.symbol
  } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${
    currencies[Field.CURRENCY_B]?.symbol
  }`

  const handleCurrencyASelect = useCallback(
    (currencyA: Type) => {
      const newCurrencyIdA = getCurrencyId(currencyA)
      if (newCurrencyIdA === currencyIdB) {
        router.push(`/pool/add/${currencyIdB}/${currencyIdA}`)
      } else {
        router.push(`/pool/add/${newCurrencyIdA}/${currencyIdB}`)
      }
    },
    [currencyIdB, router, currencyIdA]
  )
  const handleCurrencyBSelect = useCallback(
    (currencyB: Type) => {
      const newCurrencyIdB = getCurrencyId(currencyB)
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          router.push(`/pool/add/${currencyIdB}/${newCurrencyIdB}`)
        } else {
          router.push(`/pool/add/${newCurrencyIdB}`)
        }
      } else {
        router.push(
          `/pool/add/${
            currencyIdA ? currencyIdA : Native.onChain(chainId).symbol
          }/${newCurrencyIdB}`
        )
      }
    },
    [currencyIdA, router, currencyIdB]
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldInput(Field.CURRENCY_A)("")
      onFieldInput(Field.CURRENCY_B)("")
    }
    setTxHash("")
  }, [onFieldInput, txHash, setShowConfirm])

  const isCreate = pathname.includes("/create")

  return (
    <>
      <BodyWrapper>
        <AddRemoveTabs creating={isCreate} adding={true} />
        <Wrapper>
          <TransactionConfirmationModal
            isOpen={showConfirm}
            onDismiss={handleDismissConfirmation}
            attemptingTxn={attemptingTxn}
            hash={txHash}
            content={() => (
              <ConfirmationModalContent
                title={
                  noLiquidity ? "You are creating a pool" : "You will receive"
                }
                onDismiss={handleDismissConfirmation}
                topContent={modalHeader}
                bottomContent={modalBottom}
              />
            )}
            pendingText={pendingText}
            currencyToAdd={pool?.liquidityToken}
          />
          <AutoColumn gap="20px">
            {noLiquidity ||
              (isCreate ? (
                <ColumnCenter>
                  <BlueCard>
                    <AutoColumn gap="10px">
                      <TYPE.link fontWeight={600} color={"primaryText1"}>
                        You are the first liquidity provider.
                      </TYPE.link>
                      <TYPE.link fontWeight={400} color={"primaryText1"}>
                        The ratio of tokens you add will set the price of this
                        pool.
                      </TYPE.link>
                      <TYPE.link fontWeight={400} color={"primaryText1"}>
                        Once you are happy with the rate click supply to review.
                      </TYPE.link>
                    </AutoColumn>
                  </BlueCard>
                </ColumnCenter>
              ) : (
                <ColumnCenter>
                  <BlueCard>
                    <AutoColumn gap="10px">
                      <TYPE.link fontWeight={400} color={"primaryText1"}>
                        <b>Tip:</b> When you add liquidity, you will receive
                        pool tokens representing your position. These tokens
                        automatically earn fees proportional to your share of
                        the pool, and can be redeemed at any time.
                      </TYPE.link>
                    </AutoColumn>
                  </BlueCard>
                </ColumnCenter>
              ))}
            <CurrencyInputPanel
              value={
                independentField === Field.CURRENCY_A
                  ? inputs[Field.CURRENCY_A]
                  : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? ""
              }
              onUserInput={onFieldInput(Field.CURRENCY_A)}
              onMax={() => {
                onFieldInput(Field.CURRENCY_A)(
                  currencyBalances[Field.CURRENCY_A]?.toExact() ?? ""
                )
              }}
              onCurrencySelect={handleCurrencyASelect}
              showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
              currency={currencies[Field.CURRENCY_A]}
              id="add-liquidity-input-tokena"
              showCommonBases
            />
            <ColumnCenter>
              <FiPlus size="16" color={theme?.text2} />
            </ColumnCenter>
            <CurrencyInputPanel
              value={
                independentField === Field.CURRENCY_B
                  ? inputs[Field.CURRENCY_B]
                  : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? ""
              }
              onUserInput={onFieldInput(Field.CURRENCY_B)}
              onCurrencySelect={handleCurrencyBSelect}
              onMax={() => {
                onFieldInput(Field.CURRENCY_B)(
                  currencyBalances[Field.CURRENCY_B]?.toExact() ?? ""
                )
              }}
              showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
              currency={currencies[Field.CURRENCY_B]}
              id="add-liquidity-input-tokenb"
              showCommonBases
            />
            {currencies[Field.CURRENCY_A] &&
              currencies[Field.CURRENCY_B] &&
              poolState !== SwapV2PoolState.INVALID && (
                <>
                  <LightCard padding="0px" borderRadius={"20px"}>
                    <RowBetween padding="1rem">
                      <TYPE.subHeader fontWeight={500} fontSize={14}>
                        {noLiquidity ? "Initial prices" : "Prices"} and pool
                        share
                      </TYPE.subHeader>
                    </RowBetween>{" "}
                    <LightCard padding="1rem" borderRadius={"20px"}>
                      <PoolPriceBar
                        currencies={currencies}
                        poolTokenPercentage={poolTokenPercentage}
                        noLiquidity={noLiquidity}
                        price={price}
                      />
                    </LightCard>
                  </LightCard>
                </>
              )}

            <Checker.Connect>
              <Checker.Network chainId={chainId}>
                <Checker.Amounts
                  amounts={[
                    parsedAmounts[Field.CURRENCY_A],
                    parsedAmounts[Field.CURRENCY_B],
                  ]}
                  chainId={chainId}
                >
                  <Checker.Error
                    error={
                      poolState === SwapV2PoolState.INVALID
                        ? "Invalid Pair"
                        : undefined
                    }
                  >
                    <Checker.ApproveTwoERC20
                      amounts={[
                        parsedAmounts[Field.CURRENCY_A],
                        parsedAmounts[Field.CURRENCY_B],
                      ]}
                      contract={RCPSWAP_ROUTER_ADDRESS[chainId]}
                    >
                      {(disabled) => (
                        <ButtonError
                          onClick={() => {
                            expertMode ? onAdd() : setShowConfirm(true)
                          }}
                          disabled={disabled}
                          error={
                            !!parsedAmounts[Field.CURRENCY_A] &&
                            !!parsedAmounts[Field.CURRENCY_B]
                          }
                        >
                          <Text fontSize={20} fontWeight={500}>
                            Supply
                          </Text>
                        </ButtonError>
                      )}
                    </Checker.ApproveTwoERC20>
                  </Checker.Error>
                </Checker.Amounts>
              </Checker.Network>
            </Checker.Connect>
          </AutoColumn>
        </Wrapper>
      </BodyWrapper>
      {pool && !noLiquidity && poolState !== SwapV2PoolState.INVALID ? (
        <AutoColumn
          style={{
            minWidth: "20rem",
            width: "100%",
            maxWidth: "400px",
            marginTop: "1rem",
          }}
        >
          <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pool} />
        </AutoColumn>
      ) : null}
    </>
  )
}
