import { ChainId } from "rcpswap/chain"
import { WrappedTokenInfo } from "rcpswap"
import { TokenList } from "@uniswap/token-lists"
import { useMemo } from "react"
import { useSelector } from "react-redux"
import { AppState } from "../index"
import { sortByListPriority } from "@/utils"
import { UNSUPPORTED_LIST_URLS, UNSUPPORTED_TOKEN_LIST } from "rcpswap"

export type TokenAddressMap = Readonly<{
  [chainId in ChainId]: Readonly<{
    [tokenAddress: string]: { token: WrappedTokenInfo; list: TokenList }
  }>
}>

/**
 * An empty result, useful as a default.
 */
const EMPTY_LIST: TokenAddressMap = {
  [ChainId.POLYGON]: {},
  [ChainId.ARBITRUM_ONE]: {},
  [ChainId.ARBITRUM_NOVA]: {},
}

const listCache: WeakMap<TokenList, TokenAddressMap> | null =
  typeof WeakMap !== "undefined"
    ? new WeakMap<TokenList, TokenAddressMap>()
    : null

export function listToTokenMap(list: TokenList): TokenAddressMap {
  const result = listCache?.get(list)
  if (result) return result

  const map = list.tokens.reduce<TokenAddressMap>(
    (tokenMap, tokenInfo) => {
      const token = new WrappedTokenInfo(tokenInfo, list)
      if (tokenMap?.[token.chainId]?.[token.address] !== undefined)
        throw Error("Duplicate tokens.")
      return {
        ...tokenMap,
        [token.chainId]: {
          ...tokenMap[token.chainId],
          [token.address]: {
            token,
            list: list,
          },
        },
      }
    },
    { ...EMPTY_LIST }
  )
  listCache?.set(list, map)
  return map
}

export function useAllLists(): {
  readonly [url: string]: {
    readonly current: TokenList | null
    readonly pendingUpdate: TokenList | null
    readonly loadingRequestId: string | null
    readonly error: string | null
  }
} {
  return useSelector<AppState, AppState["lists"]["byUrl"]>(
    (state) => state.lists.byUrl
  )
}

function combineMaps(
  map1: TokenAddressMap,
  map2?: TokenAddressMap
): TokenAddressMap {
  return {
    [ChainId.POLYGON]: { ...map1[ChainId.POLYGON], ...map2?.[ChainId.POLYGON] },
    [ChainId.ARBITRUM_NOVA]: {
      ...map1[ChainId.ARBITRUM_NOVA],
      ...map2?.[ChainId.ARBITRUM_NOVA],
    },
    [ChainId.ARBITRUM_ONE]: {
      ...map1[ChainId.ARBITRUM_ONE],
      ...map2?.[ChainId.ARBITRUM_ONE],
    },
  }
}

// merge tokens contained within lists from urls
function useCombinedTokenMapFromUrls(
  urls: string[] | undefined
): TokenAddressMap {
  const lists = useAllLists()

  return useMemo(() => {
    if (!urls) return EMPTY_LIST

    return (
      urls
        .slice()
        // sort by priority so top priority goes last
        .sort(sortByListPriority)
        .reduce((allTokens, currentUrl) => {
          const current = lists[currentUrl]?.current
          if (!current) return allTokens
          try {
            const newTokens = Object.assign(listToTokenMap(current))
            return combineMaps(allTokens, newTokens)
          } catch (error) {
            console.error("Could not show token list due to error", error)
            return allTokens
          }
        }, EMPTY_LIST)
    )
  }, [lists, urls])
}

// filter out unsupported lists
export function useActiveListUrls(): string[] | undefined {
  return useSelector<AppState, AppState["lists"]["activeListUrls"]>(
    (state) => state.lists.activeListUrls
  )?.filter((url) => !UNSUPPORTED_LIST_URLS.includes(url))
}

export function useInactiveListUrls(): string[] {
  const lists = useAllLists()
  const allActiveListUrls = useActiveListUrls()
  return Object.keys(lists).filter(
    (url) =>
      !allActiveListUrls?.includes(url) && !UNSUPPORTED_LIST_URLS.includes(url)
  )
}

// get all the tokens from active lists, combine with local default tokens
export function useCombinedActiveList(): TokenAddressMap {
  const activeListUrls = useActiveListUrls()
  const activeTokens = useCombinedTokenMapFromUrls(activeListUrls)
  // const defaultTokenMap = listToTokenMap()
  const defaultTokenMap = undefined
  return combineMaps(activeTokens, defaultTokenMap)
}

// all tokens from inactive lists
export function useCombinedInactiveList(): TokenAddressMap {
  const allInactiveListUrls: string[] = useInactiveListUrls()
  return useCombinedTokenMapFromUrls(allInactiveListUrls)
}

// list of tokens not supported on interface, used to show warnings and prevent swaps and adds
export function useUnsupportedTokenList(): TokenAddressMap {
  // get hard coded unsupported tokens
  const localUnsupportedListMap = listToTokenMap(UNSUPPORTED_TOKEN_LIST)

  // get any loaded unsupported tokens
  const loadedUnsupportedListMap = useCombinedTokenMapFromUrls(
    UNSUPPORTED_LIST_URLS
  )

  // format into one token address map
  return combineMaps(localUnsupportedListMap, loadedUnsupportedListMap)
}

export function useIsListActive(url: string): boolean {
  const activeListUrls = useActiveListUrls()
  return Boolean(activeListUrls?.includes(url))
}
