import { ChainId } from 'rcpswap/chain'

const drpcId = process.env['DRPC_ID'] || process.env['NEXT_PUBLIC_DRPC_ID']

export const rpcUrls = {
  [ChainId.ARBITRUM_NOVA]: [
    `https://lb.drpc.org/ogrpc?network=arbitrum-nova&dkey=${drpcId}`,
  ],
  [ChainId.POLYGON]: [
    `https://lb.drpc.org/ogrpc?network=polygon&dkey=${drpcId}`,
  ]
} as const

export type RpcEnabledChainId = keyof typeof rpcUrls
