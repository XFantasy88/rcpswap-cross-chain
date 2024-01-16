import { ChainId } from "../../chain/index.js"

export const nativeCurrencyIds = {
  [ChainId.BSC]: "BNB",
  [ChainId.POLYGON]: "MATIC",
  [ChainId.ARBITRUM_ONE]: "ETH",
  [ChainId.ARBITRUM_NOVA]: "ETH",
  [ChainId.AVALANCHE]: "AVAX",
} as const
