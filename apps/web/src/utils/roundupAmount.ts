import { Amount, Type, tryParseAmount } from "rcpswap/currency"
import BigNumber from "bignumber.js"

export const roundupAmount = (amount: Amount<Type> | undefined) => {
  if (!amount) return undefined
  const parsedAmount = new BigNumber(amount.toExact())
  const roundedAmount = parsedAmount.toFixed(12, 0)
  console.log(amount.toExact(), roundedAmount)
  return tryParseAmount(roundedAmount, amount.currency)
}
