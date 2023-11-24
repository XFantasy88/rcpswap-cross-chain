import React from "react"
import { Text } from "rebass"
import { ChainId } from "rcpswap/chain"
import { Type, Token } from "rcpswap/currency"
import styled from "styled-components"

import { SUGGESTED_TOKEN_BASES } from "rcpswap"
import { AutoColumn } from "../Column"
import QuestionHelper from "../QuestionHelper"
import { AutoRow } from "../Row"
import CurrencyLogo from "../CurrencyLogo"
import { defaultQuoteCurrency } from "rcpswap/currency"

const BaseWrapper = styled.div<{ disable?: boolean }>`
  border: 1px solid
    ${({ theme, disable }) => (disable ? "transparent" : theme.bg3)};
  border-radius: 10px;
  display: flex;
  padding: 6px;

  align-items: center;
  &:hover {
    cursor: ${({ disable }) => !disable && "pointer"};
    background-color: ${({ theme, disable }) => !disable && theme.bg2};
  }

  background-color: ${({ theme, disable }) => disable && theme.bg3};
  opacity: ${({ disable }) => disable && "0.4"};
`

export default function CommonBases({
  chainId,
  onSelect,
  selectedCurrency,
}: {
  chainId?: ChainId
  selectedCurrency?: Type | null
  onSelect: (currency: Type) => void
}) {
  const baseCurrency = chainId ? defaultQuoteCurrency[chainId] : undefined
  return (
    <AutoColumn gap="md">
      <AutoRow>
        <Text fontWeight={500} fontSize={14}>
          Common bases
        </Text>
        <QuestionHelper
          id="common-bases"
          content="These tokens are commonly paired with other tokens."
        />
      </AutoRow>
      <AutoRow gap="4px">
        <BaseWrapper
          onClick={() => {
            if (
              baseCurrency &&
              (!selectedCurrency || !selectedCurrency.equals(baseCurrency))
            ) {
              onSelect(baseCurrency)
            }
          }}
          disable={selectedCurrency === baseCurrency}
        >
          <CurrencyLogo currency={baseCurrency} style={{ marginRight: 8 }} />
          <Text fontWeight={500} fontSize={16}>
            {baseCurrency?.symbol}
          </Text>
        </BaseWrapper>
        {(chainId ? SUGGESTED_TOKEN_BASES[chainId] : []).map((token: Token) => {
          const selected =
            selectedCurrency instanceof Token &&
            selectedCurrency.address === token.address
          return (
            <BaseWrapper
              onClick={() => !selected && onSelect(token)}
              disable={selected}
              key={token.address}
            >
              <CurrencyLogo currency={token} style={{ marginRight: 8 }} />
              <Text fontWeight={500} fontSize={16}>
                {token.symbol}
              </Text>
            </BaseWrapper>
          )
        })}
      </AutoRow>
    </AutoColumn>
  )
}
