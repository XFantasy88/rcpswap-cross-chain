"use client"

import { FC, useEffect, useMemo, useState } from "react"
import { Amount, Type, tryParseAmount } from "rcpswap/currency"
import { ApprovalState, useTokenApproval } from "@rcpswap/wagmi"
import { Address } from "wagmi"

interface CheckerProps {
  amount: Amount<Type> | undefined
  contract: Address | undefined
  enabled?: boolean
  children: (
    approvalSubmitted: boolean,
    approvalState: ApprovalState,
    approve: (() => void) | undefined
  ) => React.ReactNode
}

const ApproveERC20: FC<CheckerProps> = ({
  amount,
  contract,
  enabled,
  children,
}) => {
  const [approvalSubmitted, setApprovalSubmitted] = useState(false)
  const parsedAmount = useMemo(
    () =>
      tryParseAmount(
        amount
          ? parseFloat(amount.toExact()).toLocaleString("en", {
              maximumFractionDigits: 12,
              // @ts-ignore
              roundingMode: "ceil",
            })
          : undefined,
        amount?.currency
      ),
    [amount]
  )

  const [state, { write }] = useTokenApproval({
    amount: parsedAmount,
    spender: contract,
    enabled,
  })

  useEffect(() => {
    if (state === ApprovalState.PENDING) setApprovalSubmitted(true)
  }, [state])

  useEffect(() => {
    setApprovalSubmitted(false)
  }, [amount])

  return children(approvalSubmitted, state, write)
}

export default ApproveERC20
