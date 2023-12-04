import { ChainId } from "rcpswap/chain"
import { PublicClient } from "viem"

import { LiquidityProviders } from "./LiquidityProvider"
import { UniswapV3BaseProvider } from "./UniswapV3Base"

export class UniswapV3Provider extends UniswapV3BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.POLYGON]: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    } as const
    const initCodeHash = {
      [ChainId.POLYGON]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
    } as const
    const tickLens = {
      [ChainId.POLYGON]: "0xbfd8137f7d1516d3ea5ca83523914859ec47f573",
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.UniSwapV3
  }
  getPoolProviderName(): string {
    return "UniswapV3"
  }
}
