import { ChainId } from '../../chain/index.js'
import { Native } from '../Native.js'

export const defaultQuoteCurrency = {
  [ChainId.POLYGON]: Native.onChain(ChainId.POLYGON),
  [ChainId.ARBITRUM_NOVA]: Native.onChain(ChainId.ARBITRUM_NOVA),
} as const
