import JSBI from "jsbi"
import { ChainId } from "../constants"
import { Percent, Token, WETH } from "../entities"

export const CHAINS_PRIORITY = [ChainId.MATIC_MAINNET, ChainId.ARBITRUM_NOVA]

// a list of tokens by chain
type ChainTokensList = {
  readonly [chainId in ChainId]?: Token[]
}

export const XFUSION_CHAINS: ChainId[] = [ChainId.ARBITRUM_NOVA]

export const ONE_INCH_CHAINS: ChainId[] = [ChainId.MATIC_MAINNET]

export const ONE_INCH_ORACLE_MAP: { [chainId in ChainId]?: string } = {
  [ChainId.MATIC_MAINNET]: "0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B",
}

export const WETH_ONLY: ChainTokensList = {
  [ChainId.MATIC_MAINNET]: [WETH[ChainId.MATIC_MAINNET]],
  [ChainId.BOBA_BNB]: [WETH[ChainId.BOBA_BNB]],
  [ChainId.ARBITRUM_NOVA]: [WETH[ChainId.ARBITRUM_NOVA]],
}

export const DEX_TOKENS_TO_CHECK_TRADES_AGAINST = {
  [ChainId.MATIC_MAINNET]: [
    new Token({
      chainId: ChainId.MATIC_MAINNET,
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      decimals: 6,
      symbol: "USDC",
      name: "USDC",
    }),
    new Token({
      chainId: ChainId.MATIC_MAINNET,
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      decimals: 6,
      symbol: "USDT",
      name: "Tether USD",
    }),
    // new Token({
    //     chainId: ChainId.MATIC_MAINNET,
    //     address: '0x831753DD7087CaC61aB5644b308642cc1c33Dc13',
    //     decimals: 18,
    //     symbol: 'QUICK',
    //     name: 'QuickSwap',
    // }),
    // new Token({
    //     chainId: ChainId.MATIC_MAINNET,
    //     address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    //     decimals: 18,
    //     symbol: 'ETH',
    //     name: 'Ether',
    // }),
    new Token({
      chainId: ChainId.MATIC_MAINNET,
      address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
      decimals: 18,
      symbol: "wBTC",
      name: "Wrapped Bitcoin",
    }),
    new Token({
      chainId: ChainId.MATIC_MAINNET,
      address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      decimals: 18,
      symbol: "DAI",
      name: "Dai Stablecoin",
    }),
  ],
  [ChainId.BOBA_BNB]: [] as any,
  [ChainId.ARBITRUM_NOVA]: [
    new Token({
      chainId: ChainId.ARBITRUM_NOVA,
      address: "0x750ba8b76187092B0D1E87E28daaf484d1b5273b",
      decimals: 6,
      symbol: "USDC",
      name: "USD Coin",
    }),
  ],
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokensList = {
  ...WETH_ONLY,
  [ChainId.MATIC_MAINNET]: [
    WETH[ChainId.MATIC_MAINNET],
    ...DEX_TOKENS_TO_CHECK_TRADES_AGAINST[ChainId.MATIC_MAINNET],
  ],
  [ChainId.BOBA_BNB]: [
    WETH[ChainId.BOBA_BNB],
    ...DEX_TOKENS_TO_CHECK_TRADES_AGAINST[ChainId.BOBA_BNB],
  ],
  [ChainId.ARBITRUM_NOVA]: [
    WETH[ChainId.ARBITRUM_NOVA],
    ...DEX_TOKENS_TO_CHECK_TRADES_AGAINST[ChainId.ARBITRUM_NOVA],
  ],
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: {
  [chainId in ChainId]?: { [tokenAddress: string]: Token[] }
} = {}

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)

// Multicall2 addresses (tryAggregate method required)
export const MULTICALL_ADDRESSES: { [chainId in ChainId]?: string } = {
  [ChainId.MATIC_MAINNET]: "0x275617327c958bD06b5D6b871E7f491D76113dd8",
  [ChainId.BOBA_BNB]: "0x31cCe73DA4365342bd081F6a748AAdb7c7a49b7E",
  [ChainId.ARBITRUM_NOVA]: "0xcA11bde05977b3631167028862bE2a173976CA11",
}
