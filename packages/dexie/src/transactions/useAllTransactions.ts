import { useLiveQuery } from "dexie-react-hooks"
import { ChainId } from "rcpswap/chain"

import { db } from "../db.js"

export const useAllTransactions = (chainId: ChainId) => {
  return useLiveQuery(async () => {
    const transactions = await db.transactions
      .where("chainId")
      .equals(chainId)
      .sortBy("addedTime")

    return transactions
  }, [chainId])
}
