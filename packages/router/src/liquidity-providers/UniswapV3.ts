import { ChainId } from "rcpswap/chain"
import { PublicClient } from "viem"

import { LiquidityProviders } from "./LiquidityProvider"
import { UniswapV3BaseProvider } from "./UniswapV3Base"

export class UniswapV3Provider extends UniswapV3BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BSC]: "0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7",
      [ChainId.POLYGON]: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
      [ChainId.ARBITRUM_ONE]: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
      [ChainId.AVALANCHE]: "0x740b1c1de25031C31FF4fC9A62f554A55cdC1baD",
    } as const
    const initCodeHash = {
      [ChainId.BSC]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
      [ChainId.POLYGON]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
      [ChainId.ARBITRUM_ONE]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
      [ChainId.AVALANCHE]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
    } as const
    const tickLens = {
      [ChainId.BSC]: "0xD9270014D396281579760619CCf4c3af0501A47C",
      [ChainId.POLYGON]: "0xbfd8137f7d1516d3ea5ca83523914859ec47f573",
      [ChainId.ARBITRUM_ONE]: "0xbfd8137f7d1516D3ea5cA83523914859ec47F573",
      [ChainId.AVALANCHE]: "0xEB9fFC8bf81b4fFd11fb6A63a6B0f098c6e21950",
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
