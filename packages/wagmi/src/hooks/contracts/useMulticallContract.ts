'use client'

import { ChainId } from 'rcpswap/chain'
import { getContract } from 'viem'
import { Address, usePublicClient } from 'wagmi'

import { multicallAbi } from 'rcpswap/abi'

export const MULTICALL_ADDRESS: Record<number, string> = {
  [ChainId.POLYGON]: '0x1F98415757620B543A52E61c46B32eB19261F984',
  [ChainId.ARBITRUM_NOVA]: '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
}

export const getMulticallContractConfig = (chainId: number | undefined) => ({
  address: (chainId && chainId in MULTICALL_ADDRESS
    ? MULTICALL_ADDRESS[chainId]
    : '') as Address,
  abi: multicallAbi,
})

export function useMulticallContract(chainId: number) {
  const publicClient = usePublicClient({ chainId })

  return getContract({
    ...getMulticallContractConfig(chainId),
    publicClient,
  })
}
