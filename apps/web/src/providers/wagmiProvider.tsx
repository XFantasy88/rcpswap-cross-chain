import { WagmiConfig as _WagmiConfig, wagmiConfig } from "@rcpswap/wagmi"
import { type FC, type ReactNode } from "react"

export const WagmiConfig: FC<{ children: ReactNode }> = ({ children }) => {
  return <_WagmiConfig config={wagmiConfig}>{children}</_WagmiConfig>
}
