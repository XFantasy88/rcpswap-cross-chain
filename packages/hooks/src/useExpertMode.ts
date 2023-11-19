import { useLocalStorage } from "./useLocalStorage"

export const useExpertMode = (key?: string, defaultValue?: boolean) =>
  useLocalStorage<boolean>(key || "expertMode", defaultValue || false)
