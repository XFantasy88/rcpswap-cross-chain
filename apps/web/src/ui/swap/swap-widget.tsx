import styled from "styled-components"
import SwapHeader from "./swap-header"
import { Wrapper, BottomGrouping } from "@/components/swap/styleds"
import { AutoColumn } from "@/components/Column"
import SwapToken0Input from "./swap-token0-input"
import SwapTokenSlideInput from "./swap-token-slide-input"
import SwapSwitchTokensButton from "./swap-switch-tokens-button"
import SwapToken1Input from "./swap-token1-input"
import SwapTradeButton from "./swap-trade-button"
import SwapTradeCallbackError from "./swap-trade-callback-error"
import Banner from "@/components/Banner"
import SwapTradeDetails from "./swap-trade-details"
import SwapTradeStateInfo from "./swap-trade-state-info"
import SwapTradeConfirmModal from "./swap-trade-confirm-modal"

export const BodyWrapper = styled.div`
  position: relative;
  max-width: 420px;
  width: 100%;
  background: ${({ theme }) => theme.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 30px;
  z-index: 1;
  /* padding: 1rem; */
`

export default function SwapWidget() {
  return (
    <>
      <BodyWrapper>
        <SwapHeader />
        <Wrapper id="swap-widget">
          <SwapTradeConfirmModal />
          <AutoColumn gap="md">
            <SwapToken0Input />
            <SwapTokenSlideInput />
            <SwapSwitchTokensButton />
            <SwapToken1Input />
            <SwapTradeStateInfo />
            <BottomGrouping>
              <SwapTradeButton />
              <SwapTradeCallbackError />
            </BottomGrouping>
          </AutoColumn>
        </Wrapper>
      </BodyWrapper>
      <SwapTradeDetails />
      <Banner />
    </>
  )
}
