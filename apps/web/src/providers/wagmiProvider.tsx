import {
  WagmiConfig as _WagmiConfig,
  createProductionConfig,
} from "@rcpswap/wagmi"
import { type FC, type ReactNode, useMemo } from "react"

export const WagmiConfig: FC<{ children: ReactNode }> = ({ children }) => {
  const config = useMemo(() => createProductionConfig(), [])
  return <_WagmiConfig config={config}>{children}</_WagmiConfig>
}
