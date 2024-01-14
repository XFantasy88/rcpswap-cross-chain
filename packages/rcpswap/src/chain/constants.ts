export const ChainId = {
  BSC: 56,
  POLYGON: 137,
  ARBITRUM_ONE: 42161,
  ARBITRUM_NOVA: 42170,
} as const
export type ChainId = (typeof ChainId)[keyof typeof ChainId]

// export const isChainId = (chainId: number): chainId is ChainId => Object.values(ChainId).includes(chainId as ChainId)

export const ChainKey = {
  [ChainId.BSC]: "bsc",
  [ChainId.POLYGON]: "polygon",
  [ChainId.ARBITRUM_ONE]: "arbitrum-one",
  [ChainId.ARBITRUM_NOVA]: "arbitrum-nova",
} as const
export type ChainKey = (typeof ChainKey)[keyof typeof ChainKey]
