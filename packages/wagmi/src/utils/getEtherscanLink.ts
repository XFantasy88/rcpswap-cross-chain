import { ChainId } from "rcpswap/chain";
import { config } from '@rcpswap/viem-config'

export const getEtherscanLink = (chainId: ChainId, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
  const etherscan = config[chainId].chain?.blockExplorers?.etherscan?.url

  switch (type) {
    case 'transaction':
      return `${etherscan}/tx/${data}`
    case 'token':
      return `${etherscan}/token/${data}`
    case 'block':
      return `${etherscan}/block/${data}`
    case 'address':
    default:
      return `${etherscan}/address/${data}`
  }
}