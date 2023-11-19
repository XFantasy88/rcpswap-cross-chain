import React, { useRef, RefObject, useCallback, useState, useMemo } from "react"
import styled from "styled-components"
import Column from "@/components/Column"
import { PaddedColumn, Separator, SearchInput } from "./styleds"
import Row, { RowBetween, RowFixed } from "@/components/Row"
import {
  TYPE,
  LinkIcon,
  TrashIcon,
  ButtonText,
  StyledInternalLink,
} from "@/theme"

import { ChainId } from "rcpswap/chain"
import { Token } from "rcpswap/currency"
import CurrencyLogo from "@/components/CurrencyLogo"
import { getEtherscanLink, isAddress, useTokenWithCache } from "@rcpswap/wagmi"
import Card from "@/components/Card"
import ImportRow from "./ImportRow"
import useTheme from "@/hooks/useTheme"

import { CurrencyModalView } from "./CurrencySearchModal"
import { useCustomTokens } from "@rcpswap/hooks"

const Wrapper = styled.div`
  width: 100%;
  height: calc(100% - 60px);
  position: relative;
  padding-bottom: 60px;
`

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  border-radius: 20px;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  border-top: 1px solid ${({ theme }) => theme.bg3};
  padding: 20px;
  text-align: center;
`

export default function ManageTokens({
  setModalView,
  setImportToken,
  chainId,
}: {
  setModalView: (view: CurrencyModalView) => void
  setImportToken: (token: Token) => void
  chainId?: ChainId
}) {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const theme = useTheme()

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const input = event.target.value
      const checksummedInput = isAddress(input)
      setSearchQuery(checksummedInput || input)
    },
    []
  )

  // if they input an address, use it
  const isAddressSearch = isAddress(searchQuery)
  const { data: searchToken } = useTokenWithCache({
    chainId: chainId,
    address: searchQuery,
  })

  // all tokens for local lisr
  const { data: addedTokenMap, mutate: removeToken } = useCustomTokens()

  const userAddedTokens = addedTokenMap ? Object.values(addedTokenMap) : []

  const handleRemoveAll = useCallback(() => {
    if (chainId && userAddedTokens) {
      return removeToken("remove", userAddedTokens)
    }
  }, [removeToken, userAddedTokens, chainId])

  const tokenList = useMemo(() => {
    return (
      chainId &&
      userAddedTokens.map((token) => (
        <RowBetween key={token.address} width="100%">
          <RowFixed>
            <CurrencyLogo currency={token} size={20} />
            <StyledInternalLink
              href={getEtherscanLink(chainId, token.address, "address")}
              target="_blank"
              rel="noreferrer"
            >
              <TYPE.main ml={"10px"} fontWeight={600}>
                {token.symbol}
              </TYPE.main>
            </StyledInternalLink>
          </RowFixed>
          <RowFixed>
            <TrashIcon onClick={() => removeToken("remove", [token])} />
            <StyledInternalLink
              href={getEtherscanLink(chainId, token.address, "address")}
              target="_blank"
              rel="noreferrer"
            >
              <LinkIcon />
            </StyledInternalLink>
          </RowFixed>
        </RowBetween>
      ))
    )
  }, [userAddedTokens, chainId, removeToken])

  return (
    <Wrapper>
      <Column style={{ width: "100%", flex: "1 1" }}>
        <PaddedColumn gap="14px">
          <Row>
            <SearchInput
              type="text"
              id="token-search-input"
              placeholder={"0x0000"}
              value={searchQuery}
              autoComplete="off"
              ref={inputRef as RefObject<HTMLInputElement>}
              onChange={handleInput}
            />
          </Row>
          {searchQuery !== "" && !isAddressSearch && (
            <TYPE.error error={true}>Enter valid token address</TYPE.error>
          )}
          {searchToken && (
            <Card backgroundColor={theme?.bg2} padding="10px 0">
              <ImportRow
                token={searchToken}
                showImportView={() =>
                  setModalView(CurrencyModalView.importToken)
                }
                setImportToken={setImportToken}
                style={{ height: "fit-content" }}
              />
            </Card>
          )}
        </PaddedColumn>
        <Separator />
        <PaddedColumn gap="lg">
          <RowBetween>
            <TYPE.main fontWeight={600}>
              {userAddedTokens?.length} Custom{" "}
              {userAddedTokens.length === 1 ? "Token" : "Tokens"}
            </TYPE.main>
            {userAddedTokens.length > 0 && (
              <ButtonText onClick={handleRemoveAll}>
                <TYPE.blue>Clear all</TYPE.blue>
              </ButtonText>
            )}
          </RowBetween>
          {tokenList}
        </PaddedColumn>
      </Column>
      <Footer>
        <TYPE.darkGray>
          Tip: Custom tokens are stored locally in your browser
        </TYPE.darkGray>
      </Footer>
    </Wrapper>
  )
}
