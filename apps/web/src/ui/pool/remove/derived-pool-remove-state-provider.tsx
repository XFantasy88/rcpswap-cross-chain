"use client"

import {
  SwapV2PoolState,
  useAccount,
  useBalanceWeb3,
  useSwapV2Pools,
  useTotalSupply,
} from "@rcpswap/wagmi"
import { FC, createContext, useContext, useMemo, useState } from "react"
import { ChainId } from "rcpswap/chain"
import {
  Amount,
  Native,
  Price,
  Token,
  Type,
  tryParseAmount,
} from "rcpswap/currency"
import { Percent } from "rcpswap/math"

export enum Field {
  LIQUIDITY_PERCENT = "LIQUIDITY_PERCENT",
  LIQUIDITY = "LIQUIDITY",
  CURRENCY_A = "CURRENCY_A",
  CURRENCY_B = "CURRENCY_B",
}

interface State {
  mutate: {
    typeInput: (data: { independentField: Field; typedValue: string }) => void
  }
  state: {
    independentField: Field
    typedValue: string
  }
}

const DerivedPoolRemoveStateContext = createContext<State>({} as State)

interface DerivedPoolRemoveStateProviderProps {
  children: React.ReactNode
}

const DerivedPoolRemoveStateProvider: FC<
  DerivedPoolRemoveStateProviderProps
> = ({ children }) => {
  const [{ independentField, typedValue }, setTypeInput] = useState<{
    independentField: Field
    typedValue: string
  }>({
    independentField: Field.LIQUIDITY_PERCENT,
    typedValue: "",
  })

  return (
    <DerivedPoolRemoveStateContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            typeInput: setTypeInput,
          },
          state: {
            independentField,
            typedValue,
          },
        }
      }, [independentField, typedValue, setTypeInput])}
    >
      {children}
    </DerivedPoolRemoveStateContext.Provider>
  )
}

const useDerivedPoolRemoveState = () => {
  const context = useContext(DerivedPoolRemoveStateContext)
  if (!context) {
    throw new Error(
      "Hook can only be used inside Simple Swap Derived State Context"
    )
  }

  return context
}

const usePoolRemoveInfo = (
  currencyA: Type | undefined,
  currencyB: Type | undefined
) => {
  const { address } = useAccount()
  const chainId = ChainId.ARBITRUM_NOVA
  const {
    state: { independentField, typedValue },
  } = useDerivedPoolRemoveState()

  const {
    data: [[, pool]],
  } = useSwapV2Pools(chainId, [[currencyA, currencyB]])

  const { data: userLiquidity } = useBalanceWeb3({
    account: address,
    currency: pool?.liquidityToken,
    chainId,
  })

  const [tokenA, tokenB] = [currencyA?.wrapped, currencyB?.wrapped]
  const tokens = {
    [Field.CURRENCY_A]: tokenA,
    [Field.CURRENCY_B]: tokenB,
    [Field.LIQUIDITY]: pool?.liquidityToken,
  }

  const totalSupply = useTotalSupply(pool?.liquidityToken)

  const liquidityValueA =
    pool &&
    totalSupply &&
    userLiquidity &&
    tokenA &&
    !totalSupply.lessThan(userLiquidity)
      ? Amount.fromRawAmount(
          tokenA,
          pool.getLiquidityValue(
            tokenA,
            totalSupply,
            userLiquidity.wrapped,
            false
          ).quotient
        )
      : undefined

  const liquidityValueB =
    pool &&
    totalSupply &&
    userLiquidity &&
    tokenB &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    !totalSupply.lessThan(userLiquidity)
      ? Amount.fromRawAmount(
          tokenB,
          pool.getLiquidityValue(
            tokenB,
            totalSupply,
            userLiquidity.wrapped,
            false
          ).quotient
        )
      : undefined

  const liquidityValues: {
    [Field.CURRENCY_A]?: Amount<Type>
    [Field.CURRENCY_B]?: Amount<Type>
  } = {
    [Field.CURRENCY_A]: liquidityValueA,
    [Field.CURRENCY_B]: liquidityValueB,
  }

  let percentToRemove: Percent = new Percent("0", "100")

  if (independentField === Field.LIQUIDITY_PERCENT) {
    percentToRemove = new Percent(typedValue, "100")
  } else if (independentField === Field.LIQUIDITY) {
    if (pool?.liquidityToken) {
      const independentAmount = tryParseAmount(typedValue, pool.liquidityToken)
      if (
        independentAmount &&
        userLiquidity &&
        !independentAmount.greaterThan(userLiquidity)
      ) {
        percentToRemove = new Percent(
          independentAmount.quotient,
          userLiquidity.quotient
        )
      }
    }
  } else {
    if (tokens[independentField]) {
      const independentAmount = tryParseAmount(
        typedValue,
        tokens[independentField]
      )
      const liquidityValue = liquidityValues[independentField]
      if (
        independentAmount &&
        liquidityValue &&
        !independentAmount.greaterThan(liquidityValue)
      ) {
        percentToRemove = new Percent(
          independentAmount.quotient,
          liquidityValue.quotient
        )
      }
    }
  }

  const parsedAmounts: {
    [Field.LIQUIDITY_PERCENT]: Percent
    [Field.LIQUIDITY]?: Amount<Type>
    [Field.CURRENCY_A]?: Amount<Type>
    [Field.CURRENCY_B]?: Amount<Type>
  } = {
    [Field.LIQUIDITY_PERCENT]: percentToRemove,
    [Field.LIQUIDITY]:
      userLiquidity && percentToRemove && percentToRemove.greaterThan("0")
        ? Amount.fromRawAmount(
            userLiquidity.currency,
            percentToRemove.multiply(userLiquidity).quotient
          )
        : undefined,
    [Field.CURRENCY_A]:
      tokenA &&
      percentToRemove &&
      percentToRemove.greaterThan("0") &&
      liquidityValueA
        ? Amount.fromRawAmount(
            tokenA,
            percentToRemove.multiply(liquidityValueA).quotient
          )
        : undefined,
    [Field.CURRENCY_B]:
      tokenB &&
      percentToRemove &&
      percentToRemove.greaterThan("0") &&
      liquidityValueB
        ? Amount.fromRawAmount(
            tokenB,
            percentToRemove.multiply(liquidityValueB).quotient
          )
        : undefined,
  }

  return { pool, parsedAmounts }
}

export {
  DerivedPoolRemoveStateProvider,
  useDerivedPoolRemoveState,
  usePoolRemoveInfo,
}
