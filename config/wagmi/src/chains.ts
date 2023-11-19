import type { Chain } from '@wagmi/core'
import {
  polygon, arbitrumNova
} from '@wagmi/core/chains'

export const defaultChains: Chain[] = [
  arbitrumNova,
  polygon
]

export const allChains = [...defaultChains]
