import CurrencyInputPanel from "@/components/CurrencyInputPanel"
import {
  useDerivedSwapState,
  useSwapTrade,
  useSymbiosisTrade,
} from "@/ui/swap/derived-swap-state-provider"
import { UseTradeReturn } from "@rcpswap/router"
import { Amount } from "rcpswap/currency"

export default function SwapToken1Input() {
  const {
    state: { token1, chainId1, token0, swapMode, swapAmount, chainId0 },
    mutate: { setToken1, setChainId1 },
  } = useDerivedSwapState()

  const trade = useSwapTrade().data as UseTradeReturn
  const { data: symbiosis } = useSymbiosisTrade()

  return (
    <CurrencyInputPanel
      value={
        chainId0 === chainId1
          ? trade?.amountOut
              ?.subtract(
                trade.feeAmount ??
                  Amount.fromRawAmount(trade.amountOut.currency, 0)
              )
              .toExact() ?? ""
          : symbiosis?.amountOut?.toExact() ?? ""
      }
      onUserInput={() => {}}
      label={"To"}
      showMaxButton={false}
      currency={token1}
      onCurrencySelect={setToken1}
      hideChain={swapMode === 0}
      chainId={chainId1}
      onChainSelect={setChainId1}
      otherCurrency={token0}
      otherAmount={swapAmount ?? ""}
      id="swap-currency-output"
      inactive
      showPriceImpact
      // loading={swapMode === 1 && fusionSwap.loading}
    />
  )
}
