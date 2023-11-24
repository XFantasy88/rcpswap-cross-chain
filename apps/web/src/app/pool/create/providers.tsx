import { DerivedPoolAddStateProvider } from "@/ui/pool/add/derived-pool-add-state-provider"

export default function Providers({ children }: { children: React.ReactNode }) {
  return <DerivedPoolAddStateProvider>{children}</DerivedPoolAddStateProvider>
}
