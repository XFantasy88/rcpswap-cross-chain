import { Amount, Type, tryParseAmount } from "rcpswap/currency"
import BigNumber from "bignumber.js"

export const roundupAmount = (amount: Amount<Type> | undefined) => {
  if (!amount) return undefined
  // const parsedAmount = new BigNumber(amount.toExact())
  const roundedAmount = parseFloat(amount.toExact())
    .toLocaleString("en", {
      maximumFractionDigits: 7,
      //@ts-ignore
      roundingMode: "ceil",
    })
    .replaceAll(",", "")
  return tryParseAmount(roundedAmount, amount.currency)
}
