import { ChainId } from "rcpswap/chain"

import ArbitrumNova from "@/assets/images/networks/42170.png"
import ArbitrumOne from "@/assets/images/networks/42161.png"
import Polygon from "@/assets/images/networks/137.png"

export const SUPPORTED_NETWORK_INFO = {
  [ChainId.ARBITRUM_NOVA]: {
    image: ArbitrumNova,
    name: "Arbitrum Nova",
  },
  [ChainId.POLYGON]: {
    image: Polygon,
    name: "Polygon",
  },
  [ChainId.ARBITRUM_ONE]: {
    image: ArbitrumOne,
    name: "Arbitrum",
  },
}

export const SUPPORTED_DEX_INFO: { [key: string]: { image: string } } = {
  RCP: { image: "/dex/rcpswap.png" },
  Arb: { image: "/dex/arbswap.png" },
  Sushi: { image: "/dex/sushiswap.png" },
  Uni: { image: "/dex/uniswap.png" },
  Quick: { image: "/dex/quickswap.png" },
} as const

export const SYMBIOSIS_CONFIRMATION_BLOCK_COUNT = {
  [ChainId.ARBITRUM_NOVA]: 16,
  [ChainId.POLYGON]: 24,
  [ChainId.ARBITRUM_ONE]: 240,
}
