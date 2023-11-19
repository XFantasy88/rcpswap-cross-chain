import { TokenAddressMap, useUnsupportedTokenList } from "@/state/lists/hooks"
import { ChainId } from "rcpswap/chain"
import { Token } from "rcpswap/currency"
import { useMemo } from "react"
import {
  useCombinedActiveList,
  useCombinedInactiveList,
} from "../state/lists/hooks"
import { useCustomTokens } from "@rcpswap/hooks"
import { filterTokens } from "@rcpswap/wagmi"

// reduce token map into standard address <-> Token mapping, optionally include user added tokens
function useTokensFromMap(
  tokenMap: TokenAddressMap,
  includeUserAdded: boolean,
  chainId?: ChainId
): { [address: string]: Token } {
  const chain = chainId ?? ChainId.ARBITRUM_NOVA

  const userAddedTokens = Object.values(
    useCustomTokens().data ?? ({} as Record<string, Token>)
  )

  return useMemo(() => {
    if (!chain) return {}

    // reduce to just tokens
    const mapWithoutUrls = Object.keys(tokenMap[chain]).reduce<{
      [address: string]: Token
    }>((newMap, address) => {
      newMap[address] = tokenMap[chain][address].token
      return newMap
    }, {})

    if (includeUserAdded) {
      return (
        userAddedTokens
          .filter((token) => token.chainId === chain)
          // reduce into all ALL_TOKENS filtered by the current chain
          .reduce<{ [address: string]: Token }>(
            (tokenMap, token) => {
              tokenMap[token.address] = token
              return tokenMap
            },
            // must make a copy because reduce modifies the map, and we do not
            // want to make a copy in every iteration
            { ...mapWithoutUrls }
          )
      )
    }

    return mapWithoutUrls
  }, [chainId, userAddedTokens, tokenMap, includeUserAdded])
}

export function useAllTokens(chainId?: ChainId): { [address: string]: Token } {
  const allTokens = useCombinedActiveList()
  return useTokensFromMap(allTokens, true, chainId)
}

export function useAllInactiveTokens(): { [address: string]: Token } {
  // get inactive tokens
  const inactiveTokensMap = useCombinedInactiveList()
  const inactiveTokens = useTokensFromMap(inactiveTokensMap, false)

  // filter out any token that are on active list
  const activeTokensAddresses = Object.keys(useAllTokens())
  const filteredInactive = activeTokensAddresses
    ? Object.keys(inactiveTokens).reduce<{ [address: string]: Token }>(
        (newMap, address) => {
          if (!activeTokensAddresses.includes(address)) {
            newMap[address] = inactiveTokens[address]
          }
          return newMap
        },
        {}
      )
    : inactiveTokens

  return filteredInactive
}

export function useUnsupportedTokens(): { [address: string]: Token } {
  const unsupportedTokensMap = useUnsupportedTokenList()
  return useTokensFromMap(unsupportedTokensMap, false)
}

export function useIsTokenActive(
  token: Token | undefined | null,
  chainId?: ChainId
): boolean {
  const activeTokens = useAllTokens(chainId)

  if (!activeTokens || !token) {
    return false
  }

  return !!activeTokens[token.address]
}

export function useFoundOnInactiveList(
  searchQuery: string,
  chainId?: ChainId
): Token[] | undefined {
  const inactiveTokens = useAllInactiveTokens()

  return useMemo(() => {
    if (!chainId || searchQuery === "") {
      return undefined
    } else {
      const tokens = filterTokens(Object.values(inactiveTokens), searchQuery)
      return tokens
    }
  }, [chainId, inactiveTokens, searchQuery])
}
