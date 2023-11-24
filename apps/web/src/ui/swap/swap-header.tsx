import React from "react"
import styled from "styled-components"

import Settings from "@/components/Settings"
import { RowBetween } from "@/components/Row"
import { TYPE } from "@/theme"
import ExchangeSVG from "@/components/svgs/Exchange"
import { useDerivedSwapState } from "@/ui/swap/derived-swap-state-provider"
import QuestionHelper from "@/components/QuestionHelper"

const StyledSwapHeader = styled.div`
  padding: 12px 1rem 0px 1rem;
  margin-bottom: -4px;
  width: 100%;
  max-width: 420px;
  color: ${({ theme }) => theme.text2};
  stroke: ${({ theme }) => theme.text2};
`

const PassiveTab = styled(TYPE.black)`
  color: ${({ theme }) => theme.text3};
`

const SwitchTitle = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`

const FUSION_TEXT =
  "xFusion is a DEX Aggregator Algorithm crafted to calculate the most efficient route for your entered trade, optimizing results and saving the most money, particularly advantageous for larger trades or higher volumes."
const SWAP_TEXT =
  "When using the ‘Swap’ function, you’re directly interacting only with RCPswapV2 pools, Unlike xFusion where you get deeper liquidity by accessing multiple DEXs and Pools."

export default function SwapHeader() {
  const {
    state: { swapMode },
    mutate: { switchSwapMode },
  } = useDerivedSwapState()

  return (
    <StyledSwapHeader>
      <RowBetween>
        <SwitchTitle>
          <TYPE.black fontWeight={500} onClick={switchSwapMode} ml={"8px"}>
            {swapMode === 0 ? "Swap" : "xFusion"}
          </TYPE.black>
          <QuestionHelper
            id="swap-mode-header"
            content={swapMode === 0 ? SWAP_TEXT : FUSION_TEXT}
          />
          {/* &nbsp;
          <span
            onClick={switchSwapMode}
            style={{ display: "flex", alignItems: "center" }}
          >
            <ExchangeSVG></ExchangeSVG>
          </span>
          <PassiveTab
            fontWeight={500}
            marginLeft={"5px"}
            onClick={switchSwapMode}
          >
            {swapMode === 0 ? "xFusion" : "Swap"}
          </PassiveTab> */}
        </SwitchTitle>
        <Settings />
      </RowBetween>
    </StyledSwapHeader>
  )
}
