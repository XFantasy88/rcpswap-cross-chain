import PoolAddWidget from "@/ui/pool/add/pool-add-widget"

export default function Page({
  params,
}: {
  params: { currencyIdA: string; currencyIdB: string }
}) {
  return (
    <>
      <PoolAddWidget
        currencyIdA={params.currencyIdA}
        currencyIdB={params.currencyIdB}
      />
    </>
  )
}
