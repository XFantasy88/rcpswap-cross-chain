"use client"

import { FC, useMemo } from "react"
import { useAccount } from "wagmi"
import { Amount, Type } from "rcpswap/currency"
import { ChainId } from "rcpswap/chain"
import { useBalancesWeb3 } from "@rcpswap/wagmi"
import { zeroAddress } from "viem"
import { ButtonError } from "../Button"
import { Text } from "rebass"
import { ZERO } from "rcpswap"

interface CheckerProps {
  chainId: ChainId | undefined
  amounts: (Amount<Type> | undefined)[]
  children: React.ReactNode
}

const Amounts: FC<CheckerProps> = ({ chainId, amounts, children }) => {
  const { address } = useAccount()
  const amountsAreDefined = useMemo(
    () => amounts.every((el) => el?.greaterThan(ZERO)),
    [amounts]
  )
  const currencies = useMemo(
    () => amounts.map((amount) => amount?.currency),
    [amounts]
  )

  const { data: balances } = useBalancesWeb3({
    currencies,
    chainId,
    account: address,
    enabled: amountsAreDefined,
  })

  const insufficientBalance = useMemo(() => {
    return amounts?.find((amount) => {
      if (!amount) return false
      return (
        !balances ||
        balances?.[
          amount.currency.isNative
            ? zeroAddress
            : amount.currency.wrapped.address
        ]?.lessThan(amount)
      )
    })
  }, [amounts, balances])

  if (!amountsAreDefined) {
    return (
      <ButtonError disabled>
        <Text fontSize={20} fontWeight={500}>
          Enter amount
        </Text>
      </ButtonError>
    )
  }

  if (insufficientBalance) {
    return (
      <ButtonError disabled>
        <Text fontSize={20} fontWeight={500}>
          {`Insufficient ${insufficientBalance.currency.symbol} balance`}
        </Text>
      </ButtonError>
    )
  }

  return <>{children}</>
}

export default Amounts
