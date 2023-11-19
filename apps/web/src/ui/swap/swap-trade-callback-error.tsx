import { SwapCallbackError } from "@/components/swap/styleds"
import { useExpertMode } from "@rcpswap/hooks"
import { useDerivedSwapTradeState } from "./derived-swap-trade-state-provider"

export default function SwapTradeCallbackError() {
  const [isExpertMode] = useExpertMode()

  const {
    state: { swapErrorMessage },
  } = useDerivedSwapTradeState()

  return isExpertMode && swapErrorMessage ? (
    <SwapCallbackError error={swapErrorMessage} />
  ) : null
}
