import type { Chain } from "@wagmi/core"
import {
  polygon,
  arbitrumNova,
  arbitrum,
  bsc,
  avalanche,
} from "@wagmi/core/chains"

export const defaultChains: Chain[] = [
  arbitrumNova,
  arbitrum,
  polygon,
  bsc,
  avalanche,
]

export const allChains = [...defaultChains]
