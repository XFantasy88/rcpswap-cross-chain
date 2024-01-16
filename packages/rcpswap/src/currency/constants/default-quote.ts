import { ChainId } from "../../chain/index.js"
import { Native } from "../Native.js"

export const defaultQuoteCurrency = {
  [ChainId.BSC]: Native.onChain(ChainId.BSC),
  [ChainId.POLYGON]: Native.onChain(ChainId.POLYGON),
  [ChainId.ARBITRUM_ONE]: Native.onChain(ChainId.ARBITRUM_ONE),
  [ChainId.ARBITRUM_NOVA]: Native.onChain(ChainId.ARBITRUM_NOVA),
  [ChainId.AVALANCHE]: Native.onChain(ChainId.AVALANCHE),
} as const
