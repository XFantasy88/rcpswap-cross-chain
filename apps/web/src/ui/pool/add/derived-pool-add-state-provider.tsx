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
import { Amount, Native, Price, Type, tryParseAmount } from "rcpswap/currency"
import { Percent } from "rcpswap/math"

export enum Field {
  CURRENCY_A = "CURRENCY_A",
  CURRENCY_B = "CURRENCY_B",
}

interface State {
  mutate: {
    setTypedAmounts: (amounts: { [field in Field]: string }) => void
    setIndependentField: (field: Field) => void
  }
  state: {
    inputs: { [field in Field]: string }
    independentField: Field
  }
}

const DerivedPoolAddStateContext = createContext<State>({} as State)

interface DerivedPoolAddStateProviderProps {
  children: React.ReactNode
}

const DerivedPoolAddStateProvider: FC<DerivedPoolAddStateProviderProps> = ({
  children,
}) => {
  const [inputs, setTypedAmounts] = useState<{ [field in Field]: string }>({
    [Field.CURRENCY_A]: "",
    [Field.CURRENCY_B]: "",
  })

  const [independentField, setIndependentField] = useState(Field.CURRENCY_A)

  return (
    <DerivedPoolAddStateContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setTypedAmounts,
            setIndependentField,
          },
          state: {
            inputs,
            independentField,
          },
        }
      }, [inputs, independentField, setTypedAmounts, setIndependentField])}
    >
      {children}
    </DerivedPoolAddStateContext.Provider>
  )
}

const useDerivedPoolAddState = () => {
  const context = useContext(DerivedPoolAddStateContext)
  if (!context) {
    throw new Error(
      "Hook can only be used inside Simple Swap Derived State Context"
    )
  }

  return context
}

const usePoolAddInfo = (
  currencyA: Type | undefined,
  currencyB: Type | undefined
) => {
  const { address } = useAccount()
  const chainId = ChainId.ARBITRUM_NOVA
  const {
    state: { inputs, independentField },
  } = useDerivedPoolAddState()

  const dependentField =
    independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A

  const currencies = useMemo(
    () => ({
      [Field.CURRENCY_A]: currencyA,
      [Field.CURRENCY_B]: currencyB,
    }),
    [currencyA, currencyB]
  )

  const {
    data: [[poolState, pool]],
  } = useSwapV2Pools(chainId, [[currencyA, currencyB]])

  const totalSupply = useTotalSupply(pool?.liquidityToken)

  const noLiquidity =
    poolState === SwapV2PoolState.NOT_EXISTS ||
    Boolean(totalSupply && totalSupply.equalTo("0"))

  const currencyBalances = {
    [Field.CURRENCY_A]: useBalanceWeb3({
      chainId,
      currency: currencies[Field.CURRENCY_A],
      account: address,
    }).data,
    [Field.CURRENCY_B]: useBalanceWeb3({
      chainId,
      currency: currencies[Field.CURRENCY_B],
      account: address,
    }).data,
  }

  const independentAmount = useMemo(
    () =>
      tryParseAmount(inputs[independentField], currencies[independentField]),
    [inputs[independentField], currencies[independentField], independentField]
  )

  const dependentAmount = useMemo(() => {
    if (noLiquidity) {
      if (inputs[dependentField] && currencies[dependentField]) {
        return tryParseAmount(
          inputs[dependentField],
          currencies[dependentField]
        )
      }
      return undefined
    } else if (independentAmount) {
      const wrappedIndependentAmount = independentAmount.wrapped
      const [tokenA, tokenB] = [currencyA?.wrapped, currencyB?.wrapped]

      if (tokenA && tokenB && wrappedIndependentAmount && pool) {
        const dependentCurrency =
          dependentField === Field.CURRENCY_B ? currencyB : currencyA
        const dependentTokenAmount =
          dependentField === Field.CURRENCY_B
            ? pool.priceOf(tokenA).quote(wrappedIndependentAmount)
            : pool.priceOf(tokenB).quote(wrappedIndependentAmount)

        return dependentCurrency &&
          dependentCurrency.wrapped.equals(
            Native.onChain(dependentCurrency.chainId).wrapped
          )
          ? Amount.fromRawAmount(
              Native.onChain(dependentCurrency.chainId),
              dependentTokenAmount.quotient
            )
          : dependentTokenAmount
      }
      return undefined
    }
    return undefined
  }, [
    noLiquidity,
    inputs[dependentField],
    currencies,
    dependentField,
    independentAmount,
    currencyA,
    currencyB,
    pool,
  ])

  const parsedAmounts = {
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A
        ? independentAmount
        : dependentAmount,
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_A
        ? dependentAmount
        : independentAmount,
  }

  const price = useMemo(() => {
    if (noLiquidity) {
      if (parsedAmounts[Field.CURRENCY_A] && parsedAmounts[Field.CURRENCY_B]) {
        return new Price({
          baseAmount: parsedAmounts[Field.CURRENCY_A],
          quoteAmount: parsedAmounts[Field.CURRENCY_B],
        })
      }
      return undefined
    } else {
      return pool && currencyA?.wrapped
        ? pool.priceOf(currencyA.wrapped)
        : undefined
    }
  }, [currencyA, currencyB, noLiquidity, pool, parsedAmounts])

  const liquidityMinted = useMemo(() => {
    if (
      pool &&
      totalSupply &&
      parsedAmounts[Field.CURRENCY_A]?.wrapped &&
      parsedAmounts[Field.CURRENCY_B]?.wrapped
    ) {
      return pool.getLiquidityMinted(
        totalSupply,
        parsedAmounts[Field.CURRENCY_A]?.wrapped,
        parsedAmounts[Field.CURRENCY_B]?.wrapped
      )
    } else {
      return undefined
    }
  }, [parsedAmounts, chainId, pool, totalSupply])

  const poolTokenPercentage = useMemo(() => {
    if (liquidityMinted && totalSupply) {
      return new Percent(
        liquidityMinted.quotient,
        totalSupply.add(liquidityMinted).quotient
      )
    } else {
      return undefined
    }
  }, [liquidityMinted, totalSupply])

  return {
    dependentField,
    currencies,
    pool,
    poolState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
  }
}

export { DerivedPoolAddStateProvider, useDerivedPoolAddState, usePoolAddInfo }
