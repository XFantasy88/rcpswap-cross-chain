import { ChainId } from "../chain"
import {
  ARB,
  BRICK,
  DAI,
  MOON,
  USDC,
  USDT,
  WBTC,
  WETH9,
  WNATIVE,
} from "../currency"

export const SUGGESTED_TOKEN_BASES = {
  [ChainId.POLYGON]: [
    WNATIVE[ChainId.POLYGON],
    WETH9[ChainId.POLYGON],
    WBTC[ChainId.POLYGON],
    USDC[ChainId.POLYGON],
    USDT[ChainId.POLYGON],
    DAI[ChainId.POLYGON],
  ],
  [ChainId.ARBITRUM_ONE]: [
    WNATIVE[ChainId.ARBITRUM_ONE],
    WBTC[ChainId.ARBITRUM_ONE],
    USDC[ChainId.ARBITRUM_ONE],
    USDT[ChainId.ARBITRUM_ONE],
    DAI[ChainId.ARBITRUM_ONE],
  ],
  [ChainId.ARBITRUM_NOVA]: [
    WNATIVE[ChainId.ARBITRUM_NOVA],
    USDC[ChainId.ARBITRUM_NOVA],
    DAI[ChainId.ARBITRUM_NOVA],
    ARB[ChainId.ARBITRUM_NOVA],
    MOON[ChainId.ARBITRUM_NOVA],
    BRICK[ChainId.ARBITRUM_NOVA],
  ],
}
