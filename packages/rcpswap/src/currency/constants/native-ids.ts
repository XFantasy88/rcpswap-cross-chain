import { ChainId } from "../../chain/index.js"

export const nativeCurrencyIds = {
  [ChainId.POLYGON]: "MATIC",
  [ChainId.ARBITRUM_NOVA]: "ETH",
  [ChainId.ARBITRUM_ONE]: "ETH",
} as const
