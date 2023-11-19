import { useCallback } from "react"
import { ChainId } from "rcpswap/chain"

import { db } from "../db.js"

export const useClearTransaction = () => {
  return useCallback(async (chainId: ChainId) => {
    return db.transactions.where("chainId").equals(chainId).delete()
  }, [])
}
