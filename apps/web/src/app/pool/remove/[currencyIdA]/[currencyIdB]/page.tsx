import PoolRemoveWidget from "@/ui/pool/remove/pool-remove-widget"

export default function Page({
  params,
}: {
  params: { currencyIdA: string; currencyIdB: string }
}) {
  return (
    <>
      <PoolRemoveWidget
        currencyIdA={params.currencyIdA}
        currencyIdB={params.currencyIdB}
      />
    </>
  )
}
