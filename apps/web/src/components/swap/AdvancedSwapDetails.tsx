import React, { useContext } from "react"
import { ThemeContext } from "styled-components"
import { TYPE } from "@/theme"
import { AutoColumn } from "../Column"
import QuestionHelper from "../QuestionHelper"
import { RowBetween, RowFixed } from "../Row"
import FormattedPriceImpact from "./FormattedPriceImpact"
import SwapRoute from "./SwapRoute"
import { UseTradeReturn } from "@rcpswap/router"
import { computeRealizedLPFee } from "@/utils"

function TradeSummary({ trade }: { trade: UseTradeReturn }) {
  const theme = useContext(ThemeContext)

  const realizedLPFee = computeRealizedLPFee(trade)

  return (
    <>
      <AutoColumn style={{ padding: "0 16px" }}>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme?.text2}>
              Minimum received
            </TYPE.black>
            <QuestionHelper
              id="minimum-received"
              content="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed."
            />
          </RowFixed>
          <RowFixed>
            <TYPE.black color={theme?.text1} fontSize={14}>
              {`${trade.minAmountOut?.toSignificant(4)} ${
                trade.amountOut?.currency.symbol
              }` ?? "-"}
            </TYPE.black>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme?.text2}>
              Price Impact
            </TYPE.black>
            <QuestionHelper
              id="price-impact-detail"
              content="The difference between the market price and estimated price due to trade size."
            />
          </RowFixed>
          <FormattedPriceImpact priceImpact={trade.priceImpact} />
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme?.text2}>
              Liquidity Provider Fee
            </TYPE.black>
            <QuestionHelper
              id="lp-fee"
              content={`A portion of each trade (0.25%) goes to liquidity providers and 0.05% for RCPswap Treasury.`}
            />
          </RowFixed>
          <TYPE.black fontSize={14} color={theme?.text1}>
            {realizedLPFee
              ? `${realizedLPFee.toSignificant(4)} ${
                  trade?.amountIn?.currency?.symbol
                }`
              : "-"}
          </TYPE.black>
        </RowBetween>
      </AutoColumn>
    </>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: UseTradeReturn
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const theme = useContext(ThemeContext)

  const showRoute = Boolean(trade && trade.route.legs.length > 1)

  return (
    <AutoColumn gap="0px">
      {trade && (
        <>
          <TradeSummary trade={trade} />
          {showRoute && (
            <>
              <RowBetween style={{ padding: "0 16px" }}>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <TYPE.black
                    fontSize={14}
                    fontWeight={400}
                    color={theme?.text2}
                  >
                    Route
                  </TYPE.black>
                  <QuestionHelper
                    id="route-detail"
                    content="Routing through these tokens resulted in the best price for your trade."
                  />
                </span>
                <SwapRoute trade={trade} />
              </RowBetween>
            </>
          )}
        </>
      )}
    </AutoColumn>
  )
}
