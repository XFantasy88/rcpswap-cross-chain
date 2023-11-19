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

  const sushiLiquidityProviders = [LiquidityProviders.SushiSwapV2]
  if (isRouteProcessor3ChainId(chainId)) {
    sushiLiquidityProviders.push(LiquidityProviders.SushiSwapV3)
  }

  const liquidityProviders = providers
    ? providers
    : [
        ...sushiLiquidityProviders,
        LiquidityProviders.ArbSwap,
        LiquidityProviders.RCPSwap,
      ]

  const dataFetcher = DataFetcher.onChain(chainId)
  // console.log('dataFetcher startDataFetching')
  dataFetcher.startDataFetching(liquidityProviders)

  await dataFetcher.fetchPoolsForToken(currencyA, currencyB)
  // console.log('dataFetcher stopDataFetching')
  dataFetcher.stopDataFetching()
  return dataFetcher.getCurrentPoolCodeMap(currencyA, currencyB)
}
