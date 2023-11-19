'use client'

import { getCurrencyCombinations } from '@rcpswap/router'
import { useMemo } from 'react'
import { ChainId } from 'rcpswap/chain'
import { Token, Type } from 'rcpswap/currency'

export function useCurrencyCombinations(
  chainId?: ChainId,
  currencyA?: Type,
  currencyB?: Type,
): [Token, Token][] {
  return useMemo(
    () =>
      chainId && currencyA && currencyB
        ? getCurrencyCombinations(chainId, currencyA, currencyB)
        : [],
    [chainId, currencyA, currencyB],
  )
}
