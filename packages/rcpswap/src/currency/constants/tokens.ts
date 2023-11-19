import { ChainId } from "../../chain/index.js"

import { Token } from "../Token.js"
import { addressMapToTokenMap } from "../functions/address-map-to-token-map.js"

import {
  ARB_ADDRESS,
  BRICK_ADDRESS,
  DAI_ADDRESS,
  MOOND_ADDRESS,
  MOON_ADDRESS,
  USDC_ADDRESS,
  USDT_ADDRESS,
  WBTC_ADDRESS,
  WETH9_ADDRESS,
  WNATIVE_ADDRESS,
} from "./token-addresses.js"

export const ARB = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "ARB",
    name: "Arbitrum",
  },
  ARB_ADDRESS
) as Record<keyof typeof ARB_ADDRESS, Token>

export const WBTC = addressMapToTokenMap(
  {
    decimals: 8,
    symbol: "WBTC",
    name: "Wrapped BTC",
  },
  WBTC_ADDRESS
) as Record<keyof typeof WBTC_ADDRESS, Token>

export const WETH9 = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "WETH",
    name: "Wrapped Ether",
  },
  WETH9_ADDRESS
) as Record<keyof typeof WETH9_ADDRESS, Token>

export const WNATIVE = {
  [ChainId.POLYGON]: new Token({
    chainId: ChainId.POLYGON,
    address: WNATIVE_ADDRESS[ChainId.POLYGON],
    decimals: 18,
    symbol: "WMATIC",
    name: "Wrapped Matic",
  }),
  [ChainId.ARBITRUM_NOVA]: WETH9[ChainId.ARBITRUM_NOVA],
} as const

export const USDC: Record<keyof typeof USDC_ADDRESS, Token> = {
  ...(addressMapToTokenMap(
    {
      decimals: 6,
      symbol: "USDC",
      name: "USD Coin",
    },
    USDC_ADDRESS
  ) as Record<keyof typeof USDC_ADDRESS, Token>),
} as const

export const USDT: Record<keyof typeof USDT_ADDRESS, Token> = {
  ...(addressMapToTokenMap(
    {
      decimals: 6,
      symbol: "USDT",
      name: "Tether USD",
    },
    USDT_ADDRESS
  ) as Record<keyof typeof USDT_ADDRESS, Token>),
}

export const DAI = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "DAI",
    name: "Dai Stablecoin",
  },
  DAI_ADDRESS
) as Record<keyof typeof DAI_ADDRESS, Token>

export const MOON = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "MOON",
    name: "Moons",
  },
  MOON_ADDRESS
) as Record<keyof typeof MOON_ADDRESS, Token>

export const BRICK = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "BRICK",
    name: "Bricks",
  },
  BRICK_ADDRESS
) as Record<keyof typeof BRICK_ADDRESS, Token>

export const MOOND = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "MOOND",
    name: "MoonsDust",
  },
  MOOND_ADDRESS
) as Record<keyof typeof MOOND_ADDRESS, Token>
