import { Native, Type } from "rcpswap/currency"

export const getCurrencyId = (currency: Type) => {
  if (currency.wrapped.equals(Native.onChain(currency.chainId).wrapped)) {
    return Native.onChain(currency.chainId).symbol
  }
  return currency.wrapped.address
}
