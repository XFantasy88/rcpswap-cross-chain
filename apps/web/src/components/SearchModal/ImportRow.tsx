import React, { CSSProperties } from "react"
import { Token } from "rcpswap/currency"
import { AutoRow, RowFixed } from "@/components/Row"
import { AutoColumn } from "@/components/Column"
import CurrencyLogo from "@/components/CurrencyLogo"
import { TYPE } from "@/theme"

import useTheme from "@/hooks/useTheme"
import { ButtonPrimary } from "@/components/Button"
import styled from "styled-components"
import { FiCheckCircle } from "react-icons/fi"
import { useCustomTokens } from "@rcpswap/hooks"
import { ChainId } from "rcpswap/chain"
import { useIsTokenActive } from "@/hooks/Tokens"

const TokenSection = styled.div<{ dim?: boolean }>`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto;
  grid-gap: 16px;
  align-items: center;

  opacity: ${({ dim }) => (dim ? "0.4" : "1")};
`

const CheckIcon = styled(FiCheckCircle)`
  height: 16px;
  width: 16px;
  margin-right: 6px;
  stroke: ${({ theme }) => theme.green1};
`

const NameOverflow = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
  font-size: 12px;
`

export default function ImportRow({
  token,
  style,
  dim,
  showImportView,
  setImportToken,
  chainId = ChainId.ARBITRUM_NOVA,
}: {
  token: Token
  chainId?: ChainId
  style?: CSSProperties
  dim?: boolean
  showImportView: () => void
  setImportToken: (token: Token) => void
}) {
  // const chainId = ChainId.ARBITRUM_NOVA
  const theme = useTheme()

  // check if already active on list or local storage tokens
  const { data: customTokenMap } = useCustomTokens()

  const isAdded = customTokenMap
    ? Object.values(customTokenMap).find((item) => item.equals(token))
    : false

  const isActive = useIsTokenActive(token, chainId)

  return (
    <TokenSection style={style}>
      <CurrencyLogo
        currency={token}
        size={24}
        style={{ opacity: dim ? "0.6" : "1" }}
      />
      <AutoColumn gap="4px" style={{ opacity: dim ? "0.6" : "1" }}>
        <AutoRow>
          <TYPE.body fontWeight={500}>{token.symbol}</TYPE.body>
          <TYPE.darkGray ml="8px" fontWeight={300}>
            <NameOverflow title={token.name}>{token.name}</NameOverflow>
          </TYPE.darkGray>
        </AutoRow>
      </AutoColumn>
      {!isActive && !isAdded ? (
        <ButtonPrimary
          width="fit-content"
          padding="6px 12px"
          fontWeight={500}
          fontSize="14px"
          onClick={() => {
            setImportToken && setImportToken(token)
            showImportView()
          }}
        >
          Import
        </ButtonPrimary>
      ) : (
        <RowFixed style={{ minWidth: "fit-content" }}>
          <CheckIcon />
          <TYPE.main color={theme?.green1}>Active</TYPE.main>
        </RowFixed>
      )}
    </TokenSection>
  )
}
