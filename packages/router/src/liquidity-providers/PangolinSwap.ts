import { ChainId } from "rcpswap/chain"
import { PublicClient } from "viem"

import { LiquidityProviders } from "./LiquidityProvider"
import { UniswapV2BaseProvider } from "./UniswapV2Base"

export class PangolinSwapProvider extends UniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.AVALANCHE]: "0xefa94DE7a4656D787667C749f7E1223D71E9FD88",
    } as const

    const initCodeHash = {
      [ChainId.AVALANCHE]:
        "0x40231f6b438bce0797c9ada29b718a87ea0a5cea3fe9a771abdd76bd41a3e545",
    } as const

    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.PangolinSwap
  }
  getPoolProviderName(): string {
    return "PangolinSwap"
  }
}
