import { TokenAddressMap } from "@/state/lists/hooks"
import { Token, Type } from "rcpswap/currency"

export function isTokenOnList(defaultTokens: TokenAddressMap, currency?: Type): boolean {
  if (currency?.isNative) return true
  return Boolean(currency instanceof Token && defaultTokens[currency.chainId]?.[currency.address])
}