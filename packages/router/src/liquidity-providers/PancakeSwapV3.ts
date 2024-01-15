import { ChainId } from "rcpswap/chain"
import { PublicClient } from "viem"

import { LiquidityProviders } from "./LiquidityProvider"
import { UniswapV3BaseProvider } from "./UniswapV3Base"

export class PancakeSwapV3Provider extends UniswapV3BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BSC]: "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
    } as const
    const initCodeHash = {
      [ChainId.BSC]:
        "0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2",
    } as const

    const tickLens = {
      [ChainId.BSC]: "0x10c19390E1Ac2Fd6D0c3643a2320b0abA38E5bAA",
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.PancakeSwapV3
  }
  getPoolProviderName(): string {
    return "PancakeSwapV3"
  }
}
