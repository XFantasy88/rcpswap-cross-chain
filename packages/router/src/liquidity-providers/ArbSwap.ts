import { ChainId } from "rcpswap/chain"
// import { PrismaClient } from "@prisma/client";
import { PublicClient } from "viem"

import { LiquidityProviders } from "./LiquidityProvider"
import { UniswapV2BaseProvider } from "./UniswapV2Base"

export class ArbSwapProvider extends UniswapV2BaseProvider {
  constructor(
    chainId: ChainId,
    web3Client: PublicClient
    // databaseClient?: PrismaClient
  ) {
    const factory = {
      [ChainId.ARBITRUM_NOVA]: "0xf6239423fcf1c19ed2791d9648a90836074242fd",
      [ChainId.ARBITRUM_ONE]: "0xd394e9cc20f43d2651293756f8d320668e850f1b",
    } as const

    const initCodeHash = {
      [ChainId.ARBITRUM_NOVA]:
        "0x70b19cf85a176c6b86e2d324be179104bdc8fafee13d548ae07d28b9f53cbc71",
      [ChainId.ARBITRUM_ONE]:
        "0x8336ef61546f16041265cbd61fb71f00434b515a1f3dba059227802ec4a4be4f",
    } as const

    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.ArbSwap
  }
  getPoolProviderName(): string {
    return "ArbSwap"
  }
}
