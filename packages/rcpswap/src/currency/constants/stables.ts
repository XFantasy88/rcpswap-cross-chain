import { ChainId } from "../../chain/index.js"
import { BUSD, DAI, USDC, USDCe, USDT } from "./tokens.js"

export const STABLES = {
  [ChainId.BSC]: [
    BUSD[ChainId.BSC],
    USDC[ChainId.BSC],
    USDT[ChainId.BSC],
    DAI[ChainId.BSC],
  ],
  [ChainId.POLYGON]: [
    USDC[ChainId.POLYGON],
    USDT[ChainId.POLYGON],
    DAI[ChainId.POLYGON],
  ],
  [ChainId.ARBITRUM_ONE]: [
    USDC[ChainId.ARBITRUM_ONE],
    USDCe[ChainId.ARBITRUM_ONE],
    USDT[ChainId.ARBITRUM_ONE],
    DAI[ChainId.ARBITRUM_ONE],
  ],
  [ChainId.ARBITRUM_NOVA]: [
    USDC[ChainId.ARBITRUM_NOVA],
    USDT[ChainId.ARBITRUM_NOVA],
    DAI[ChainId.ARBITRUM_NOVA],
  ],
  [ChainId.AVALANCHE]: [
    USDC[ChainId.AVALANCHE],
    USDT[ChainId.AVALANCHE],
    DAI[ChainId.AVALANCHE],
  ],
} as const
