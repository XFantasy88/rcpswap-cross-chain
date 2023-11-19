import { useLocalStorage } from './useLocalStorage'

export const useTransactionTTL = (key?: string, defaultValue?: number) =>
  useLocalStorage(key || 'transactionTTL', defaultValue || 1200)
