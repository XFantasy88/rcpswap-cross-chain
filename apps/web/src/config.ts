import { ChainId } from "rcpswap/chain"

import ArbitrumNova from "@/assets/images/networks/42170.png"
import Polygon from "@/assets/images/networks/137.png"

export const SUPPORTED_NETWORK_INFO = {
  [ChainId.ARBITRUM_NOVA]: {
    image: ArbitrumNova,
  },
  [ChainId.POLYGON]: {
    image: Polygon,
  },
}

export const SUPPORTED_DEX_INFO: { [key: string]: { image: string } } = {
  RCP: { image: "/dex/rcpswap.png" },
  Arb: { image: "/dex/arbswap.png" },
  Sushi: { image: "/dex/sushiswap.png" },
} as const
