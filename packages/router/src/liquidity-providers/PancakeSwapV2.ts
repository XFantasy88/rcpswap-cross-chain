import { ChainId } from "rcpswap/chain"
import { PublicClient } from "viem"

import { LiquidityProviders } from "./LiquidityProvider"
import { UniswapV2BaseProvider } from "./UniswapV2Base"

export class PancakeSwapV2Provider extends UniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BSC]: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
    } as const

    const initCodeHash = {
      [ChainId.BSC]:
        "0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5",
    } as const

    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.PancakeSwapV2
  }
  getPoolProviderName(): string {
    return "PancakeSwapV2"
  }
}
