import { Percent } from "rcpswap/math"
import React from "react"
import { warningSeverity } from "@/utils"
import { ErrorText } from "./styleds"

/**
 * Formatted version of price impact text with warning colors
 */

const ONE_BIPS = new Percent(1, 10000n)

export default function FormattedPriceImpact({
  priceImpact,
}: {
  priceImpact?: Percent
}) {
  return (
    <ErrorText
      fontWeight={500}
      fontSize={14}
      severity={warningSeverity(priceImpact)}
    >
      {priceImpact
        ? priceImpact.lessThan(ONE_BIPS)
          ? "<0.01%"
          : `${priceImpact.toFixed(2)}%`
        : "-"}
    </ErrorText>
  )
}
