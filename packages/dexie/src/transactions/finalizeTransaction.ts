import { type SerializableTransactionReceipt } from "./types"

import { db } from "../db"

export const finalizeTransaction = (
  hash: string,
  status: "success" | "failed",
  receipt?: SerializableTransactionReceipt
) => {
  db.transactions
    .where("hash")
    .equals(hash)
    .modify({ receipt, confirmedTime: Date.now(), status })
}
