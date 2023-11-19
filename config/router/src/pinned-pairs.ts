import { ChainId } from "rcpswap/chain"
import { Token } from "rcpswap/currency"

export const PINNED_PAIRS: {
  readonly [chainId in ChainId]?: [Token, Token][]
} = {}
