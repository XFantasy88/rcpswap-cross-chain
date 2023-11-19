import { ChainConstructor, ChainId, Icons } from "../constants"

export interface NativeCurrency {
  name: string
  symbol: string
  decimals: number
}

export class Chain {
  public readonly id: ChainId
  public readonly name: string
  public readonly disabled: boolean
  public readonly swappable: boolean
  public readonly evm: boolean
  public readonly explorer: string
  public readonly icons: Icons
  public readonly nativeCurrency?: NativeCurrency

  constructor(params: ChainConstructor) {
    this.id = params.id
    this.name = params.name
    this.disabled = params.disabled
    this.explorer = params.explorer
    this.icons = params.icons
    this.swappable = params?.swappable !== false
    this.evm = params?.evm !== false
    this.nativeCurrency = params.nativeCurrency
  }
}

export const chains: Chain[] = [
  new Chain({
    id: ChainId.MATIC_MAINNET,
    name: "Polygon",
    disabled: false,
    explorer: "https://polygonscan.com",
    icons: {
      small:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
      large:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
    },
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
  }),
  new Chain({
    id: ChainId.BOBA_BNB,
    name: "Boba BNB",
    disabled: false,
    explorer: "https://blockexplorer.bnb.boba.network",
    icons: {
      small:
        "https://raw.githubusercontent.com/allush/assets/main/images/blockchains/boba-bnb/logo.png",
      large:
        "https://raw.githubusercontent.com/allush/assets/main/images/blockchains/boba-bnb/logo.png",
    },
    nativeCurrency: {
      name: "Boba Token",
      symbol: "BOBA",
      decimals: 18,
    },
  }),
  new Chain({
    id: ChainId.ARBITRUM_NOVA,
    name: "Arbitrum Nova",
    disabled: false,
    explorer: "https://nova.arbiscan.io",
    icons: {
      small: "https://l2beat.com/icons/nova.png",
      large: "https://l2beat.com/icons/nova.png",
    },
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  }),
]

export const getChainById = (
  chainId: ChainId | undefined
): Chain | undefined => {
  if (!chainId) return undefined
  return chains.find((chain) => chain.id === chainId)
}
