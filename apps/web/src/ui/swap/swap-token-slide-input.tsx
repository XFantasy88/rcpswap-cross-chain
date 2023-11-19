"use client"

import StepSlider from "@/components/StepSlider"
import { useDerivedSwapState } from "@/ui/swap/derived-swap-state-provider"
import { useAccount, useBalanceWeb3 } from "@rcpswap/wagmi"
import { tryParseAmount } from "rcpswap/currency"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

export default function SwapTokenSlideInput() {
  const { address } = useAccount()

  const slideTimerRef = useRef<number | null>(null)

  const {
    state: { token0, chainId0, swapSlidePercentage, swapAmount },
    mutate: { setSwapAmount, setSwapSlidePercentage },
  } = useDerivedSwapState()

  const { data: maxAmountInput } = useBalanceWeb3({
    account: address,
    currency: token0,
    chainId: chainId0,
  })

  const parsedAmount = useMemo(
    () => tryParseAmount(swapAmount, token0),
    [token0, swapAmount]
  )

  useEffect(() => {
    if (maxAmountInput) {
      if (maxAmountInput.equalTo("0")) {
        setSwapSlidePercentage(0)
      } else {
        const percenage =
          parseFloat(parsedAmount?.toExact() ?? "0") /
          parseFloat(maxAmountInput.toExact())
        setSwapSlidePercentage(Math.min(Math.floor(percenage * 100), 100))
      }
    }
  }, [maxAmountInput?.toExact(), parsedAmount])

  const onChange = useCallback(
    (step: number) => {
      setSwapSlidePercentage(step)

      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current)
        slideTimerRef.current = null
      }

      if (maxAmountInput) {
        const particalAmount = maxAmountInput.multiply(step).divide(100)

        setSwapAmount(particalAmount.toExact())
      }
    },
    [maxAmountInput?.toExact(), setSwapAmount]
  )

  return (
    <StepSlider
      step={swapSlidePercentage}
      onChange={onChange}
      enabled={Boolean(maxAmountInput)}
    />
  )
}
