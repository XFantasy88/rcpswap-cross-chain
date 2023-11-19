import { ChainId } from "rcpswap/chain"

import { db } from "../db"

export const addTransaction = (
  account: string,
  chainId: ChainId,
  hash: string,
  summary?: string
) => {
  db.transactions.put({
    hash,
    from: account,
    chainId,
    addedTime: Date.now(),
    summary: summary,
  })
}
