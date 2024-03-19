import { AddressZero } from "@ethersproject/constants";
import JSBI from "jsbi";
import { ChainId } from "../constants";
import { Percent, Token, WETH } from "../entities";

export const CROSS_CHAIN_ID =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

export const CHAINS_PRIORITY = [
  ChainId.BSC_MAINNET,
  // ChainId.BSC_TESTNET, // NOTE it is a manager chain
  ChainId.AVAX_MAINNET,
  // ChainId.BOBA_BNB, // NOTE it is a manager chain
  ChainId.MATIC_MAINNET,
  ChainId.ARBITRUM_MAINNET,
  ChainId.ARBITRUM_NOVA,
];

// a list of tokens by chain
type ChainTokensList = {
  readonly [chainId in ChainId]?: Token[];
};

export const XFUSION_CHAINS: ChainId[] = [ChainId.ARBITRUM_NOVA];

export const ONE_INCH_CHAINS: ChainId[] = [
  ChainId.BSC_MAINNET,
  ChainId.MATIC_MAINNET,
  ChainId.ARBITRUM_MAINNET,
  ChainId.AVAX_MAINNET,
];

export const ONE_INCH_ORACLE_MAP: { [chainId in ChainId]?: string } = {
  [ChainId.BSC_MAINNET]: "0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B",
  [ChainId.MATIC_MAINNET]: "0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B",
  [ChainId.ARBITRUM_MAINNET]: "0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B",
  [ChainId.AVAX_MAINNET]: "0x52cbE0f49CcdD4Dc6E9C13BAb024EABD2842045B",
};

export const WETH_ONLY: ChainTokensList = {
  [ChainId.BSC_MAINNET]: [WETH[ChainId.BSC_MAINNET]],
  [ChainId.MATIC_MAINNET]: [WETH[ChainId.MATIC_MAINNET]],
  [ChainId.AVAX_MAINNET]: [WETH[ChainId.AVAX_MAINNET]],
  [ChainId.BOBA_BNB]: [WETH[ChainId.BOBA_BNB]],
  [ChainId.ARBITRUM_MAINNET]: [WETH[ChainId.ARBITRUM_MAINNET]],
  [ChainId.ARBITRUM_NOVA]: [WETH[ChainId.ARBITRUM_NOVA]],
};

