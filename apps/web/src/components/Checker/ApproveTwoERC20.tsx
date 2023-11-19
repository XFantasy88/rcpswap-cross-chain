"use client"

import { FC, useEffect, useState } from "react"
import { Amount, Type } from "rcpswap/currency"
import { ApprovalState, useTokenApproval } from "@rcpswap/wagmi"
import { Address, useToken } from "wagmi"
import { AutoColumn } from "../Column"
import { RowBetween } from "../Row"
import { ButtonPrimary } from "../Button"
import { Dots } from "../swap/styleds"

interface CheckerProps {
  amounts: (Amount<Type> | undefined)[]
  contract: Address | undefined
  enabled?: boolean
  children: (disabled: boolean) => React.ReactNode
}

const ApproveERC20: FC<CheckerProps> = ({
  amounts,
  contract,
  enabled,
  children,
}) => {
  const [stateA, { write: writeA }] = useTokenApproval({
    amount: amounts?.[0],
    spender: contract,
    enabled,
  })

  const [stateB, { write: writeB }] = useTokenApproval({
    amount: amounts?.[1],
    spender: contract,
    enabled,
  })

  return (
    <AutoColumn gap={"md"}>
      {(stateA === ApprovalState.NOT_APPROVED ||
        stateA === ApprovalState.PENDING ||
        stateB === ApprovalState.NOT_APPROVED ||
        stateB === ApprovalState.PENDING) && (
        <RowBetween>
          {stateA !== ApprovalState.APPROVED && (
            <ButtonPrimary
              onClick={() => writeA?.()}
              disabled={stateA === ApprovalState.PENDING}
              width={stateB !== ApprovalState.APPROVED ? "48%" : "100%"}
            >
              {stateA === ApprovalState.PENDING ? (
                <Dots>Approving {amounts[0]?.currency?.symbol}</Dots>
              ) : (
                "Approve " + amounts[0]?.currency?.symbol
              )}
            </ButtonPrimary>
          )}
          {stateB !== ApprovalState.APPROVED && (
            <ButtonPrimary
              onClick={() => writeB?.()}
              disabled={stateB === ApprovalState.PENDING}
              width={stateA !== ApprovalState.APPROVED ? "48%" : "100%"}
            >
              {stateB === ApprovalState.PENDING ? (
                <Dots>Approving {amounts[1]?.currency?.symbol}</Dots>
              ) : (
                "Approve " + amounts[1]?.currency?.symbol
              )}
            </ButtonPrimary>
          )}
        </RowBetween>
      )}
      {children(
        stateA !== ApprovalState.APPROVED || stateB !== ApprovalState.APPROVED
      )}
    </AutoColumn>
  )
}

export default ApproveERC20
