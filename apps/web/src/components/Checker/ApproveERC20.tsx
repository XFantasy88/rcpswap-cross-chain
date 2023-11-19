"use client"

import { FC, useEffect, useState } from "react"
import { Amount, Type } from "rcpswap/currency"
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
  const [state, { write }] = useTokenApproval({
    amount,
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
