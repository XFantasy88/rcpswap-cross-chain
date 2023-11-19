const RCPSWAP_DEFAULT_LIST = 'https://raw.githubusercontent.com/MoonsDusts/rcpswap-tokenlists/main/rcpswap.tokenlist.json'

export const UNSUPPORTED_LIST_URLS: string[] = []

export const DEFAULT_LIST_OF_LISTS: string[] = [
  RCPSWAP_DEFAULT_LIST,
  ...UNSUPPORTED_LIST_URLS
]

export const DEFAULT_ACTIVE_LIST_URLS = [RCPSWAP_DEFAULT_LIST]