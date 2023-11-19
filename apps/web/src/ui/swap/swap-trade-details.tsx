import AdvancedFusionDetailsDropdown from "@/components/swap/AdvancedFusionDetailsDropdown"
import AdvancedSwapDetailsDropdown from "@/components/swap/AdvancedSwapDetailsDropdown"
import { useDerivedSwapState, useSwapTrade } from "@/ui/swap/derived-swap-state-provider"
import { UseTradeReturn } from "@rcpswap/router"

export default function SwapTradeDetails() {
  const {
    state: { swapMode },
  } = useDerivedSwapState()

  const trade = useSwapTrade().data as UseTradeReturn

  return swapMode === 0 ? (
    <AdvancedSwapDetailsDropdown trade={trade} />
  ) : (
    <AdvancedFusionDetailsDropdown trade={trade} />
  )
}
