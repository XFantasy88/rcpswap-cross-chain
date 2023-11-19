import { Amount, Native, Type, Token } from "rcpswap/currency"
import { TokenAmount, Token as SymbiosisToken } from "@rcpswap/symbiosis"

export function convertTokenFromSymbiosis(token: SymbiosisToken) {
  return token.isNative
    ? Native.onChain(token.chainId)
    : new Token({
        address: token.address,
        chainId: token.chainId,
        decimals: token.decimals,
        name: token?.name,
        symbol: token?.symbol,
      })
}

export function convertAmountFromSymbiosis(amount: TokenAmount) {
  const token = convertTokenFromSymbiosis(amount.token)

  return Amount.fromRawAmount(token, amount.raw.toString())
}

export function convertTokenToSymbiosis(token: Type) {
  return new SymbiosisToken({
    address: token.isNative ? "" : token.address,
    chainId: token.chainId,
    decimals: token.decimals,
    name: token?.name ?? "",
    symbol: token?.symbol ?? "",
    isNative: token.isNative,
  })
}

export function convertAmountToSymbiosis(amount: Amount<Type>) {
  const token = convertTokenToSymbiosis(amount.currency)

  return new TokenAmount(token, amount.quotient)
}
