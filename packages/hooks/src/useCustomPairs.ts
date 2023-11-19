import { getAddress, isAddress } from "@ethersproject/address"
import { useCallback, useMemo } from "react"
import { Token } from "rcpswap/currency"

import { useLocalStorage } from "./useLocalStorage"

type SerializedToken = {
  chainId: number
  id: string
  address: string
  decimals: number
  name: string | undefined
  symbol: string | undefined
}

type Data = {
  token0: SerializedToken
  token1: SerializedToken
}

export const useCustomPairs = () => {
  const [value, setValue] = useLocalStorage<Record<string, Data>>(
    "rcpswap.customPairs",
    {}
  )

  const hydrate = useCallback((data: Record<string, Data>) => {
    return Object.entries(data).reduce<Record<string, [Token, Token]>>(
      (acc, [k, { token0, token1 }]) => {
        acc[k] = [new Token({ ...token0 }), new Token({ ...token1 })]
        return acc
      },
      {}
    )
  }, [])

  const addCustomPair = useCallback(
    (pairs: [Token, Token][]) => {
      const data: Data[] = pairs.map((pair) => ({
        token0: {
          address: pair[0].address,
          chainId: pair[0].chainId,
          decimals: pair[0].decimals,
          id: pair[0].id,
          name: pair[0].name,
          symbol: pair[0].symbol,
        },
        token1: {
          address: pair[1].address,
          chainId: pair[1].chainId,
          decimals: pair[1].decimals,
          id: pair[1].id,
          name: pair[1].name,
          symbol: pair[1].symbol,
        },
      }))

      setValue((prev) => {
        return data.reduce(
          (acc, cur) => {
            acc[`${cur.token0.address}:${cur.token1.address}`] = cur
            return acc
          },
          { ...prev }
        )
      })
    },
    [setValue]
  )

  const removeCustomPair = useCallback(
    (pair: [Token, Token]) => {
      setValue((prev) => {
        return Object.entries(prev).reduce<Record<string, Data>>((acc, cur) => {
          if (cur[0] === `${pair[0].address}:${pair[1].address}`) {
            return acc // filter
          }

          acc[cur[0]] = cur[1] // add
          return acc
        }, {})
      })
    },
    [setValue]
  )

  const hasPair = useCallback(
    (pair: [Token, Token] | string) => {
      if (typeof pair === "string") {
        if (!pair.includes(":")) {
          throw new Error("Address provided instead of id")
        }

        const [_currency0, _currency1] = pair.split(":")
        if (!isAddress(_currency0) || !isAddress(_currency1)) {
          throw new Error("Address provided not a valid ERC20 address")
        }

        return !!value[`${getAddress(_currency0)}:${getAddress(_currency1)}`]
      }
      return !!value[`${pair[0].address}:${pair[1].address}`]
    },
    [value]
  )

  const mutate = useCallback(
    (type: "add" | "remove", pair: [Token, Token][]) => {
      if (type === "add") addCustomPair(pair)
      if (type === "remove") removeCustomPair(pair[0])
    },
    [addCustomPair, removeCustomPair]
  )

  return useMemo(() => {
    return {
      data: hydrate(value),
      mutate,
      hasPair,
    }
  }, [hasPair, hydrate, mutate, value])
}
