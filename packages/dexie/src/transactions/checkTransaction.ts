import { db } from "../db"

export const checkTransaction = (hash: string, blockNumber: number) => {
  db.transactions
    .where("hash")
    .equals(hash)
    .modify({ lastCheckedBlockNumber: blockNumber })
}
