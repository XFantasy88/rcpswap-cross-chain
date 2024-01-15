import {
  UseTradeParams,
  UseTradeReturn,
  UseTradeReturnWriteArgs,
} from "@rcpswap/router"
import { usePrice } from "@rcpswap/react-query"
import { LiquidityProviders, Router } from "@rcpswap/router"
import { useQuery } from "@tanstack/react-query"
import { slippageAmount } from "rcpswap/calculate"
import {
  ROUTE_PROCESSOR_3_ADDRESS,
  ROUTE_PROCESSOR_ADDRESS,
  isRouteProcessor3ChainId,
  isRouteProcessorChainId,
} from "rcpswap/config"
import {
  Amount,
  DAI,
  Native,
  Price,
  Type,
  USDC,
  USDT,
  WBTC,
  WNATIVE,
  WNATIVE_ADDRESS,
} from "rcpswap/currency"
import { Percent } from "rcpswap/math"
import { Address, Hex } from "viem"
import { useFeeData } from "wagmi"
import { usePoolsCodeMap } from "../pools"
import { ChainId } from "rcpswap/chain"
import {
  MultiRoute,
  RPool,
  RouteStatus,
  getBetterRouteExactIn,
} from "@rcpswap/tines"

export const useClientTrade = (variables: UseTradeParams) => {
  const {
    chainId,
    fromToken,
    toToken,
    slippagePercentage,
    amount,
    feeEnabled,
    enabled,
    recipient,
    maxFlowNumber,
    providers,
  } = variables

  const { data: feeData } = useFeeData({ chainId, enabled })
  const { data: price } = usePrice({
    chainId,
    address: WNATIVE_ADDRESS[chainId],
  })
  const { data: poolsCodeMap } = usePoolsCodeMap({
    chainId,
    currencyA: fromToken,
    currencyB: toToken,
    providers,
    enabled,
  })

  return useQuery({
    queryKey: [
      "useClientTrade",
      {
        chainId,
        currencyA: fromToken,
        currencyB: toToken,
        amount,
        slippagePercentage,
        recipient,
        poolsCodeMap,
        feeEnabled,
        maxFlowNumber,
        providers,
      },
    ],
    queryFn: async function () {
      if (
        !poolsCodeMap ||
        (!isRouteProcessorChainId(chainId) &&
          !isRouteProcessor3ChainId(chainId)) ||
        !fromToken ||
        !amount ||
        !toToken ||
        !feeData?.gasPrice
      )
        return {
          abi: undefined,
          address: undefined,
          swapPrice: undefined,
          priceImpact: undefined,
          amountIn: undefined,
          amountOut: undefined,
          minAmountOut: undefined,
          gasSpent: undefined,
          writeArgs: undefined,
          route: undefined,
          functionName: "processRoute",
          value: undefined,
        }

      const route = Router.findBestRoute(
        poolsCodeMap,
        chainId,
        fromToken,
        amount.quotient,
        toToken,
        Number(feeData.gasPrice),
        maxFlowNumber,
        providers
      )

      let feeAmount: Amount<Type>
      let feeAmountBI: bigint = 0n
      let bestSingleAmountOut: Amount<Type>
      let bestSingleDex: string

      if (feeEnabled && route.amountOutBI > 0n) {
        const sushiTokens = [
          WNATIVE[ChainId.ARBITRUM_NOVA],
          USDC[ChainId.ARBITRUM_NOVA],
          WBTC[ChainId.ARBITRUM_NOVA],
          USDT[ChainId.ARBITRUM_NOVA],
          DAI[ChainId.ARBITRUM_NOVA],
          Native.onChain(ChainId.ARBITRUM_NOVA),
          toToken,
          fromToken,
        ]

        const sushiRoute = Router.findBestRoute(
          poolsCodeMap,
          chainId,
          fromToken,
          amount.quotient,
          toToken,
          Number(feeData.gasPrice),
          100,
          [LiquidityProviders.SushiSwapV2, LiquidityProviders.SushiSwapV3],
          (list: RPool) => {
            return !!sushiTokens.find(
              (item) => item === list.token0 || item === list.token1
            )
          }
        )

        const rcpRoute = Router.findBestRoute(
          poolsCodeMap,
          chainId,
          fromToken,
          amount.quotient,
          toToken,
          Number(feeData.gasPrice),
          1,
          [LiquidityProviders.RCPSwap]
        )

        const arbRoute = Router.findBestRoute(
          poolsCodeMap,
          chainId,
          fromToken,
          amount.quotient,
          toToken,
          Number(feeData.gasPrice),
          1,
          [LiquidityProviders.ArbSwap]
        )

        const biRoute = Router.findBestRoute(
          poolsCodeMap,
          chainId,
          fromToken,
          amount.quotient,
          toToken,
          Number(feeData.gasPrice),
          1,
          [LiquidityProviders.BiSwap]
        )

        const uniRoute = Router.findBestRoute(
          poolsCodeMap,
          chainId,
          fromToken,
          amount.quotient,
          toToken,
          Number(feeData.gasPrice),
          100,
          [LiquidityProviders.UniSwapV3]
        )

        const quickRoute = Router.findBestRoute(
          poolsCodeMap,
          chainId,
          fromToken,
          amount.quotient,
          toToken,
          Number(feeData.gasPrice),
          100,
          [LiquidityProviders.QuickSwapV2, LiquidityProviders.QuickSwapV3]
        )

        const camletRoute = Router.findBestRoute(
          poolsCodeMap,
          chainId,
          fromToken,
          amount.quotient,
          toToken,
          Number(feeData.gasPrice),
          100,
          [LiquidityProviders.CamelotSwapV2, LiquidityProviders.CamelotSwapV3]
        )

        const pancakeRoute = Router.findBestRoute(
          poolsCodeMap,
          chainId,
          fromToken,
          amount.quotient,
          toToken,
          Number(feeData.gasPrice),
          100,
          [LiquidityProviders.PancakeSwapV2, LiquidityProviders.PancakeSwapV3]
        )

        const bestSingleRoute = getBetterRouteExactIn(
          getBetterRouteExactIn(
            getBetterRouteExactIn(
              getBetterRouteExactIn(
                getBetterRouteExactIn(
                  getBetterRouteExactIn(
                    getBetterRouteExactIn(sushiRoute, rcpRoute),
                    arbRoute
                  ),
                  uniRoute
                ),
                quickRoute
              ),
              camletRoute
            ),
            biRoute
          ),
          pancakeRoute
        )

        bestSingleDex =
          bestSingleRoute === sushiRoute
            ? "Sushi"
            : bestSingleRoute === rcpRoute
            ? "RCP"
            : bestSingleRoute === arbRoute
            ? "Arb"
            : bestSingleRoute === uniRoute
            ? "Uni"
            : bestSingleRoute === quickRoute
            ? "Quick"
            : bestSingleRoute === biRoute
            ? "Bi"
            : bestSingleRoute === camletRoute
            ? "Camelot"
            : "Pancake"

        bestSingleAmountOut = Amount.fromRawAmount(
          toToken,
          bestSingleRoute.amountOutBI
        )

        feeAmountBI =
          route.amountOutBI > bestSingleRoute.amountOutBI
            ? ((route.amountOutBI - bestSingleRoute.amountOutBI) * 3000n) /
                10000n +
              (bestSingleRoute.amountOutBI * 100n) / 10000n
            : (bestSingleRoute.amountOutBI * 100n) / 10000n

        feeAmount = Amount.fromRawAmount(toToken, feeAmountBI)
      }

      console.log(route)

      let args = undefined

      if (recipient) {
        if (isRouteProcessor3ChainId(chainId)) {
          args = Router.routeProcessor3Params(
            poolsCodeMap,
            route,
            fromToken,
            toToken,
            recipient,
            ROUTE_PROCESSOR_3_ADDRESS[chainId],
            [],
            +slippagePercentage / 100
          )
        } else if (isRouteProcessorChainId(chainId)) {
          args = Router.routeProcessorParams(
            poolsCodeMap,
            route,
            fromToken,
            toToken,
            recipient,
            ROUTE_PROCESSOR_ADDRESS[chainId],
            +slippagePercentage / 100
          )
        }
      }

      if (route) {
        const amountIn = Amount.fromRawAmount(
          fromToken,
          route.amountInBI.toString()
        )
        const amountOut = Amount.fromRawAmount(
          toToken,
          route.amountOutBI.toString()
        )

        // let writeArgs: UseTradeReturnWriteArgs = args
        let writeArgs: UseTradeReturnWriteArgs = args
          ? [
              args.tokenIn as Address,
              args.amountIn,
              args.tokenOut as Address,
              args.amountOutMin,
              feeAmountBI,
              args.to as Address,
              args.routeCode as Hex,
            ]
          : undefined

        // const overrides = fromToken.isNative && writeArgs?.[1] ? { value: BigNumber.from(writeArgs?.[1]) } : undefined
        let value =
          fromToken.isNative && writeArgs?.[1] ? writeArgs[1] : undefined

        return new Promise((res) =>
          setTimeout(
            () =>
              res({
                swapPrice: amountOut.greaterThan(0n)
                  ? new Price({
                      baseAmount: amount,
                      quoteAmount: amountOut.subtract(
                        feeAmount ?? Amount.fromRawAmount(toToken, 0)
                      ),
                    })
                  : undefined,
                priceImpact: route.priceImpact
                  ? new Percent(
                      BigInt(Math.round(route.priceImpact * 10000)),
                      10000n
                    )
                  : new Percent(0),
                amountIn,
                amountOut,
                feeAmount,
                bestSingleDex,
                bestSingleAmountOut,
                minAmountOut:
                  typeof writeArgs?.[3] === "bigint"
                    ? Amount.fromRawAmount(toToken, writeArgs[3])
                    : Amount.fromRawAmount(
                        toToken,
                        slippageAmount(
                          amountOut,
                          new Percent(Math.floor(0.5 * 100), 10_000)
                        )[0]
                      ),
                gasSpent:
                  price && feeData.gasPrice
                    ? Amount.fromRawAmount(
                        Native.onChain(chainId),
                        feeData.gasPrice * BigInt(route.gasSpent * 1.2)
                      ).toSignificant(4)
                    : undefined,
                route,
                functionName: "processRoute",
                writeArgs,
                value,
              }),
            250
          )
        )
      }
    },
    refetchInterval: 20000,
    enabled: Boolean(
      enabled && poolsCodeMap && feeData && fromToken && toToken && chainId
    ),
  })
}
