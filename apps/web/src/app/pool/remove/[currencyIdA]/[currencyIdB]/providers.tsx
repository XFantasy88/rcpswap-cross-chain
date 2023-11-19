import { DerivedPoolRemoveStateProvider } from "@/ui/pool/remove/derived-pool-remove-state-provider"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DerivedPoolRemoveStateProvider>{children}</DerivedPoolRemoveStateProvider>
  )
}
