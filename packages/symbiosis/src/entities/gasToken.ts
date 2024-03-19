import { ChainId } from "../constants";
import { Token } from "./token";

const GAS = (chainId: ChainId, symbol: string, iconId: number, decimals = 18) =>
  new Token({
    isNative: true,
    name: symbol,
    symbol,
    address: "",
    chainId,
    decimals,
    icons: {
      small: `https://s2.coinmarketcap.com/static/img/coins/64x64/${iconId}.png`,
      large: `https://s2.coinmarketcap.com/static/img/coins/64x64/${iconId}.png`,
    },
  });

export const GAS_TOKEN: Record<ChainId, Token> = {
  [ChainId.BSC_MAINNET]: GAS(ChainId.BSC_MAINNET, "BNB", 1839),
  [ChainId.MATIC_MAINNET]: GAS(ChainId.MATIC_MAINNET, "MATIC", 3890),
  [ChainId.AVAX_MAINNET]: GAS(ChainId.AVAX_MAINNET, "AVAX", 5805),
  [ChainId.BOBA_BNB]: GAS(ChainId.BOBA_BNB, "BOBA", 14556),
  [ChainId.ARBITRUM_MAINNET]: GAS(ChainId.ARBITRUM_MAINNET, "ETH", 1027),
  [ChainId.ARBITRUM_NOVA]: GAS(ChainId.ARBITRUM_NOVA, "ETH", 1027),
};
