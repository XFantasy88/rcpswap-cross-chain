import React, { useContext, useMemo, useState } from "react"
import { FiRepeat } from "react-icons/fi"
import { Text } from "rebass"
import { ThemeContext } from "styled-components"
import { TYPE } from "@/theme"

import { warningSeverity } from "@/utils"
import { ButtonError } from "../Button"
import { AutoColumn } from "../Column"
import QuestionHelper from "../QuestionHelper"
import { AutoRow, RowBetween, RowFixed } from "../Row"
import FormattedPriceImpact from "./FormattedPriceImpact"
import { StyledBalanceMaxMini, SwapCallbackError } from "./styleds"
import { UseTradeReturn } from "@rcpswap/router"
import { computeRealizedLPFee } from "@/utils"
import { usePrice } from "@rcpswap/react-query"
import { Amount } from "rcpswap/currency"

export default function SwapModalFooter({
  trade,
  onConfirm,
  swapErrorMessage,
  disabledConfirm,
  swapMode,
}: {
  trade: any
  swapMode: number
  onConfirm: () => void
  swapErrorMessage: string | undefined
  disabledConfirm: boolean
}) {
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const theme = useContext(ThemeContext)

  const realizedLPFee = useMemo(
    () => (trade.route ? computeRealizedLPFee(trade) : undefined),
    [trade]
  )

  const severity = warningSeverity(trade?.priceImpact)

  const { data: price, isInitialLoading: isPriceLoading } = usePrice({
    chainId: trade?.amountOut?.currency.chainId,
    address: trade?.amountOut?.currency.wrapped.address,
  })

  const saving =
    swapMode === 1 &&
    trade?.bestSingleAmountOut &&
    trade.amountOut &&
    trade.amountOut.greaterThan(trade.bestSingleAmountOut)
      ? trade.amountOut
          .subtract(trade.bestSingleAmountOut)
          .subtract(
            trade.feeAmount ?? Amount.fromRawAmount(trade.amountOut.currency, 0)
          )
      : undefined

  return (
    <>
      <AutoColumn gap="0px">
        <RowBetween align="center">
          <Text fontWeight={400} fontSize={14} color={theme?.text2}>
            Price
          </Text>
          <Text
            fontWeight={500}
            fontSize={14}
            color={theme?.text1}
            style={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              textAlign: "right",
              paddingLeft: "10px",
            }}
          >
            {(showInverted
              ? trade?.swapPrice?.toSignificant(6)
              : trade?.swapPrice?.invert()?.toSignificant(6)) ?? "-"}
            &nbsp;
            {showInverted
              ? `${trade?.swapPrice?.quoteCurrency?.symbol} per ${trade?.swapPrice?.baseCurrency?.symbol}`
              : `${trade?.swapPrice?.baseCurrency?.symbol} per ${trade?.swapPrice?.quoteCurrency?.symbol}`}
            <StyledBalanceMaxMini
              onClick={() => setShowInverted(!showInverted)}
            >
              <FiRepeat size={14} />
            </StyledBalanceMaxMini>
          </Text>
        </RowBetween>

        <RowBetween>
          {swapMode === 0 && trade && (
            <>
              <RowFixed>
                <TYPE.black fontSize={14} fontWeight={400} color={theme?.text2}>
                  Minimum received
                </TYPE.black>
                <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
              </RowFixed>
              <RowFixed>
                <TYPE.black fontSize={14}>
                  {trade.minAmountOut?.toSignificant(4)}
                </TYPE.black>
                <TYPE.black fontSize={14} marginLeft={"4px"}>
                  {trade.amountOut?.currency.symbol}
                </TYPE.black>
              </RowFixed>
            </>
          )}
        </RowBetween>
        {swapMode === 0 && (
          <RowBetween>
            <RowFixed>
              <TYPE.black color={theme?.text2} fontSize={14} fontWeight={400}>
                Price Impact
              </TYPE.black>
              <QuestionHelper text="The difference between the market price and your price due to trade size." />
            </RowFixed>
            <FormattedPriceImpact priceImpact={trade?.priceImpact} />
          </RowBetween>
        )}
        {trade?.fee && (
          <RowBetween>
            <RowFixed>
              <TYPE.black color={theme?.text2} fontSize={14} fontWeight={400}>
                Symbiosis Fee
              </TYPE.black>
            </RowFixed>
            <TYPE.black fontSize={14}>{`${trade.fee.toSignificant(4)} ${
              trade?.fee?.currency?.wrapped?.symbol
            }`}</TYPE.black>
          </RowBetween>
        )}
        {swapMode === 0 && (
          <RowBetween>
            <RowFixed>
              <TYPE.black fontSize={14} fontWeight={400} color={theme?.text2}>
                Liquidity Provider Fee
              </TYPE.black>
              <QuestionHelper
                text={`A portion of each trade (0.25%) goes to liquidity providers and 0.05% for RCPswap Treasury.`}
              />
            </RowFixed>
            <TYPE.black fontSize={14}>
              {realizedLPFee
                ? realizedLPFee?.toSignificant(6) +
                  " " +
                  trade?.amountIn?.currency?.symbol
                : "-"}
            </TYPE.black>
          </RowBetween>
        )}
        {saving?.greaterThan(0) && (
          <RowBetween>
            <RowFixed>
              <Text fontSize={14} fontWeight={400} color={theme?.green1}>
                Saving
              </Text>
              <QuestionHelper
                text={`Saving compared with the best price found on any DEX on Nova.`}
              />
            </RowFixed>
            <TYPE.black fontSize={14}>
              {saving
                .multiply(price?.greaterThan(0) ? price : 1)
                .toSignificant(6) +
                " " +
                (price?.greaterThan(0)
                  ? "$"
                  : trade?.amountOut?.currency?.symbol)}
            </TYPE.black>
          </RowBetween>
        )}
      </AutoColumn>

      <AutoRow>
        <ButtonError
          onClick={onConfirm}
          disabled={disabledConfirm}
          error={severity > 2}
          style={{ margin: "10px 0 0 0" }}
          id="confirm-swap-or-send"
        >
          <Text fontSize={20} fontWeight={500}>
            {severity > 2 && swapMode === 0 ? "Swap Anyway" : "Confirm Swap"}
          </Text>
        </ButtonError>

        {swapErrorMessage ? (
          <SwapCallbackError error={swapErrorMessage} />
        ) : null}
      </AutoRow>
    </>
  )
}
