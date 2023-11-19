import { useQuery } from '@tanstack/react-query'
import { ChainId } from 'rcpswap/chain'
import { Type } from 'rcpswap/currency'
import { zeroAddress } from 'viem'
import { Address } from 'wagmi'

import { queryFnUseBalances } from './useBalancesWeb3'

interface UseBalanceParams {
  chainId: ChainId | undefined
  currency: Type | undefined
  account: Address | undefined
  enabled?: boolean
}

export const useBalanceWeb3 = ({
  chainId,
  currency,
  account,
  enabled = true,
}: UseBalanceParams) => {
  return useQuery({
    queryKey: ['useBalance', { chainId, currency, account }],
    queryFn: async () => {
      if (!currency) return null
      const data = await queryFnUseBalances({
        chainId,
        currencies: [currency],
        account,
      })
      return (
        data?.[currency.isNative ? zeroAddress : currency.wrapped.address] ??
        null
      )
    },
    refetchInterval: 60000,
    cacheTime: 60000,
    enabled: Boolean(chainId && account && enabled),
  })
}
