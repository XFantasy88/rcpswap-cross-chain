import { ChainId } from "rcpswap/chain"
import { PublicClient } from "viem"

import { LiquidityProviders } from "./LiquidityProvider"
import { UniswapV3BaseProvider } from "./UniswapV3Base"

export class SushiSwapV3Provider extends UniswapV3BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.ARBITRUM_NOVA]: "0xaa26771d497814E81D305c511Efbb3ceD90BF5bd",
      [ChainId.POLYGON]: "0x917933899c6a5F8E37F31E19f92CdBFF7e8FF0e2",
    } as const
    const initCodeHash = {
      [ChainId.ARBITRUM_NOVA]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
      [ChainId.POLYGON]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
    } as const

    const tickLens = {
      [ChainId.ARBITRUM_NOVA]: "0xF60e5f4A44a510742457D8064ffd360B12d8D9AF",
      [ChainId.POLYGON]: "0x9fdeA1412e50D78B25aCE4f96d35801647Fdf7dA",
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.SushiSwapV3
  }
  getPoolProviderName(): string {
    return "SushiSwapV3"
  }
}
