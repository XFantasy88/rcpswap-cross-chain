"use client"

import { FC } from "react"
import { Type } from "rcpswap/currency"
import { ButtonError } from "../Button"
import { Text } from "rebass"

interface CheckerProps {
  tokens: (Type | undefined)[]
  children: React.ReactNode
}

const Tokens: FC<CheckerProps> = ({ tokens, children }) => {
  const unselected = tokens.findIndex((token) => token === undefined)

  if (unselected >= 0) {
    return (
      <ButtonError disabled>
        <Text fontSize={20} fontWeight={500}>
          {`Select a token`}
        </Text>
      </ButtonError>
    )
  }

  return <>{children}</>
}

export default Tokens
