import { ChainId } from "rcpswap/chain";
import { config } from '@rcpswap/viem-config'

export const getExplorerName = (chainId?: ChainId) => {
  return chainId && config[chainId].chain?.blockExplorers?.etherscan?.name
}