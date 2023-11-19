import { useMemo } from "react"
import { ChainId } from "rcpswap/chain"
import { useAllTokens } from "./Tokens"
import flatMap from "lodash.flatmap"
import { Token } from "rcpswap/currency"
import {
  PINNED_PAIRS,
  BASES_TO_TRACK_LIQUIDITY_FOR,
} from "@rcpswap/router-config"
import { useCustomPairs } from "@rcpswap/hooks"

export function useTrackedTokenPairs(): [Token, Token][] {
  // const { chainId } = useActiveWeb3React()
  const chainId = ChainId.ARBITRUM_NOVA
  const tokens = useAllTokens(chainId)

  // pinned pairs
  const pinnedPairs = useMemo(
    () => (chainId ? PINNED_PAIRS[chainId] ?? [] : []),
    [chainId]
  )

  // pairs for every token against every base
  const generatedPairs: [Token, Token][] = useMemo(
    () =>
      chainId
        ? flatMap(Object.keys(tokens), (tokenAddress) => {
            const token = tokens[tokenAddress]
            // for each token on the current chain,
            return (
              // loop though all bases on the current chain
              (BASES_TO_TRACK_LIQUIDITY_FOR[chainId] ?? [])
                // to construct pairs of the given token with each base
                .map((base) => {
                  if (base.address === token.address) {
                    return null
                  } else {
                    return [base, token]
                  }
                })
                .filter((p): p is [Token, Token] => p !== null)
            )
          })
        : [],
    [tokens, chainId]
  )

  // pairs saved by users
  const userPairs = Object.values(useCustomPairs().data)

  const combinedList = useMemo(
    () => userPairs.concat(generatedPairs).concat(pinnedPairs),
    [generatedPairs, pinnedPairs, userPairs]
  )

  return useMemo(() => {
    // dedupes pairs of tokens in the combined list
    const keyed = combinedList.reduce<{ [key: string]: [Token, Token] }>(
      (memo, [tokenA, tokenB]) => {
        const sorted = tokenA.sortsBefore(tokenB)
        const key = sorted
          ? `${tokenA.address}:${tokenB.address}`
          : `${tokenB.address}:${tokenA.address}`
        if (memo[key]) return memo
        memo[key] = sorted ? [tokenA, tokenB] : [tokenB, tokenA]
        return memo
      },
      {}
    )

    return Object.keys(keyed).map((key) => keyed[key])
  }, [combinedList])
}
