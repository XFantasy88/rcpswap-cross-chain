import CurrencyInputPanel from "@/components/CurrencyInputPanel"
import { useDerivedSwapState } from "@/ui/swap/derived-swap-state-provider"

export default function SwapToken0Input() {
  const {
    state: { token0, chainId0, token1, swapAmount, swapMode },
    mutate: { setChainId0, setToken0, setSwapAmount },
  } = useDerivedSwapState()

  return (
    <CurrencyInputPanel
      label="From"
      value={swapAmount ?? ""}
      currency={token0}
      chainId={chainId0}
      onChainSelect={setChainId0}
      hideChain={swapMode === 0}
      onUserInput={setSwapAmount}
      onCurrencySelect={setToken0}
      otherCurrency={token1}
      top
      id="swap-currency-input"
    />
  )
}
