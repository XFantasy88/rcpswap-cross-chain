import { ChainId } from "../../chain/index.js"

import { Native } from "../Native.js"
import { type Type } from "../Type.js"
import {
  ARB,
  BRICK,
  DAI,
  MOON,
  USDC,
  USDT,
  WBTC,
  WETH9,
  WNATIVE,
} from "./tokens.js"

const CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY = {
  [ChainId.BSC]: {
    BNB: Native.onChain(ChainId.BSC),
    WBNB: WNATIVE[ChainId.BSC],
    ETH: WETH9[ChainId.BSC],
    WETH: WETH9[ChainId.BSC],
    USDC: USDC[ChainId.BSC],
    USDT: USDT[ChainId.BSC],
    DAI: DAI[ChainId.BSC],
  },
  [ChainId.POLYGON]: {
    MATIC: Native.onChain(ChainId.POLYGON),
    WMATIC: WNATIVE[ChainId.POLYGON],
    ETH: WETH9[ChainId.POLYGON],
    WETH: WETH9[ChainId.POLYGON],
    WBTC: WBTC[ChainId.POLYGON],
    USDC: USDC[ChainId.POLYGON],
    USDT: USDT[ChainId.POLYGON],
    DAI: DAI[ChainId.POLYGON],
  },
  [ChainId.ARBITRUM_ONE]: {
    ETH: Native.onChain(ChainId.ARBITRUM_ONE),
    WETH: WNATIVE[ChainId.ARBITRUM_ONE],
    WBTC: WBTC[ChainId.ARBITRUM_ONE],
    USDC: USDC[ChainId.ARBITRUM_ONE],
    USDT: USDT[ChainId.ARBITRUM_ONE],
    DAI: DAI[ChainId.ARBITRUM_ONE],
  },
  [ChainId.ARBITRUM_NOVA]: {
    ETH: Native.onChain(ChainId.ARBITRUM_NOVA),
    WETH: WNATIVE[ChainId.ARBITRUM_NOVA],
    USDC: USDC[ChainId.ARBITRUM_NOVA],
    USDT: USDT[ChainId.ARBITRUM_NOVA],
    DAI: DAI[ChainId.ARBITRUM_NOVA],
    ARB: ARB[ChainId.ARBITRUM_NOVA],
    BRICK: BRICK[ChainId.ARBITRUM_NOVA],
    MOON: MOON[ChainId.ARBITRUM_NOVA],
  },
  [ChainId.AVALANCHE]: {
    WAVAX: WNATIVE[ChainId.AVALANCHE],
    ETH: WETH9[ChainId.AVALANCHE],
    WETH: WETH9[ChainId.AVALANCHE],
    WBTC: WBTC[ChainId.AVALANCHE],
    USDC: USDC[ChainId.AVALANCHE],
    USDT: USDT[ChainId.AVALANCHE],
    DAI: DAI[ChainId.AVALANCHE],
  },
} as const

export type ShortCurrencyNameChainId =
  keyof typeof CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY

export type ShortCurrencyName =
  keyof (typeof CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY)[ShortCurrencyNameChainId]

export const isShortCurrencyNameSupported = (
  chainId: ChainId
): chainId is ShortCurrencyNameChainId =>
  chainId in CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY

export const isShortCurrencyName = (
  chainId: ChainId,
  shortCurrencyName: string
): shortCurrencyName is ShortCurrencyName => {
  return (
    isShortCurrencyNameSupported(chainId) &&
    shortCurrencyName in CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY[chainId]
  )
}

export const currencyFromShortCurrencyName = (
  chainId: ChainId,
  shortCurrencyName: ShortCurrencyName
): Type => {
  if (!isShortCurrencyNameSupported(chainId))
    throw new Error(
      `Unsupported chain id ${chainId} for short currency name ${shortCurrencyName}`
    )
  if (!(shortCurrencyName in CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY[chainId]))
    throw new Error(
      `Unsupported short currency name ${shortCurrencyName} on chain ${chainId}`
    )
  return CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY[chainId][shortCurrencyName]
}
