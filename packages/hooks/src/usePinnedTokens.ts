import { getAddress as _getAddress, isAddress } from '@ethersproject/address'
import { Children, useCallback, useEffect, useMemo } from 'react'
import { ChainId } from 'rcpswap/chain'
import {
  ARB,
  BRICK,
  type Currency,
  DAI,
  MOON,
  Native,
  Token,
  USDC,
  USDT,
  WBTC,
  WETH9,
  WNATIVE,
} from 'rcpswap/currency'

import { useLocalStorage } from './useLocalStorage'

export const COMMON_BASES = {
  [ChainId.POLYGON]: [
    Native.onChain(ChainId.POLYGON),
    WNATIVE[ChainId.POLYGON],
    WBTC[ChainId.POLYGON],
    WETH9[ChainId.POLYGON],
    USDC[ChainId.POLYGON],
    USDT[ChainId.POLYGON],
    DAI[ChainId.POLYGON],
  ],
  [ChainId.ARBITRUM_NOVA]: [
    Native.onChain(ChainId.ARBITRUM_NOVA),
    WNATIVE[ChainId.ARBITRUM_NOVA],
    ARB[ChainId.ARBITRUM_NOVA],
    BRICK[ChainId.ARBITRUM_NOVA],
    WBTC[ChainId.ARBITRUM_NOVA],
    USDC[ChainId.ARBITRUM_NOVA],
    USDT[ChainId.ARBITRUM_NOVA],
    DAI[ChainId.ARBITRUM_NOVA],
    MOON[ChainId.ARBITRUM_NOVA],
  ],
} as const

const COMMON_BASES_IDS = Object.entries(COMMON_BASES).reduce<
  Record<string, string[]>
>((acc, [chain, tokens]) => {
  const chainId = chain
  acc[chainId] = Array.from(new Set(tokens.map((token) => token.id)))
  return acc
}, {} as Record<ChainId, string[]>)

function getAddress(address: string) {
  if (address === 'NATIVE') return 'NATIVE'
  return _getAddress(address)
}

export const usePinnedTokens = () => {
  const [value, setValue] = useLocalStorage(
    'sushi.pinnedTokens',
    COMMON_BASES_IDS,
  )

  // useEffect(() => {
  //   setValue((value) => {
  //     for (const [chainId, tokens] of Object.entries(COMMON_BASES_IDS)) {
  //       if (!value[chainId]) {
  //         value[chainId] = tokens
  //       }
  //     }
  //     return value
  //   })
  // }, [setValue])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    Object.entries(COMMON_BASES_IDS).forEach(([chainId, tokens]) => {
      if (!value[chainId]) {
        value[chainId] = tokens
        setValue(value)
      }
    })
  }, [setValue])

  const addPinnedToken = useCallback(
    (currencyId: string) => {
      const [chainId, address] = currencyId.split(':')
      setValue((value) => {
        value[chainId] = Array.from(
          new Set([...value[chainId], `${chainId}:${getAddress(address)}`]),
        )
        return value
      })
    },
    [setValue],
  )

  const removePinnedToken = useCallback(
    (currencyId: string) => {
      const [chainId, address] = currencyId.split(':')
      setValue((value) => {
        value[chainId] = Array.from(
          new Set(
            value[chainId].filter(
              (token) => token !== `${chainId}:${getAddress(address)}`,
            ),
          ),
        )
        return value
      })
    },
    [setValue],
  )

  const hasToken = useCallback(
    (currency: Currency | string) => {
      if (typeof currency === 'string') {
        if (!currency.includes(':')) {
          throw new Error('Address provided instead of id')
        }

        const [chainId, address] = currency.split(':')
        if (address !== 'NATIVE' && !isAddress(address)) {
          throw new Error('Address provided not a valid ERC20 address')
        }

        return value?.[chainId]?.includes(`${chainId}:${getAddress(address)}`)
      }

      return !!value?.[currency.chainId]?.includes(currency.id)
    },
    [value],
  )

  const mutate = useCallback(
    (type: 'add' | 'remove', currencyId: string) => {
      if (type === 'add') addPinnedToken(currencyId)
      if (type === 'remove') removePinnedToken(currencyId)
    },
    [addPinnedToken, removePinnedToken],
  )

  return useMemo(() => {
    return {
      data: value,
      mutate,
      hasToken,
    }
  }, [hasToken, mutate, value])
}
