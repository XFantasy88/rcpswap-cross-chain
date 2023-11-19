import React, { useState } from "react"
import { ChainId } from "rcpswap/chain"
import { Type, Token } from "rcpswap/currency"
import styled from "styled-components"
import { TYPE, CloseIcon, StyledInternalLink } from "@/theme"
import Card from "@/components/Card"
import { AutoColumn } from "@/components/Column"
import { RowBetween, RowFixed, AutoRow } from "@/components/Row"
import CurrencyLogo from "@/components/CurrencyLogo"
import { FiArrowLeft, FiAlertTriangle } from "react-icons/fi"
import { transparentize } from "polished"
import useTheme from "@/hooks/useTheme"
import { ButtonPrimary } from "@/components/Button"
import { SectionBreak } from "@/components/swap/styleds"
import { getEtherscanLink } from "@rcpswap/wagmi"
import { useCombinedInactiveList } from "@/state/lists/hooks"
import Logo from "@/components/Logo"
import { PaddedColumn, Checkbox } from "./styleds"
import { useCustomTokens } from "@rcpswap/hooks"

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: auto;
`

const WarningWrapper = styled(Card)<{
  highWarning: boolean
  borderRadius?: string
}>`
  background-color: ${({ theme, highWarning }) =>
    highWarning
      ? transparentize(0.8, theme.red1)
      : transparentize(0.8, theme.yellow2)};
  width: fit-content;
`

const AddressText = styled(TYPE.blue)`
  font-size: 12px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 10px;
`}
`

const StyledLogo = styled(Logo)`
  width: 12px;
`

interface ImportProps {
  tokens: Token[]
  chainId?: ChainId
  onBack?: () => void
  onDismiss?: () => void
  handleCurrencySelect?: (currency: Type) => void
}

export function ImportToken({
  tokens,
  onBack,
  onDismiss,
  handleCurrencySelect,
  chainId,
}: ImportProps) {
  const theme = useTheme()

  const [confirmed, setConfirmed] = useState(false)

  const addToken = useCustomTokens().mutate

  // use for showing import source on inactive tokens
  const inactiveTokenList = useCombinedInactiveList()

  // higher warning severity if either is not on a list
  const fromLists =
    (chainId && inactiveTokenList?.[chainId]?.[tokens[0]?.address]?.list) ||
    (chainId && inactiveTokenList?.[chainId]?.[tokens[1]?.address]?.list)

  return (
    <Wrapper>
      <PaddedColumn gap="14px" style={{ width: "100%", flex: "1 1" }}>
        <RowBetween>
          {onBack ? (
            <FiArrowLeft style={{ cursor: "pointer" }} onClick={onBack} />
          ) : (
            <div></div>
          )}
          <TYPE.mediumHeader>
            Import {tokens.length > 1 ? "Tokens" : "Token"}
          </TYPE.mediumHeader>
          {onDismiss ? <CloseIcon onClick={onDismiss} /> : <div></div>}
        </RowBetween>
      </PaddedColumn>
      <SectionBreak />
      <PaddedColumn gap="md">
        {tokens.map((token) => {
          const list =
            chainId && inactiveTokenList?.[chainId]?.[token.address]?.list
          return (
            <Card
              backgroundColor={theme?.bg2}
              key={"import" + token.address}
              className=".token-warning-container"
            >
              <AutoColumn gap="10px">
                <AutoRow align="center">
                  <CurrencyLogo currency={token} size={24} />
                  <TYPE.body ml="8px" mr="8px" fontWeight={500}>
                    {token.symbol}
                  </TYPE.body>
                  <TYPE.darkGray fontWeight={300}>{token.name}</TYPE.darkGray>
                </AutoRow>
                {chainId && (
                  <StyledInternalLink
                    href={getEtherscanLink(chainId, token.address, "address")}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <AddressText>{token.address}</AddressText>
                  </StyledInternalLink>
                )}
                {list !== undefined ? (
                  <RowFixed>
                    {list.logoURI && (
                      <StyledLogo
                        srcs={[list.logoURI ?? ""]}
                        width={12}
                        height={12}
                        alt="logo"
                      />
                    )}
                    <TYPE.small ml="6px" color={theme?.text3}>
                      via {list.name}
                    </TYPE.small>
                  </RowFixed>
                ) : (
                  <WarningWrapper
                    borderRadius="4px"
                    padding="4px"
                    highWarning={true}
                  >
                    <RowFixed>
                      <FiAlertTriangle stroke={theme?.red1} size="10px" />
                      <TYPE.body
                        color={theme?.red1}
                        ml="4px"
                        fontSize="10px"
                        fontWeight={500}
                      >
                        Unknown Source
                      </TYPE.body>
                    </RowFixed>
                  </WarningWrapper>
                )}
              </AutoColumn>
            </Card>
          )
        })}

        <Card
          style={{
            backgroundColor: fromLists
              ? transparentize(0.8, theme?.yellow2 ?? "")
              : transparentize(0.8, theme?.red1 ?? ""),
          }}
        >
          <AutoColumn
            justify="center"
            style={{ textAlign: "center", gap: "16px", marginBottom: "12px" }}
          >
            <FiAlertTriangle
              stroke={fromLists ? theme?.yellow2 : theme?.red1}
              size={32}
            />
            <TYPE.body
              fontWeight={600}
              fontSize={20}
              color={fromLists ? theme?.yellow2 : theme?.red1}
            >
              Trade at your own risk!
            </TYPE.body>
          </AutoColumn>

          <AutoColumn
            style={{ textAlign: "center", gap: "16px", marginBottom: "12px" }}
          >
            <TYPE.body
              fontWeight={400}
              color={fromLists ? theme?.yellow2 : theme?.red1}
            >
              Anyone can create a token, including creating fake versions of
              existing tokens that claim to represent projects.
            </TYPE.body>
            <TYPE.body
              fontWeight={600}
              color={fromLists ? theme?.yellow2 : theme?.red1}
            >
              If you purchase this token, you may not be able to sell it back.
            </TYPE.body>
          </AutoColumn>
          <AutoRow
            justify="center"
            style={{ cursor: "pointer" }}
            onClick={() => setConfirmed(!confirmed)}
          >
            <Checkbox
              className=".understand-checkbox"
              name="confirmed"
              type="checkbox"
              checked={confirmed}
              onChange={() => setConfirmed(!confirmed)}
            />
            <TYPE.body
              ml="10px"
              fontSize="16px"
              color={fromLists ? theme?.yellow2 : theme?.red1}
              fontWeight={500}
            >
              I understand
            </TYPE.body>
          </AutoRow>
        </Card>
        <ButtonPrimary
          disabled={!confirmed}
          altDisabledStyle={true}
          borderRadius="20px"
          padding="10px 1rem"
          onClick={() => {
            addToken("add", tokens)
            handleCurrencySelect && handleCurrencySelect(tokens[0])
          }}
          className=".token-dismiss-button"
        >
          Import
        </ButtonPrimary>
      </PaddedColumn>
    </Wrapper>
  )
}
