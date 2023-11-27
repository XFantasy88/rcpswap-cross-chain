"use client"

import React, { useCallback, useContext, useMemo, useState } from "react"
import { FiArrowDown, FiPlus } from "react-icons/fi"
import { Text } from "rebass"
import { ThemeContext } from "styled-components"
import {
  ButtonPrimary,
  ButtonError,
  ButtonConfirmed,
} from "@/components/Button"
import { BlueCard, LightCard } from "@/components/Card"
import { AutoColumn, ColumnCenter } from "@/components/Column"
import TransactionConfirmationModal, {
  ConfirmationModalContent,
} from "@/components/TransactionConfirmationModal"
import CurrencyInputPanel from "@/components/CurrencyInputPanel"
import DoubleCurrencyLogo from "@/components/DoubleLogo"
import { AddRemoveTabs } from "@/components/NavigationTabs"
import { MinimalPositionCard } from "@/components/PositionCard"
import Row, { RowBetween, RowFixed } from "@/components/Row"

import Slider from "@/components/Slider"
import CurrencyLogo from "@/components/CurrencyLogo"

import { StyledInternalLink, TYPE } from "@/theme"

import { useDebouncedChangeHandler } from "@rcpswap/hooks"
import {
  Dots,
  ClickableText,
  MaxButton,
  Wrapper,
} from "@/components/swap/styleds"
import {
  ApprovalState,
  useAccount,
  useContractWrite,
  useCurrency,
  usePrepareContractWrite,
  waitForTransaction,
} from "@rcpswap/wagmi"
import { ChainId } from "rcpswap/chain"
import {
  Field,
  useDerivedPoolRemoveState,
  usePoolRemoveInfo,
} from "./derived-pool-remove-state-provider"
import { useExpertMode, useSlippageTolerance } from "@rcpswap/hooks"
import { Percent, gasMargin, slippageAmount } from "rcpswap"
import { finalizeTransaction, useAddTransaction } from "@rcpswap/dexie"
import { Native, Type } from "rcpswap/currency"
import { getCurrencyId } from "@/utils"
import { useRouter } from "next/navigation"
import { BodyWrapper } from "../add/styleds"
import Checker from "@/components/Checker"
import { RCPSWAP_ROUTER_ADDRESS } from "@rcpswap/v2-sdk"
import { uniswapV2RouterAbi } from "rcpswap/abi"
import { useAddPopup } from "@/state/application/hooks"

