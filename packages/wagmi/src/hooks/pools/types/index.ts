import { Pool } from '@rcpswap/v2-sdk'
import { ChainId } from 'rcpswap/chain'
import { Type } from 'rcpswap/currency'
import { TradeType } from 'rcpswap/dex'

export enum PoolType {
  Pool = 'SwapV2'
}

export interface UsePoolsParams {
  chainId: ChainId
  currencyA: Type | undefined
  currencyB: Type | undefined
  tradeType?: TradeType
  enabled?: boolean
  withCombinations?: boolean
}

export type UsePoolsReturn = {
  pools: Pool[] | undefined
}
