import { db } from "../db"

export const useIsTransactionPending = async (hash: string) => {
  const tx = (await db.transactions.where("hash").equals(hash).toArray())?.[0]

  return tx ? false : !tx
}
