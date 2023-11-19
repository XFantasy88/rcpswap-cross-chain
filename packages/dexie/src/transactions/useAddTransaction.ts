import { useCallback } from "react"
import { addTransaction } from "./addTransaction"

export const useAddTransaction = () => {
  return useCallback(addTransaction, [])
}
