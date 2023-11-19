"use client"

import { DerivedSwapStateProvider } from "@/ui/swap/derived-swap-state-provider"
import { DerivedSwapTradeStateProvider } from "@/ui/swap/derived-swap-trade-state-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DerivedSwapStateProvider>
      <DerivedSwapTradeStateProvider>{children}</DerivedSwapTradeStateProvider>
    </DerivedSwapStateProvider>
  )
}