export const DEX_TOKENS_TO_CHECK_TRADES_AGAINST = {
  [ChainId.BSC_MAINNET]: [
    // new Token({
    //     chainId: ChainId.BSC_MAINNET,
    //     address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    //     decimals: 18,
    //     symbol: 'CAKE',
    //     name: 'PancakeSwap Token',
    // }),
    new Token({
      chainId: ChainId.BSC_MAINNET,
      address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      decimals: 18,
      symbol: "BUSD",
      name: "Binance USD",
    }),
    new Token({
      chainId: ChainId.BSC_MAINNET,
      address: "0x55d398326f99059fF775485246999027B3197955",
      decimals: 18,
      symbol: "USDT",
      name: "Tether USD",
    }),
    // new Token({
    //     chainId: ChainId.BSC_MAINNET,
    //     address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    //     decimals: 18,
    //     symbol: 'BTCB',
    //     name: 'Binance BTC',
    // }),
    // new Token({
    //     chainId: ChainId.BSC_MAINNET,
    //     address: '0x23396cF899Ca06c4472205fC903bDB4de249D6fC',
    //     decimals: 18,
    //     symbol: 'UST',
    //     name: 'Wrapped UST Token',
    // }),
    // new Token({
    //     chainId: ChainId.BSC_MAINNET,
    //     address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    //     decimals: 18,
    //     symbol: 'ETH',
    //     name: 'Binance-Peg Ethereum Token',
    // }),
    new Token({
      chainId: ChainId.BSC_MAINNET,
      address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      decimals: 18,
      symbol: "USDC",
      name: "Binance-Peg USD Coin",
    }),
  ],
  [ChainId.AVAX_MAINNET]: [
    // new Token({
    //     chainId: ChainId.AVAX_MAINNET,
    //     address: '0x60781C2586D68229fde47564546784ab3fACA982',
    //     decimals: 18,
    //     symbol: 'PNG',
    //     name: 'Pangolin',
    // }),
    new Token({
      chainId: ChainId.AVAX_MAINNET,
      address: "0xc7198437980c041c805A1EDcbA50c1Ce5db95118",
      decimals: 6,
      symbol: "USDT.e",
      name: "Tether USD",
    }),
    new Token({
      chainId: ChainId.AVAX_MAINNET,
      address: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
      decimals: 18,
      symbol: "DAI.e",
      name: "Dai Stablecoin",
    }),
    new Token({
      chainId: ChainId.AVAX_MAINNET,
      address: "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664",
      decimals: 6,
      symbol: "USDC.e",
      name: "USD Coin",
    }),
    // new Token({
    //     chainId: ChainId.AVAX_MAINNET,
    //     address: '0x260Bbf5698121EB85e7a74f2E45E16Ce762EbE11',
    //     decimals: 6,
    //     symbol: 'UST',
    //     name: 'Axelar Wrapped UST',
    // }),
    new Token({
      chainId: ChainId.AVAX_MAINNET,
      address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      decimals: 6,
      symbol: "USDC",
      name: "USD Coin",
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
  [ChainId.BOBA_BNB]: [],
  [ChainId.ARBITRUM_MAINNET]: [
    new Token({
      chainId: ChainId.ARBITRUM_MAINNET,
      address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
      decimals: 6,
      symbol: "USDC",
      name: "USD Coin",
    }),
  ],
  [ChainId.ARBITRUM_NOVA]: [
    new Token({
      chainId: ChainId.ARBITRUM_NOVA,
      address: "0x750ba8b76187092B0D1E87E28daaf484d1b5273b",
      decimals: 6,
      symbol: "USDC",
      name: "USD Coin",
    }),
  ],
};

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokensList = {
  ...WETH_ONLY,
  [ChainId.BSC_MAINNET]: [
    WETH[ChainId.BSC_MAINNET],
    ...DEX_TOKENS_TO_CHECK_TRADES_AGAINST[ChainId.BSC_MAINNET],
  ],
  [ChainId.AVAX_MAINNET]: [
    WETH[ChainId.AVAX_MAINNET],
    ...DEX_TOKENS_TO_CHECK_TRADES_AGAINST[ChainId.AVAX_MAINNET],
  ],
  [ChainId.MATIC_MAINNET]: [
    WETH[ChainId.MATIC_MAINNET],
    ...DEX_TOKENS_TO_CHECK_TRADES_AGAINST[ChainId.MATIC_MAINNET],
  ],
  [ChainId.BOBA_BNB]: [
    WETH[ChainId.BOBA_BNB],
    ...DEX_TOKENS_TO_CHECK_TRADES_AGAINST[ChainId.BOBA_BNB],
  ],
  [ChainId.ARBITRUM_MAINNET]: [
    WETH[ChainId.ARBITRUM_MAINNET],
    ...DEX_TOKENS_TO_CHECK_TRADES_AGAINST[ChainId.ARBITRUM_MAINNET],
  ],
  [ChainId.ARBITRUM_NOVA]: [
    WETH[ChainId.ARBITRUM_NOVA],
    ...DEX_TOKENS_TO_CHECK_TRADES_AGAINST[ChainId.ARBITRUM_NOVA],
  ],
};

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: {
  [chainId in ChainId]?: { [tokenAddress: string]: Token[] };
} = {
  [ChainId.BSC_MAINNET]: {},
};

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000));
export const BIPS_BASE = JSBI.BigInt(10000);

// Multicall2 addresses (tryAggregate method required)
export const MULTICALL_ADDRESSES: { [chainId in ChainId]?: string } = {
  [ChainId.BSC_MAINNET]: "0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B",
  [ChainId.MATIC_MAINNET]: "0x275617327c958bD06b5D6b871E7f491D76113dd8",
  [ChainId.AVAX_MAINNET]: "0x29b6603d17b9d8f021ecb8845b6fd06e1adf89de",
  [ChainId.BOBA_BNB]: "0x31cCe73DA4365342bd081F6a748AAdb7c7a49b7E",
  [ChainId.ARBITRUM_MAINNET]: "0x80c7dd17b01855a6d2347444a0fcc36136a314de",
  [ChainId.ARBITRUM_NOVA]: "0xcA11bde05977b3631167028862bE2a173976CA11",
};
