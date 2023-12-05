import React, { useContext, useMemo, useState } from "react"
import { FiArrowDown, FiAlertTriangle } from "react-icons/fi"
import { Text } from "rebass"
import { ThemeContext } from "styled-components"
import { TYPE } from "@/theme"
import { ButtonPrimary } from "../Button"

import { AutoColumn } from "../Column"
import CurrencyLogo from "../CurrencyLogo"
import { RowBetween, RowFixed } from "../Row"
import { TruncatedText, SwapShowAcceptChanges } from "./styleds"
import { UseTradeReturn } from "@rcpswap/router"
import { Amount } from "rcpswap/currency"
import { getShortenAddress, isAddress } from "@rcpswap/wagmi"
import { warningSeverity } from "@/utils"
import SlippageInfoModal from "../SlippageInfoModal"

export default function SwapModalHeader({
  trade,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
  isCross,
}: {
  trade: any
  recipient: string | undefined
  showAcceptChanges: boolean
  onAcceptChanges: () => void
  isCross: boolean
}) {
  const priceImpactSeverity = warningSeverity(trade?.priceImpact)

  const [showSlippageInfo, setShowSlippageInfo] = useState(false)

  const theme = useContext(ThemeContext)

  return (
    <>
      <AutoColumn gap={"md"} style={{ marginTop: "20px" }}>
        <RowBetween align="flex-end">
          <RowFixed gap={"0px"}>
            <CurrencyLogo
              currency={trade?.amountIn?.currency}
              size={24}
              style={{ marginRight: "12px" }}
            />
            <TruncatedText fontSize={24} fontWeight={500}>
              {trade?.amountIn?.toSignificant(6)}
            </TruncatedText>
          </RowFixed>
          <RowFixed gap={"0px"}>
            <Text fontSize={24} fontWeight={500} style={{ marginLeft: "10px" }}>
              {trade?.amountIn?.currency?.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowFixed>
          <FiArrowDown
            size="16"
            color={theme?.text2}
            style={{ marginLeft: "4px", minWidth: "16px" }}
          />
        </RowFixed>
        <RowBetween align="flex-end">
          <RowFixed gap={"0px"}>
            <CurrencyLogo
              currency={trade?.amountOut?.currency}
              size={24}
              style={{ marginRight: "12px" }}
            />
            <TruncatedText
              fontSize={24}
              fontWeight={500}
              color={
                priceImpactSeverity > 2
                  ? theme?.red1
                  : showAcceptChanges
                  ? theme?.primary1
                  : ""
              }
            >
              {trade?.amountOut
                ?.subtract(
                  trade?.feeAmount ??
                    Amount.fromRawAmount(trade.amountOut.currency, 0)
                )
                .toSignificant(6)}
            </TruncatedText>
          </RowFixed>
          <RowFixed gap={"0px"}>
            <Text fontSize={24} fontWeight={500} style={{ marginLeft: "10px" }}>
              {trade?.amountOut?.currency?.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        {showAcceptChanges ? (
          <SwapShowAcceptChanges justify="flex-start" gap={"0px"}>
            <RowBetween>
              <RowFixed>
                <FiAlertTriangle
                  size={20}
                  style={{ marginRight: "8px", minWidth: 24 }}
                />
                <TYPE.main color={theme?.primary1}> Price Updated</TYPE.main>
              </RowFixed>
              <ButtonPrimary
                style={{
                  padding: ".5rem",
                  width: "fit-content",
                  fontSize: "0.825rem",
                  borderRadius: "12px",
                }}
                onClick={onAcceptChanges}
              >
                Accept
              </ButtonPrimary>
            </RowBetween>
          </SwapShowAcceptChanges>
        ) : null}
        <AutoColumn
          justify="flex-start"
          gap="sm"
          style={{ padding: "12px 0 0 0px" }}
        >
          {
            <>
              <TYPE.italic textAlign="left" style={{ width: "100%" }}>
                {`Output is estimated. You will receive at least `}
                <b>
                  {trade?.minAmountOut
                    ?.subtract(
                      trade?.feeAmount ??
                        Amount.fromRawAmount(trade.minAmountOut.currency, 0)
                    )
                    .toSignificant(6)}
                  &nbsp;
                  {trade?.amountOut?.currency?.symbol}
                </b>
                {" or the transaction will revert."}
              </TYPE.italic>
              {isCross && (
                <>
                  <TYPE.italic textAlign="left" style={{ width: "100%" }}>
                    If the transaction is reverted, you will receive stablecoins
                    or WETH tokens on the destination network - that&apos;s done
                    to protect you from slippage and price fluctuations.
                  </TYPE.italic>
                  <TYPE.italic>
                    <a
                      style={{ cursor: "pointer", fontWeight: 500 }}
                      onClick={() => setShowSlippageInfo(true)}
                    >
                      Read More
                    </a>
                  </TYPE.italic>
                </>
              )}
            </>
          }
        </AutoColumn>
        {recipient !== undefined ? (
          <AutoColumn
            justify="flex-start"
            gap="sm"
            style={{ padding: "12px 0 0 0px" }}
          >
            <TYPE.main>
              Output will be sent to{" "}
              <b title={recipient}>
                {isAddress(recipient)
                  ? getShortenAddress(recipient)
                  : recipient}
              </b>
            </TYPE.main>
          </AutoColumn>
        ) : null}
      </AutoColumn>
      <SlippageInfoModal
        isOpen={showSlippageInfo}
        onDismiss={() => setShowSlippageInfo(false)}
      />
    </>
  )
}
