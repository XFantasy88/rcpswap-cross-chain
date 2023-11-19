import { Version } from '@uniswap/token-lists'

export function listVersionLabel(version: Version): string {
  return `v${version.major}.${version.minor}.${version.patch}`
}
