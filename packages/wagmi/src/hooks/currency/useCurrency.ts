import { ChainId } from "rcpswap/chain"
import { Native, Type } from "rcpswap/currency"
import { useTokenWithCache } from "../tokens"

export function useCurrency(
  currencyId: string | undefined,
  chainId: ChainId = ChainId.ARBITRUM_NOVA
): Type | undefined {
  const nativeCurrency = Native.onChain(chainId)
  const isETH = currencyId?.toUpperCase() === nativeCurrency.symbol
  const { data: token } = useTokenWithCache({
    chainId,
    address: isETH ? undefined : currencyId,
    enabled: !isETH && currencyId !== undefined,
  })
  return isETH ? nativeCurrency : token
}
