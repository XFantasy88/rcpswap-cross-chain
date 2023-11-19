import { ChainId } from "rcpswap/chain"
import {
  ARB,
  BRICK,
  DAI,
  MOON,
  MOOND,
  Token,
  USDC,
  USDT,
  WBTC,
  WETH9,
  WNATIVE,
} from "rcpswap/currency"

export const BASES_TO_TRACK_LIQUIDITY_FOR: {
  readonly [chainId in ChainId]: Token[]
} = {
  [ChainId.ARBITRUM_NOVA]: [
    WNATIVE[ChainId.ARBITRUM_NOVA],
    USDC[ChainId.ARBITRUM_NOVA],
    DAI[ChainId.ARBITRUM_NOVA],
    ARB[ChainId.ARBITRUM_NOVA],
    MOON[ChainId.ARBITRUM_NOVA],
    BRICK[ChainId.ARBITRUM_NOVA],
    MOOND[ChainId.ARBITRUM_NOVA],
  ],
  [ChainId.POLYGON]: [
    WNATIVE[ChainId.POLYGON],
    WETH9[ChainId.POLYGON],
    WBTC[ChainId.POLYGON],
    USDC[ChainId.POLYGON],
    USDT[ChainId.POLYGON],
    DAI[ChainId.POLYGON],
  ],
}
