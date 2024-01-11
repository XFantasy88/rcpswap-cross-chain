"use client"

import { FC, useEffect, useMemo, useState } from "react"
import { Amount, Type, tryParseAmount } from "rcpswap/currency"
import { ApprovalState, useTokenApproval } from "@rcpswap/wagmi"
import { Address } from "wagmi"
import { Fraction } from "rcpswap"

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

  const [state] = useTokenApproval({
    amount: amount,
    spender: contract,
    enabled,
    // approveMax: true,
  })

  const [_, { write }] = useTokenApproval({
    amount: amount?.multiply(new Fraction(101, 100)),
    spender: contract,
    enabled,
    // approveMax: true,
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
