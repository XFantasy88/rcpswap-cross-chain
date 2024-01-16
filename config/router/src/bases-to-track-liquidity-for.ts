import { ChainId } from "rcpswap/chain"
import {
  ARB,
  BRICK,
  BUSD,
  DAI,
  MOON,
  MOOND,
  Token,
  USDC,
  USDCe,
  USDT,
  WBTC,
  WETH9,
  WNATIVE,
} from "rcpswap/currency"

export const BASES_TO_TRACK_LIQUIDITY_FOR: {
  readonly [chainId in ChainId]: Token[]
} = {
  [ChainId.BSC]: [
    WNATIVE[ChainId.BSC],
    WETH9[ChainId.BSC],
    BUSD[ChainId.BSC],
    USDC[ChainId.BSC],
    USDT[ChainId.BSC],
    DAI[ChainId.BSC],
  ],
  [ChainId.ARBITRUM_NOVA]: [
    WNATIVE[ChainId.ARBITRUM_NOVA],
    USDC[ChainId.ARBITRUM_NOVA],
    DAI[ChainId.ARBITRUM_NOVA],
    ARB[ChainId.ARBITRUM_NOVA],
    MOON[ChainId.ARBITRUM_NOVA],
    BRICK[ChainId.ARBITRUM_NOVA],
    MOOND[ChainId.ARBITRUM_NOVA],
  ],
  [ChainId.POLYGON]: [
    WNATIVE[ChainId.POLYGON],
    WETH9[ChainId.POLYGON],
    WBTC[ChainId.POLYGON],
    USDC[ChainId.POLYGON],
    USDT[ChainId.POLYGON],
    DAI[ChainId.POLYGON],
  ],
  [ChainId.ARBITRUM_ONE]: [
    WNATIVE[ChainId.ARBITRUM_ONE],
    WBTC[ChainId.ARBITRUM_ONE],
    USDC[ChainId.ARBITRUM_ONE],
    USDCe[ChainId.ARBITRUM_ONE],
    USDT[ChainId.ARBITRUM_ONE],
    DAI[ChainId.ARBITRUM_ONE],
  ],
  [ChainId.AVALANCHE]: [
    WNATIVE[ChainId.AVALANCHE],
    WETH9[ChainId.AVALANCHE],
    WBTC[ChainId.AVALANCHE],
    USDC[ChainId.AVALANCHE],
    new Token({
      chainId: ChainId.AVALANCHE,
      address: "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664",
      decimals: 6,
      symbol: "USDC.e",
      name: "USD Coin",
    }),
    USDT[ChainId.AVALANCHE],
    new Token({
      chainId: ChainId.AVALANCHE,
      address: "0xc7198437980c041c805A1EDcbA50c1Ce5db95118",
      decimals: 6,
      symbol: "USDT.e",
      name: "Tether USD",
    }),
    DAI[ChainId.AVALANCHE],
    new Token({
      chainId: ChainId.AVALANCHE,
      address: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
      decimals: 18,
      symbol: "DAI.e",
      name: "Dai Stablecoin",
    }),
  ],
}
