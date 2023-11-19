import { useLocalStorage } from "./useLocalStorage"

export const useMultihops = (key?: string, defaultValue?: boolean) =>
  useLocalStorage<boolean>(key || "multiHops", defaultValue || true)
