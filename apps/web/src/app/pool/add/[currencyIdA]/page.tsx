import PoolAddWidget from "@/ui/pool/add/pool-add-widget"

export default function Page({ params }: { params: { currencyIdA: string } }) {
  return (
    <>
      <PoolAddWidget currencyIdA={params.currencyIdA} />
    </>
  )
}
