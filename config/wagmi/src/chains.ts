import type { Chain } from "@wagmi/core"
import { polygon, arbitrumNova, arbitrum, bsc } from "@wagmi/core/chains"

export const defaultChains: Chain[] = [arbitrumNova, arbitrum, polygon, bsc]

export const allChains = [...defaultChains]
