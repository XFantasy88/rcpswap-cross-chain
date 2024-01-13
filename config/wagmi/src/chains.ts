import type { Chain } from "@wagmi/core"
import { polygon, arbitrumNova, arbitrum } from "@wagmi/core/chains"

export const defaultChains: Chain[] = [arbitrumNova, arbitrum, polygon]

export const allChains = [...defaultChains]
