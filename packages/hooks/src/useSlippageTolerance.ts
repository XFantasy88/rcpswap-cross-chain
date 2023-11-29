import { useLocalStorage } from "./useLocalStorage"

export const INITIAL_ALLOWED_SLIPPAGE = 0.5

export const useSlippageTolerance = (key?: string, defaultValue?: string) =>
  useLocalStorage(key || "swapSlippage", defaultValue || "2")
