import { UseTradeReturn } from "@rcpswap/router"
import { Amount, Type } from "rcpswap/currency"
import { Fraction, ONE_HUNDRED_PERCENT, Percent } from "rcpswap/math"

const BASE_FEE = new Percent(30, 10000)
const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(BASE_FEE)

export function computeRealizedLPFee(
  trade?: UseTradeReturn | null
): Amount<Type> | undefined | null {
  // for each hop in our trade, take away the x*y=k price impact from 0.3% fees
  // e.g. for 3 tokens/2 hops: 1 - ((1 - .03) * (1-.03))
  const realizedLPFee = !trade
    ? undefined
    : ONE_HUNDRED_PERCENT.subtract(
        trade.route.legs.reduce<Fraction>(
          (currentFee: Fraction): Fraction =>
            currentFee.multiply(INPUT_FRACTION_AFTER_FEE),
          ONE_HUNDRED_PERCENT
        )
      )

  return (
    realizedLPFee &&
    trade &&
    trade.amountIn &&
    trade.amountIn?.multiply(realizedLPFee)
  )
}
