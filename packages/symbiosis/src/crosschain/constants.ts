import JSBI from "jsbi"
import { ChainId } from "../constants"
import { Percent, Token, WETH } from "../entities"

export const CROSS_CHAIN_ID =
  "0x0000000000000000000000000000000000000000000000000000000000000000"

export const CHAINS_PRIORITY = [
  ChainId.BSC,
  ChainId.AVALANCHE,
  ChainId.MATIC_MAINNET,
  ChainId.ARBITRUM_ONE,
  ChainId.ARBITRUM_NOVA,
]

// a list of tokens by chain
type ChainTokensList = {
  readonly [chainId in ChainId]?: Token[]
}

export const XFUSION_CHAINS: ChainId[] = [ChainId.ARBITRUM_NOVA]
export const ONE_INCH_CHAINS: ChainId[] = [
  ChainId.BSC,
  ChainId.MATIC_MAINNET,
  ChainId.ARBITRUM_ONE,
  ChainId.AVALANCHE,
]

export const ONE_INCH_ORACLE_MAP: { [chainId in ChainId]?: string } = {
  [ChainId.BSC]: "0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B",
  [ChainId.MATIC_MAINNET]: "0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B",
  [ChainId.ARBITRUM_ONE]: "0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B",
  [ChainId.AVALANCHE]: "0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B",
}

export const WETH_ONLY: ChainTokensList = {
  [ChainId.BSC]: [WETH[ChainId.BSC]],
  [ChainId.MATIC_MAINNET]: [WETH[ChainId.MATIC_MAINNET]],
  [ChainId.BOBA_BNB]: [WETH[ChainId.BOBA_BNB]],
  [ChainId.ARBITRUM_NOVA]: [WETH[ChainId.ARBITRUM_NOVA]],
  [ChainId.ARBITRUM_ONE]: [WETH[ChainId.ARBITRUM_ONE]],
  [ChainId.AVALANCHE]: [WETH[ChainId.AVALANCHE]],
}

export const DEX_TOKENS_TO_CHECK_TRADES_AGAINST = {
  [ChainId.BSC]: [
    new Token({
      chainId: ChainId.BSC,
      address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      decimals: 18,
      symbol: "BUSD",
      name: "Binance USD",
    }),
    new Token({
      chainId: ChainId.BSC,
      address: "0x55d398326f99059fF775485246999027B3197955",
      decimals: 18,
      symbol: "USDT",
      name: "Tether USD",
    }),
    new Token({
      chainId: ChainId.BSC,
      address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      decimals: 18,
      symbol: "USDC",
      name: "Binance-Peg USD Coin",
    }),
  ],
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
  [ChainId.BOBA_BNB]: [],
  [ChainId.ARBITRUM_NOVA]: [
    new Token({
      chainId: ChainId.ARBITRUM_NOVA,
      address: "0x750ba8b76187092B0D1E87E28daaf484d1b5273b",
      decimals: 6,
      symbol: "USDC",
      name: "USD Coin",
    }),
  ],
  [ChainId.ARBITRUM_ONE]: [
    new Token({
      chainId: ChainId.ARBITRUM_ONE,
      address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
      decimals: 6,
      symbol: "USDC",
      name: "USD Coin",
    }),
  ],
  [ChainId.AVALANCHE]: [
    new Token({
      chainId: ChainId.AVALANCHE,
      address: "0xc7198437980c041c805A1EDcbA50c1Ce5db95118",
      decimals: 6,
      symbol: "USDT.e",
      name: "Tether USD",
    }),
    new Token({
      chainId: ChainId.AVALANCHE,
      address: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
      decimals: 18,
      symbol: "DAI.e",
      name: "Dai Stablecoin",
    }),
    new Token({
      chainId: ChainId.AVALANCHE,
      address: "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664",
      decimals: 6,
      symbol: "USDC.e",
      name: "USD Coin",
    }),
    new Token({
      chainId: ChainId.AVALANCHE,
      address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      decimals: 6,
      symbol: "USDC",
      name: "USD Coin",
    }),
  ],
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokensList = {
  ...WETH_ONLY,
  [ChainId.BSC]: [
    WETH[ChainId.BSC],
    ...DEX_TOKENS_TO_CHECK_TRADES_AGAINST[ChainId.BSC],
  ],
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
  [ChainId.ARBITRUM_ONE]: [
    WETH[ChainId.ARBITRUM_ONE],
    ...DEX_TOKENS_TO_CHECK_TRADES_AGAINST[ChainId.ARBITRUM_ONE],
  ],
  [ChainId.AVALANCHE]: [
    WETH[ChainId.AVALANCHE],
    ...DEX_TOKENS_TO_CHECK_TRADES_AGAINST[ChainId.AVALANCHE],
  ],
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: {
  [chainId in ChainId]?: { [tokenAddress: string]: Token[] }
} = {
  [ChainId.BSC]: {},
}

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)

// Multicall2 addresses (tryAggregate method required)
export const MULTICALL_ADDRESSES: { [chainId in ChainId]?: string } = {
  [ChainId.BSC]: "0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B",
  [ChainId.MATIC_MAINNET]: "0x275617327c958bD06b5D6b871E7f491D76113dd8",
  [ChainId.BOBA_BNB]: "0x31cCe73DA4365342bd081F6a748AAdb7c7a49b7E",
  [ChainId.ARBITRUM_NOVA]: "0xcA11bde05977b3631167028862bE2a173976CA11",
  [ChainId.ARBITRUM_ONE]: "0x80c7dd17b01855a6d2347444a0fcc36136a314de",
  [ChainId.AVALANCHE]: "0x29b6603d17b9d8f021ecb8845b6fd06e1adf89de",
}
