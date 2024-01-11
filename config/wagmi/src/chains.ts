import type { Chain } from "@wagmi/core"
import { polygon, arbitrumNova, arbitrum } from "@wagmi/core/chains"

export const defaultChains: Chain[] = [arbitrumNova, polygon, arbitrum]

export const allChains = [...defaultChains]
