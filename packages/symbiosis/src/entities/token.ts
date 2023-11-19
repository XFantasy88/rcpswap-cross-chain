import JSBI from "jsbi"
import invariant from "tiny-invariant"
import { ChainId, Icons, SolidityType, TokenConstructor } from "../constants"
import { validateAndParseAddress, validateSolidityTypeInstance } from "../utils"
import { Chain, getChainById } from "./chain"

/**
 * A token is any fungible financial instrument on Ethereum.
 *
 */
export class Token {
  public readonly decimals: number
  public readonly symbol?: string
  public readonly name?: string
  public readonly chainId: ChainId
  public readonly address: string
  public readonly icons?: Icons
  public readonly chainFromId?: ChainId
  public readonly isNative: boolean
  public readonly userToken?: boolean
  public readonly deprecated: boolean

  /**
   * Constructs an instance of the base class `Token`.
   * @param params TokenConstructor
   */
  constructor(params: TokenConstructor) {
    validateSolidityTypeInstance(
      JSBI.BigInt(params.decimals),
      SolidityType.uint8
    )

    this.decimals = params.decimals
    this.symbol = params.symbol
    this.name = params.name
    this.chainId = params.chainId
    this.isNative = !!params.isNative
    this.icons = params.icons
    this.chainFromId = params.chainFromId
    this.userToken = params.userToken
    this.deprecated = !!params.deprecated

    this.address = validateAndParseAddress(params.address)
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  public equals(other: Token): boolean {
    // short circuit on reference equality
    if (this === other) {
      return true
    }
    return this.chainId === other.chainId && this.address === other.address
  }

  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  public sortsBefore(other: Token): boolean {
    invariant(this.chainId === other.chainId, "CHAIN_IDS")
    invariant(this.address !== other.address, "ADDRESSES")
    return this.address.toLowerCase() < other.address.toLowerCase()
  }
  get isSynthetic() {
    return !!this.chainFromId
  }

  get chain(): Chain | undefined {
    return getChainById(this.chainId)
  }

  get chainFrom(): Chain | undefined {
    return getChainById(this.chainFromId)
  }
}
/**
 * Compares two currencies for equality
 */
export function tokenEquals(tokenA: Token, tokenB: Token): boolean {
  return tokenA.equals(tokenB)
}

export const WETH = {
  [ChainId.MATIC_MAINNET]: new Token({
    chainId: ChainId.MATIC_MAINNET,
    address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    decimals: 18,
    symbol: "WMATIC",
    isNative: false,
    name: "Wrapped MATIC",
    icons: {
      large:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
      small:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
    },
  }),
  [ChainId.BOBA_BNB]: new Token({
    chainId: ChainId.BOBA_BNB,
    address: "0xC58aaD327D6D58D979882601ba8DDa0685B505eA",
    decimals: 18,
    symbol: "WBOBA",
    isNative: false,
    name: "Wrapped BOBA",
    icons: {
      large: "https://s2.coinmarketcap.com/static/img/coins/64x64/14556.png",
      small: "https://s2.coinmarketcap.com/static/img/coins/64x64/14556.png",
    },
  }),
  [ChainId.ARBITRUM_NOVA]: new Token({
    chainId: ChainId.ARBITRUM_NOVA,
    address: "0x722e8bdd2ce80a4422e880164f2079488e115365",
    decimals: 18,
    symbol: "WETH",
    isNative: false,
    name: "Wrapped ETH",
    icons: {
      small: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
      large: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    },
  }),
}
