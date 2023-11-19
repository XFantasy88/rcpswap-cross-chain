import { ChainId } from 'rcpswap/chain'

export const RCPSWAP_SUPPORTED_CHAIN_IDS = [
  ChainId.ARBITRUM_NOVA
]

export const RCPSwapChainIds = RCPSWAP_SUPPORTED_CHAIN_IDS

export type RCPSwapChainId = typeof RCPSWAP_SUPPORTED_CHAIN_IDS[number]

export const isRCPSwapChainId = (
  chainId: ChainId,
): chainId is RCPSwapChainId =>
  RCPSWAP_SUPPORTED_CHAIN_IDS.includes(chainId as RCPSwapChainId)

export const RCPSWAP_INIT_CODE_HASH: Record<
  RCPSwapChainId,
  `0x${string}`
> = {
  [ChainId.ARBITRUM_NOVA]:
    '0x8455b0f8e468580a0ae3f8afe8b676f72e1a9d93425122526501153d3647ea6f',
}

export const RCPSWAP_FACTORY_ADDRESS: Record<
  RCPSwapChainId,
  `0x${string}`
> = {
  [ChainId.ARBITRUM_NOVA]: '0xF9901551B4fDb1FE8d5617B5deB6074Bb8E1F6FB',
}

export const RCPSWAP_ROUTER_ADDRESS: Record<
  RCPSwapChainId,
  `0x${string}`
> = {
  [ChainId.ARBITRUM_NOVA]: '0x28e0f3ebab59a998C4f1019358388B5E2ca92cfA'
}
