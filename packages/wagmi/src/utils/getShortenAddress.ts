import { getAddress } from 'viem'

export function getShortenAddress(address: string, chars = 4): string {
  const parsed = getAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}