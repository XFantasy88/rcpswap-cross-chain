import { ChainId } from "../../chain/index.js"
import { DAI, USDC, USDT } from "./tokens.js"

export const STABLES = {
  [ChainId.POLYGON]: [
    USDC[ChainId.POLYGON],
    USDT[ChainId.POLYGON],
    DAI[ChainId.POLYGON],
  ],
  [ChainId.ARBITRUM_NOVA]: [
    USDC[ChainId.ARBITRUM_NOVA],
    USDT[ChainId.ARBITRUM_NOVA],
    DAI[ChainId.ARBITRUM_NOVA],
  ],
  [ChainId.ARBITRUM_ONE]: [
    USDC[ChainId.ARBITRUM_ONE],
    USDT[ChainId.ARBITRUM_ONE],
    DAI[ChainId.ARBITRUM_ONE],
  ],
} as const
