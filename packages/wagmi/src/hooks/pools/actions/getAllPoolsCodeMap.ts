import { DataFetcher, LiquidityProviders, PoolCode } from "@rcpswap/router"
import { isRouteProcessor3ChainId } from "rcpswap/config"

import { UsePoolsParams } from "../types"

export const getAllPoolsCodeMap = async ({
  currencyA,
  currencyB,
  chainId,
  providers,
}: Omit<UsePoolsParams, "enabled"> & { providers?: LiquidityProviders[] }) => {
  if (!currencyA || !currencyB || !chainId) {
    return new Map<string, PoolCode>()
  }

  const liquidityProviders = providers
    ? providers
    : [
        LiquidityProviders.SushiSwapV2,
        LiquidityProviders.SushiSwapV3,
        LiquidityProviders.ArbSwap,
        LiquidityProviders.RCPSwap,
        LiquidityProviders.UniSwapV3,
        LiquidityProviders.QuickSwapV2,
        LiquidityProviders.QuickSwapV3,
        LiquidityProviders.CamelotSwapV3,
        LiquidityProviders.PancakeSwapV2,
        LiquidityProviders.PancakeSwapV3,
        LiquidityProviders.BiSwap,
        LiquidityProviders.TraderJoe,
        LiquidityProviders.PangolinSwap
      ]

  const dataFetcher = DataFetcher.onChain(chainId)
  // console.log('dataFetcher startDataFetching')
  dataFetcher.startDataFetching(liquidityProviders)

  await dataFetcher.fetchPoolsForToken(currencyA, currencyB)
  // console.log('dataFetcher stopDataFetching')
  dataFetcher.stopDataFetching()
  return dataFetcher.getCurrentPoolCodeMap(currencyA, currencyB)
}
