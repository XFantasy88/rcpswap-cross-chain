import { ChainId } from "rcpswap/chain"

export interface SerializableTransactionReceipt {
  to: string | null
  from: string
  contractAddress: string | null
  transactionIndex: number
  blockHash: string
  transactionHash: string
  blockNumber: bigint
  status?: string
}

export type Transaction = {
  hash: string
  chainId: ChainId
  summary?: string | undefined
  receipt?: SerializableTransactionReceipt
  lastCheckedBlockNumber?: number
  addedTime: number
  confirmedTime?: number
  from: string
  status?: string
}