export default function PoolRemoveWidget({
  currencyIdA,
  currencyIdB,
}: {
  currencyIdA?: string
  currencyIdB?: string
}) {
  const router = useRouter()
  const chainId = ChainId.ARBITRUM_NOVA

  const [currencyA, currencyB] = [
    useCurrency(currencyIdA, chainId) ?? undefined,
    useCurrency(currencyIdB, chainId) ?? undefined,
  ]
  const { address } = useAccount()
  const [tokenA, tokenB] = useMemo(
    () => [currencyA?.wrapped, currencyB?.wrapped],
    [currencyA, currencyB]
  )

  const theme = useContext(ThemeContext)

  // burn state
  const {
    state: { independentField, typedValue },
    mutate: { typeInput },
  } = useDerivedPoolRemoveState()

  const { pool, parsedAmounts } = usePoolRemoveInfo(
    currencyA ?? undefined,
    currencyB ?? undefined
  )

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [showDetailed, setShowDetailed] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState(false) // clicked confirm

  // txn values
  const [txHash, setTxHash] = useState<string>("")
  const [allowedSlippage] = useSlippageTolerance()
  const [expertMode] = useExpertMode()

  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo(
      "0"
    )
      ? "0"
      : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent("1", "100"))
      ? "<1"
      : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]:
      independentField === Field.LIQUIDITY
        ? typedValue
        : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? "",
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A
        ? typedValue
        : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? "",
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_B
        ? typedValue
        : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? "",
  }

  const atMaxAmount = parsedAmounts[Field.LIQUIDITY_PERCENT]?.equalTo(
    new Percent("1")
  )

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      return typeInput({ independentField: field, typedValue })
    },
    [typeInput]
  )

  const onLiquidityInput = useCallback(
    (typedValue: string): void => onUserInput(Field.LIQUIDITY, typedValue),
    [onUserInput]
  )
  const onCurrencyAInput = useCallback(
    (typedValue: string): void => onUserInput(Field.CURRENCY_A, typedValue),
    [onUserInput]
  )
  const onCurrencyBInput = useCallback(
    (typedValue: string): void => onUserInput(Field.CURRENCY_B, typedValue),
    [onUserInput]
  )

  // tx sending
  const addTransaction = useAddTransaction()
  const addPopup = useAddPopup()

  const calldata = useMemo(() => {
    if (
      !parsedAmounts[Field.CURRENCY_A] ||
      !parsedAmounts[Field.CURRENCY_B] ||
      !parsedAmounts[Field.LIQUIDITY] ||
      !parsedAmounts[Field.LIQUIDITY_PERCENT] ||
      !currencyA ||
      !currencyB ||
      !tokenA ||
      !tokenB ||
      !pool
    )
      return undefined

    const slippageTolerance = new Percent(
      Math.floor(Number(allowedSlippage) * 100),
      10000
    )

    const amountsMin = {
      [Field.CURRENCY_A]: slippageAmount(
        parsedAmounts[Field.CURRENCY_A],
        slippageTolerance
      )[0],
      [Field.CURRENCY_B]: slippageAmount(
        parsedAmounts[Field.CURRENCY_B],
        slippageTolerance
      )[0],
    }

    const currencyBIsETH = currencyB?.isNative

    const oneCurrencyIsETH = currencyA.isNative || currencyB.isNative

    const deadline = BigInt(Math.floor(Date.now() / 1000 + 1800).toString())

    if (oneCurrencyIsETH) {
      const functionName = "removeLiquidityETH"
      const args = [
        (currencyBIsETH ? tokenA : tokenB)?.address,
        parsedAmounts[Field.LIQUIDITY].quotient,
        amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B],
        amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A],
        address,
        deadline,
      ]

      return { functionName, args }
    } else {
      const functionName = "removeLiquidity"
      const args = [
        tokenA.address,
        tokenB.address,
        parsedAmounts[Field.LIQUIDITY].quotient,
        amountsMin[Field.CURRENCY_A],
        amountsMin[Field.CURRENCY_B],
        address,
        deadline,
      ]

      return { functionName, args }
    }
  }, [
    parsedAmounts,
    currencyA,
    currencyB,
    pool,
    allowedSlippage,
    tokenA,
    tokenB,
  ])

  const { config, error } = usePrepareContractWrite({
    abi: uniswapV2RouterAbi as any,
    address: RCPSWAP_ROUTER_ADDRESS[chainId],
    args: [...(calldata?.args ?? [])],
    functionName: calldata?.functionName,
    enabled: Boolean(calldata && calldata.args && calldata.functionName),
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
        "Remove " +
        parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
        " " +
        currencyA?.symbol +
        " and " +
        parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
        " " +
        currencyB?.symbol

      addTransaction(address ?? "", chainId, data.hash, baseText)

      setTxHash(data.hash)

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
    onError: () => {
      setAttemptingTxn(false)
    },
  })

  async function onRemove() {
    try {
      setAttemptingTxn(true)
      await writeAsync?.()
    } catch (err) {
      console.log(err)
    }
  }

  function modalHeader() {
    return (
      <AutoColumn gap={"md"} style={{ marginTop: "20px" }}>
        <RowBetween align="flex-end">
          <Text fontSize={24} fontWeight={500}>
            {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
          </Text>
          <RowFixed gap="4px">
            <CurrencyLogo currency={currencyA} size={24} />
            <Text fontSize={24} fontWeight={500} style={{ marginLeft: "10px" }}>
              {currencyA?.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowFixed>
          <FiPlus size="16" color={theme?.text2} />
        </RowFixed>
        <RowBetween align="flex-end">
          <Text fontSize={24} fontWeight={500}>
            {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
          </Text>
          <RowFixed gap="4px">
            <CurrencyLogo currency={currencyB} size={24} />
            <Text fontSize={24} fontWeight={500} style={{ marginLeft: "10px" }}>
              {currencyB?.symbol}
            </Text>
          </RowFixed>
        </RowBetween>

        <TYPE.italic
          fontSize={12}
          color={theme?.text2}
          textAlign="left"
          padding={"12px 0 0 0"}
        >
          {`Output is estimated. If the price changes by more than ${allowedSlippage}% your transaction will revert.`}
        </TYPE.italic>
      </AutoColumn>
    )
  }

  function modalBottom() {
    return (
      <>
        <RowBetween>
          <Text color={theme?.text2} fontWeight={500} fontSize={16}>
            {"UNI " + currencyA?.symbol + "/" + currencyB?.symbol} Burned
          </Text>
          <RowFixed>
            <DoubleCurrencyLogo
              currency0={currencyA}
              currency1={currencyB}
              margin={true}
            />
            <Text fontWeight={500} fontSize={16}>
              {parsedAmounts[Field.LIQUIDITY]?.toSignificant(6)}
            </Text>
          </RowFixed>
        </RowBetween>
        {pool && (
          <>
            <RowBetween>
              <Text color={theme?.text2} fontWeight={500} fontSize={16}>
                Price
              </Text>
              <Text fontWeight={500} fontSize={16} color={theme?.text1}>
                1 {currencyA?.symbol} ={" "}
                {tokenA ? pool.priceOf(tokenA).toSignificant(6) : "-"}{" "}
                {currencyB?.symbol}
              </Text>
            </RowBetween>
            <RowBetween>
              <div />
              <Text fontWeight={500} fontSize={16} color={theme?.text1}>
                1 {currencyB?.symbol} ={" "}
                {tokenB ? pool.priceOf(tokenB).toSignificant(6) : "-"}{" "}
                {currencyA?.symbol}
              </Text>
            </RowBetween>
          </>
        )}
        <ButtonPrimary onClick={onRemove}>
          <Text fontWeight={500} fontSize={20}>
            Confirm
          </Text>
        </ButtonPrimary>
      </>
    )
  }

  const pendingText = `Removing ${parsedAmounts[
    Field.CURRENCY_A
  ]?.toSignificant(6)} ${currencyA?.symbol} and ${parsedAmounts[
    Field.CURRENCY_B
  ]?.toSignificant(6)} ${currencyB?.symbol}`

  const liquidityPercentChangeCallback = useCallback(
    (value: number) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value.toString())
    },
    [onUserInput]
  )

  const oneCurrencyIsETH = currencyA?.isNative || currencyB?.isNative

  const oneCurrencyIsWETH = Boolean(
    currencyA?.equals(Native.onChain(currencyA.chainId).wrapped) ||
      currencyB?.equals(Native.onChain(currencyB.chainId).wrapped)
  )

  const handleSelectCurrencyA = useCallback(
    (currency: Type) => {
      if (currencyIdB && getCurrencyId(currency) === currencyIdB) {
        router.push(`/pool/remove/${getCurrencyId(currency)}/${currencyIdA}`)
      } else {
        router.push(`/pool/remove/${getCurrencyId(currency)}/${currencyIdB}`)
      }
    },
    [currencyIdA, currencyIdB, router]
  )

  const handleSelectCurrencyB = useCallback(
    (currency: Type) => {
      if (currencyIdA && getCurrencyId(currency) === currencyIdA) {
        router.push(`/pool/remove/${currencyIdB}/${getCurrencyId(currency)}`)
      } else {
        router.push(`/pool/remove/${currencyIdA}/${getCurrencyId(currency)}`)
      }
    },
    [currencyIdA, currencyIdB, router]
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)

    if (txHash) {
      onUserInput(Field.LIQUIDITY_PERCENT, "0")
    }
    setTxHash("")
  }, [onUserInput, txHash])

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] =
    useDebouncedChangeHandler(
      Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)),
      liquidityPercentChangeCallback
    )

  return (
    <>
      <BodyWrapper>
        <AddRemoveTabs creating={false} adding={false} />
        <Wrapper>
          <TransactionConfirmationModal
            isOpen={showConfirm}
            onDismiss={handleDismissConfirmation}
            attemptingTxn={attemptingTxn}
            hash={txHash ? txHash : ""}
            content={() => (
              <ConfirmationModalContent
                title={"You will receive"}
                onDismiss={handleDismissConfirmation}
                topContent={modalHeader}
                bottomContent={modalBottom}
              />
            )}
            pendingText={pendingText}
          />
          <AutoColumn gap="md">
            <BlueCard>
              <AutoColumn gap="10px">
                <TYPE.link fontWeight={400} color={"primaryText1"}>
                  <b>Tip:</b> Removing pool tokens converts your position back
                  into underlying tokens at the current rate, proportional to
                  your share of the pool. Accrued fees are included in the
                  amounts you receive.
                </TYPE.link>
              </AutoColumn>
            </BlueCard>
            <LightCard>
              <AutoColumn gap="20px">
                <RowBetween>
                  <Text fontWeight={500}>Amount</Text>
                  <ClickableText
                    fontWeight={500}
                    onClick={() => {
                      setShowDetailed(!showDetailed)
                    }}
                  >
                    {showDetailed ? "Simple" : "Detailed"}
                  </ClickableText>
                </RowBetween>
                <Row style={{ alignItems: "flex-end" }}>
                  <Text fontSize={72} fontWeight={500}>
                    {formattedAmounts[Field.LIQUIDITY_PERCENT]}%
                  </Text>
                </Row>
                {!showDetailed && (
                  <>
                    <Slider
                      value={innerLiquidityPercentage}
                      onChange={setInnerLiquidityPercentage}
                    />
                    <RowBetween>
                      <MaxButton
                        onClick={() =>
                          onUserInput(Field.LIQUIDITY_PERCENT, "25")
                        }
                        width="20%"
                      >
                        25%
                      </MaxButton>
                      <MaxButton
                        onClick={() =>
                          onUserInput(Field.LIQUIDITY_PERCENT, "50")
                        }
                        width="20%"
                      >
                        50%
                      </MaxButton>
                      <MaxButton
                        onClick={() =>
                          onUserInput(Field.LIQUIDITY_PERCENT, "75")
                        }
                        width="20%"
                      >
                        75%
                      </MaxButton>
                      <MaxButton
                        onClick={() =>
                          onUserInput(Field.LIQUIDITY_PERCENT, "100")
                        }
                        width="20%"
                      >
                        Max
                      </MaxButton>
                    </RowBetween>
                  </>
                )}
              </AutoColumn>
            </LightCard>
            {!showDetailed && (
              <>
                <ColumnCenter>
                  <FiArrowDown size="16" color={theme?.text2} />
                </ColumnCenter>
                <LightCard>
                  <AutoColumn gap="10px">
                    <RowBetween>
                      <Text fontSize={24} fontWeight={500}>
                        {formattedAmounts[Field.CURRENCY_A] || "-"}
                      </Text>
                      <RowFixed>
                        <CurrencyLogo
                          currency={currencyA}
                          style={{ marginRight: "12px" }}
                        />
                        <Text
                          fontSize={24}
                          fontWeight={500}
                          id="remove-liquidity-tokena-symbol"
                        >
                          {currencyA?.symbol}
                        </Text>
                      </RowFixed>
                    </RowBetween>
                    <RowBetween>
                      <Text fontSize={24} fontWeight={500}>
                        {formattedAmounts[Field.CURRENCY_B] || "-"}
                      </Text>
                      <RowFixed>
                        <CurrencyLogo
                          currency={currencyB}
                          style={{ marginRight: "12px" }}
                        />
                        <Text
                          fontSize={24}
                          fontWeight={500}
                          id="remove-liquidity-tokenb-symbol"
                        >
                          {currencyB?.symbol}
                        </Text>
                      </RowFixed>
                    </RowBetween>
                    {chainId && (oneCurrencyIsWETH || oneCurrencyIsETH) ? (
                      <RowBetween style={{ justifyContent: "flex-end" }}>
                        {oneCurrencyIsETH ? (
                          <StyledInternalLink
                            href={`/pool/remove/${
                              currencyA &&
                              currencyA.wrapped.equals(
                                Native.onChain(currencyA.chainId).wrapped
                              )
                                ? currencyA.wrapped.address
                                : currencyIdA
                            }/${
                              currencyB &&
                              currencyB.wrapped.equals(
                                Native.onChain(currencyB.chainId).wrapped
                              )
                                ? currencyB.wrapped.address
                                : currencyIdB
                            }`}
                          >
                            Receive {Native.onChain(chainId).wrapped.symbol}
                          </StyledInternalLink>
                        ) : oneCurrencyIsWETH ? (
                          <StyledInternalLink
                            href={`/remove/${
                              currencyA &&
                              currencyA.equals(
                                Native.onChain(currencyA.chainId).wrapped
                              )
                                ? Native.onChain(currencyA.chainId).wrapped
                                    .symbol
                                : currencyIdA
                            }/${
                              currencyB &&
                              currencyB.equals(
                                Native.onChain(currencyB.chainId).wrapped
                              )
                                ? Native.onChain(currencyB.chainId).wrapped
                                    .symbol
                                : currencyIdB
                            }`}
                          >
                            Receive {Native.onChain(chainId).wrapped.symbol}
                          </StyledInternalLink>
                        ) : null}
                      </RowBetween>
                    ) : null}
                  </AutoColumn>
                </LightCard>
              </>
            )}

            {showDetailed && (
              <>
                <CurrencyInputPanel
                  value={formattedAmounts[Field.LIQUIDITY]}
                  onUserInput={onLiquidityInput}
                  onMax={() => {
                    onUserInput(Field.LIQUIDITY_PERCENT, "100")
                  }}
                  showMaxButton={!atMaxAmount}
                  disableCurrencySelect
                  currency={pool?.liquidityToken}
                  pair={pool}
                  id="liquidity-amount"
                />
                <ColumnCenter>
                  <FiArrowDown size="16" color={theme?.text2} />
                </ColumnCenter>
                <CurrencyInputPanel
                  hideBalance={true}
                  value={formattedAmounts[Field.CURRENCY_A]}
                  onUserInput={onCurrencyAInput}
                  onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, "100")}
                  showMaxButton={!atMaxAmount}
                  currency={currencyA}
                  label={"Output"}
                  onCurrencySelect={handleSelectCurrencyA}
                  id="remove-liquidity-tokena"
                />
                <ColumnCenter>
                  <FiPlus size="16" color={theme?.text2} />
                </ColumnCenter>
                <CurrencyInputPanel
                  hideBalance={true}
                  value={formattedAmounts[Field.CURRENCY_B]}
                  onUserInput={onCurrencyBInput}
                  onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, "100")}
                  showMaxButton={!atMaxAmount}
                  currency={currencyB}
                  label={"Output"}
                  onCurrencySelect={handleSelectCurrencyB}
                  id="remove-liquidity-tokenb"
                />
              </>
            )}
            {pool && (
              <div style={{ padding: "10px 20px" }}>
                <RowBetween>
                  Price:
                  <div>
                    1 {currencyA?.symbol} ={" "}
                    {tokenA ? pool.priceOf(tokenA).toSignificant(6) : "-"}{" "}
                    {currencyB?.symbol}
                  </div>
                </RowBetween>
                <RowBetween>
                  <div />
                  <div>
                    1 {currencyB?.symbol} ={" "}
                    {tokenB ? pool.priceOf(tokenB).toSignificant(6) : "-"}{" "}
                    {currencyA?.symbol}
                  </div>
                </RowBetween>
              </div>
            )}
            <div style={{ position: "relative" }}>
              <Checker.Connect>
                <Checker.Network chainId={chainId}>
                  <Checker.Tokens tokens={[tokenA, tokenB]}>
                    <Checker.ApproveERC20
                      amount={parsedAmounts[Field.LIQUIDITY]}
                      contract={RCPSWAP_ROUTER_ADDRESS[chainId]}
                    >
                      {(approvalSubmitted, approvalState, approve) => (
                        <RowBetween>
                          <ButtonConfirmed
                            onClick={() => approve?.()}
                            confirmed={approvalState === ApprovalState.APPROVED}
                            disabled={
                              approvalState !== ApprovalState.NOT_APPROVED
                            }
                            mr="0.5rem"
                            fontWeight={500}
                            fontSize={16}
                          >
                            {approvalState === ApprovalState.PENDING ? (
                              <Dots>Approving</Dots>
                            ) : approvalState === ApprovalState.APPROVED ? (
                              "Approved"
                            ) : (
                              "Approve"
                            )}
                          </ButtonConfirmed>
                          <ButtonError
                            onClick={() => {
                              expertMode ? onRemove() : setShowConfirm(true)
                            }}
                            disabled={approvalState !== ApprovalState.APPROVED}
                            error={
                              !!parsedAmounts[Field.CURRENCY_A] &&
                              !!parsedAmounts[Field.CURRENCY_B]
                            }
                          >
                            <Text fontSize={16} fontWeight={500}>
                              Remove
                            </Text>
                          </ButtonError>
                        </RowBetween>
                      )}
                    </Checker.ApproveERC20>
                  </Checker.Tokens>
                </Checker.Network>
              </Checker.Connect>
            </div>
          </AutoColumn>
        </Wrapper>
      </BodyWrapper>

      {pool ? (
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
