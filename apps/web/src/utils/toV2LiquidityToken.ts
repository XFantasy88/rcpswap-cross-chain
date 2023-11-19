import { Pool } from "@rcpswap/v2-sdk"
import { Token } from "rcpswap/currency"

export function toV2LiquidityToken([tokenA, tokenB]: [Token, Token]): Token {
  return new Token({
    chainId: tokenA.chainId,
    address: Pool.getAddress(tokenA, tokenB),
    decimals: 18,
    symbol: "LP-RCPswap",
    name: "RCPswap LP Token",
  })
}
