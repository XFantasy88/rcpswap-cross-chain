"use client"

import { ChainId } from "rcpswap/chain"
import { getContract } from "viem"
import { Address, usePublicClient } from "wagmi"

import { multicallAbi } from "rcpswap/abi"

export const MULTICALL_ADDRESS: Record<number, string> = {
  [ChainId.BSC]: "0x47A307e3167820daf22a377D777371753758f59c",
  [ChainId.POLYGON]: "0x1F98415757620B543A52E61c46B32eB19261F984",
  [ChainId.ARBITRUM_ONE]: "0xadF885960B47eA2CD9B55E6DAc6B42b7Cb2806dB",
  [ChainId.ARBITRUM_NOVA]: "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F",
}

export const getMulticallContractConfig = (chainId: number | undefined) => ({
  address: (chainId && chainId in MULTICALL_ADDRESS
    ? MULTICALL_ADDRESS[chainId]
    : "") as Address,
  abi: multicallAbi,
})

export function useMulticallContract(chainId: number) {
  const publicClient = usePublicClient({ chainId })

  return getContract({
    ...getMulticallContractConfig(chainId),
    publicClient,
  })
}
