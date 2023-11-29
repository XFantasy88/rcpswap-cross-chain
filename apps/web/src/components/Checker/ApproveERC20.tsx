"use client"

import { FC, useEffect, useMemo, useState } from "react"
import { Amount, Type, tryParseAmount } from "rcpswap/currency"
import { ApprovalState, useTokenApproval } from "@rcpswap/wagmi"
import { Address } from "wagmi"
import { roundupAmount } from "@/utils"

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

  const rounded = roundupAmount(amount)
  const [state, { write }] = useTokenApproval({
    amount: rounded,
    spender: contract,
    enabled,
  })

  useEffect(() => {
    if (state === ApprovalState.PENDING) setApprovalSubmitted(true)
  }, [state])

  const approve = () => {
    alert(rounded?.quotient)
    write?.()
  }

  useEffect(() => {
    setApprovalSubmitted(false)
  }, [amount])

  return children(approvalSubmitted, state, approve)
}

export default ApproveERC20
