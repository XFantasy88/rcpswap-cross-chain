import { ChainId } from '../../chain/index.js'

export const nativeCurrencyIds = {
  [ChainId.POLYGON]: 'MATIC',
  [ChainId.ARBITRUM_NOVA]: 'ETH',
} as const
