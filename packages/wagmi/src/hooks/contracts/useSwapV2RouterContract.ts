'use client'

import {
  RCPSWAP_ROUTER_ADDRESS,
  RCPSwapChainId,
} from '@rcpswap/v2-sdk'
import { useMemo } from 'react'
import { uniswapV2RouterAbi } from 'rcpswap/abi'
import { WalletClient } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'
import { getContract } from 'wagmi/actions'

export const getSushiSwapRouterContractConfig = (
  chainId: RCPSwapChainId,
) => ({
  address: RCPSWAP_ROUTER_ADDRESS[chainId],
  abi: uniswapV2RouterAbi,
})

export function useSwapV2RouterContract(
  chainId: RCPSwapChainId | undefined,
) {
  const publicClient = usePublicClient({ chainId })
  const { data: walletClient } = useWalletClient({ chainId })

  return useMemo(() => {
    if (!chainId) return null

    return getContract({
      ...getSushiSwapRouterContractConfig(chainId),
      walletClient: (walletClient as WalletClient) ?? publicClient,
    })
  }, [chainId, publicClient, walletClient])
}

export type SushiSwapRouter = NonNullable<
  ReturnType<typeof useSwapV2RouterContract>
>
