import React, { useContext } from "react"
import styled, { ThemeContext } from "styled-components"
import { Text } from "rebass"

import { AutoColumn } from "@/components/Column"
import Row, { RowFixed } from "@/components/Row"
import CoinSVG from "@/components/svgs/Coin"
import { UseTradeReturn } from "@rcpswap/router"
import { usePrice } from "@rcpswap/react-query"
import { Amount } from "rcpswap/currency"
import Image from "next/image"
import { SUPPORTED_DEX_INFO } from "@/config"

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  padding-top: 16px;
  padding-bottom: 16px;
  margin-top: 1rem;
  width: 100%;
  max-width: 400px;
  border-radius: 20px;
  color: ${({ theme }) => theme.text2};
  background-color: ${({ theme }) => theme.advancedBG};
  z-index: -1;

  transform: ${({ show }) => (show ? "translateY(0%)" : "translateY(-100%)")};
  transition: transform 300ms ease-in-out;
`

const DexLogo = styled(Image)`
  width: 18px;
  height: 18px;
  padding: 2px;
  border: 1px solid ${({ theme }) => theme.text4};
  border-radius: 5px;
  margin: 1px 6px 0;
`

export default function AdvancedFusionDetailsDropdown({
  trade,
}: {
  trade?: UseTradeReturn
}) {
  const theme = useContext(ThemeContext)
  const { data: price, isInitialLoading: isLoading } = usePrice({
    chainId: trade?.amountOut?.currency.chainId,
    address: trade?.amountOut?.currency.wrapped.address,
  })

  const saving =
    trade?.bestSingleAmountOut &&
    trade.amountOut &&
    trade.amountOut.greaterThan(trade.bestSingleAmountOut)
      ? trade.amountOut
          .subtract(trade.bestSingleAmountOut)
          .subtract(
            trade.feeAmount ?? Amount.fromRawAmount(trade.amountOut.currency, 0)
          )
      : undefined

  return saving && saving.greaterThan(0) ? (
    <AdvancedDetailsFooter show={Boolean(saving && saving.greaterThan(0))}>
      <AutoColumn style={{ padding: "0 30px" }}>
        <Row>
          <RowFixed
            style={{
              padding: "10px",
              borderRadius: "50%",
              background: theme?.bg3,
              color: theme?.text1,
            }}
          >
            <CoinSVG />
          </RowFixed>
          <AutoColumn style={{ marginLeft: "30px" }}>
            <RowFixed>
              <Text fontSize={15} color={theme?.green1} fontWeight={600}>
                {saving
                  .multiply(price?.greaterThan(0) ? price : 1)
                  .toSignificant(3) +
                  " " +
                  (price?.greaterThan(0)
                    ? "$"
                    : trade?.amountOut?.currency?.symbol)}
              </Text>
              <Text fontSize={14} color={theme?.text2} marginLeft={"5px"}>
                in saving
              </Text>
            </RowFixed>
            <RowFixed>
              <Text fontSize={14} color={theme?.text2}>
                Compared to
              </Text>
              {/* eslint-disable */}
              <DexLogo
                src={
                  SUPPORTED_DEX_INFO[(trade?.bestSingleDex ?? "rcp") as string]
                    .image
                }
                width={18}
                height={18}
                alt="dex"
              ></DexLogo>
              <Text fontSize={14} color={theme?.text2}>
                {trade?.bestSingleDex ?? "RCP"}
                {trade?.bestSingleDex !== "TraderJoe" && "Swap"}.
              </Text>
            </RowFixed>
          </AutoColumn>
        </Row>
      </AutoColumn>
    </AdvancedDetailsFooter>
  ) : null
}
