import {
  RCPSWAP_FACTORY_ADDRESS,
  Pool,
  computePoolAddress,
  isRCPSwapChainId,
  RCPSWAP_INIT_CODE_HASH,
} from '@rcpswap/v2-sdk'
import { useQuery } from '@tanstack/react-query'
import { ChainId } from 'rcpswap/chain'
import { Token } from 'rcpswap/currency'
import { Fee } from 'rcpswap/dex'

import { getAllPools } from '../actions'
import { PoolType, UsePoolsParams } from '../types'

const getPoolAddress = ({
  chainId,
  poolType,
  token0,
  token1,
  fee,
}: {
  chainId: ChainId
  poolType: PoolType
  token0: Token
  token1: Token
  fee: Fee
}) => {
  const [tokenA, tokenB] = token0.wrapped.sortsBefore(token1.wrapped)
    ? [token0.wrapped, token1.wrapped]
    : [token1.wrapped, token0.wrapped]

  if (poolType === PoolType.Pool && isRCPSwapChainId(chainId)) {
    return computePoolAddress({
      factoryAddress: RCPSWAP_FACTORY_ADDRESS[chainId],
      tokenA,
      tokenB,
      initCodeHashManualOverride: RCPSWAP_INIT_CODE_HASH[chainId]
    })
  }

  return undefined
}

interface UsePoolsAsMapParams extends UsePoolsParams {
  poolType: PoolType
  fee: Fee
}
export const usePoolsAsMap = ({
  enabled = true,
  ...variables
}: UsePoolsAsMapParams) => {
  const { chainId, currencyA, currencyB } = variables

  return useQuery({
    queryKey: ['usePoolsAsMap', { chainId, currencyA, currencyB }],
    queryFn: async () => {
      const data = await getAllPools({
        ...variables,
        asMap: true,
        withCombinations: false,
      })
      const pools = [
        ...(data.pools || []),
      ]
      return pools.reduce<
        Record<
          string,
          Pool
        >
      >((acc, cur) => {
        acc[cur.liquidityToken.address] = cur
        return acc
      }, {})
    },
    select: (data) => {
      const computeCurrentPairAddress =
        variables.currencyA && variables.currencyB
          ? getPoolAddress({
            chainId: variables.chainId,
            poolType: variables.poolType,
            token0: variables.currencyA?.wrapped,
            token1: variables.currencyB?.wrapped,
            fee: variables.fee,
          })
          : undefined

      return {
        pool: computeCurrentPairAddress
          ? data[computeCurrentPairAddress]
          : undefined,
        map: data,
      }
    },
    refetchInterval: 10000,
    enabled,
  })
}
