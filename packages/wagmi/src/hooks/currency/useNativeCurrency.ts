'use client'

import { useMemo } from 'react'
import { ChainId } from 'rcpswap/chain'
import { Native } from 'rcpswap/currency'

export function useNativeCurrency({
  chainId = ChainId.ARBITRUM_NOVA,
}: { chainId?: number }): Native {
  return useMemo(() => Native.onChain(chainId), [chainId])
}
