import { ChainId } from "rcpswap/chain"
import { http, type PublicClientConfig } from "viem"
import { arbitrum, arbitrumNova, polygon } from "viem/chains"

export { arbitrumNova, polygon }

const drpcId = process.env["DRPC_ID"] || process.env["NEXT_PUBLIC_DRPC_ID"]

export const config: Record<ChainId, PublicClientConfig> = {
  [ChainId.ARBITRUM_NOVA]: {
    chain: arbitrumNova,
    transport: http(
      `https://lb.drpc.org/ogrpc?network=arbitrum-nova&dkey=${drpcId}`
    ),
  },
  [ChainId.POLYGON]: {
    chain: polygon,
    transport: http(`https://lb.drpc.org/ogrpc?network=polygon&dkey=${drpcId}`),
  },
  [ChainId.ARBITRUM_ONE]: {
    chain: arbitrum,
    transport: http(
      `https://arbitrum.llamarpc.com`
      // `https://lb.drpc.org/ogrpc?network=arbitrum&dkey=${drpcId}`
    ),
  },
} as const
