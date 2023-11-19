import { ChainId } from "rcpswap/chain"
import { Type, Token, Amount, defaultQuoteCurrency } from "rcpswap/currency"
import React, {
  CSSProperties,
  MutableRefObject,
  useCallback,
  useMemo,
} from "react"
import { FixedSizeList } from "react-window"
import { Text } from "rebass"
import styled from "styled-components"
import { useCombinedActiveList } from "@/state/lists/hooks"
import { WrappedTokenInfo } from "rcpswap"
import { useAccount, useBalanceWeb3 } from "@rcpswap/wagmi"
import { TYPE } from "@/theme"
import { useCustomTokens } from "@rcpswap/hooks"
import Column from "../Column"
import { RowFixed, RowBetween } from "../Row"
import CurrencyLogo from "../CurrencyLogo"
import { MouseoverTooltip } from "../Tooltip"
import { MenuItem } from "./styleds"
import Loader from "../Loader"
import { isTokenOnList } from "@/utils"
import ImportRow from "./ImportRow"
import { LightGreyCard } from "@/components/Card"
import TokenListLogo from "@/assets/images/tokenlist.svg"
import QuestionHelper from "@/components/QuestionHelper"
import useTheme from "@/hooks/useTheme"
import { useAllInactiveTokens } from "@/hooks/Tokens"
import Image from "next/image"

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`

const Tag = styled.div`
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text2};
  font-size: 14px;
  border-radius: 4px;
  padding: 0.25rem 0.3rem 0.25rem 0.3rem;
  max-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  justify-self: flex-end;
  margin-right: 4px;
`

const FixedContentRow = styled.div`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-gap: 16px;
  align-items: center;
`

const TagContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

const TokenListLogoWrapper = styled(Image)`
  height: 20px;
`

function currencyKey(currency: Type): string {
  return currency instanceof Token || currency instanceof WrappedTokenInfo
    ? currency.address
    : currency.isNative
    ? currency.symbol
    : ""
}

function Balance({ balance }: { balance: Amount<Type> }) {
  return (
    <StyledBalanceText title={balance.toExact()}>
      {balance.toSignificant(4)}
    </StyledBalanceText>
  )
}

function TokenTags({ currency }: { currency: Type }) {
  if (!(currency instanceof WrappedTokenInfo)) {
    return <span />
  }

  const tags = currency.tags
  if (!tags || tags.length === 0) return <span />

  const tag = tags[0]

  return (
    <TagContainer>
      <MouseoverTooltip text={tag.description}>
        <Tag key={tag.id}>{tag.name}</Tag>
      </MouseoverTooltip>
      {tags.length > 1 ? (
        <MouseoverTooltip
          text={tags
            .slice(1)
            .map(({ name, description }) => `${name}: ${description}`)
            .join("; \n")}
        >
          <Tag>...</Tag>
        </MouseoverTooltip>
      ) : null}
    </TagContainer>
  )
}

function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
  chainId,
}: {
  currency: Type
  onSelect: () => void
  isSelected: boolean
  otherSelected: boolean
  style: CSSProperties
  chainId?: ChainId
}) {
  const { address } = useAccount()
  const key = currencyKey(currency)
  const selectedTokenList = useCombinedActiveList()
  const isOnSelectedList = isTokenOnList(selectedTokenList, currency)
  const customAdded = useCustomTokens().hasToken(currency.wrapped)
  const { data: balance } = useBalanceWeb3({
    chainId,
    currency,
    account: address,
  })

  // only show add or remove buttons if not on selected list
  return (
    <MenuItem
      style={style}
      className={`token-item-${key}`}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
    >
      <CurrencyLogo currency={currency} size={24} />
      <Column>
        <Text title={currency.name} fontWeight={500}>
          {currency.symbol}
        </Text>
        <TYPE.darkGray ml="0px" fontSize={"12px"} fontWeight={300}>
          {currency.name}{" "}
          {!isOnSelectedList && customAdded && "• Added by user"}
        </TYPE.darkGray>
      </Column>
      <TokenTags currency={currency} />
      <RowFixed style={{ justifySelf: "flex-end" }}>
        {balance ? <Balance balance={balance} /> : address ? <Loader /> : null}
      </RowFixed>
    </MenuItem>
  )
}

export default function CurrencyList({
  height,
  currencies,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showETH,
  showImportView,
  setImportToken,
  breakIndex,
  chainId = ChainId.ARBITRUM_NOVA,
}: {
  height: number
  currencies: Type[]
  selectedCurrency?: Type | null
  onCurrencySelect: (currency: Type) => void
  otherCurrency?: Type | null
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showETH: boolean
  showImportView: () => void
  setImportToken: (token: Token) => void
  breakIndex: number | undefined
  chainId?: ChainId
}) {
  const baseCurrency = defaultQuoteCurrency[chainId]

  const itemData: (Type | undefined)[] = useMemo(() => {
    let formatted: (Type | undefined)[] = showETH
      ? [baseCurrency, ...currencies]
      : currencies
    if (breakIndex !== undefined) {
      formatted = [
        ...formatted.slice(0, breakIndex),
        undefined,
        ...formatted.slice(breakIndex, formatted.length),
      ]
    }
    return formatted
  }, [breakIndex, baseCurrency, currencies, showETH])

  const theme = useTheme()

  const inactiveTokens: {
    [address: string]: Token
  } = useAllInactiveTokens()

  const Row = useCallback(
    ({
      data,
      index,
      style,
    }: {
      data: (Type | undefined)[]
      index: number
      style: CSSProperties
    }) => {
      const currency: Type | undefined = data[index]
      if (!currency) return
      const isSelected = Boolean(
        selectedCurrency && selectedCurrency.equals(currency)
      )
      const otherSelected = Boolean(
        otherCurrency && otherCurrency.equals(currency)
      )
      const handleSelect = () => {
        onCurrencySelect(currency)
      }

      const token = currency.wrapped
      const showImport =
        inactiveTokens &&
        token &&
        Object.keys(inactiveTokens).includes(token.address)

      if (index === breakIndex || !data) {
        return (
          <FixedContentRow style={style}>
            <LightGreyCard padding="8px 12px" borderRadius="8px">
              <RowBetween>
                <RowFixed>
                  <TokenListLogoWrapper
                    src={TokenListLogo.src}
                    width={TokenListLogo.width}
                    height={TokenListLogo.height}
                    alt="tokenlist"
                  />
                  <TYPE.main ml="6px" fontSize="12px" color={theme?.text1}>
                    Expanded results from inactive Token Lists
                  </TYPE.main>
                </RowFixed>
                <QuestionHelper text="Tokens from inactive lists. Import specific tokens below or click 'Manage' to activate more lists." />
              </RowBetween>
            </LightGreyCard>
          </FixedContentRow>
        )
      }

      if (showImport && token) {
        return (
          <ImportRow
            style={style}
            token={token}
            showImportView={showImportView}
            setImportToken={setImportToken}
            dim={true}
          />
        )
      } else {
        return (
          <CurrencyRow
            style={style}
            currency={currency}
            isSelected={isSelected}
            onSelect={handleSelect}
            otherSelected={otherSelected}
            chainId={chainId}
          />
        )
      }
    },
    [
      inactiveTokens,
      onCurrencySelect,
      otherCurrency,
      selectedCurrency,
      setImportToken,
      showImportView,
      breakIndex,
      theme?.text1,
    ]
  )

  const itemKey = useCallback(
    (index: number, data: any) => currencyKey(data[index]),
    []
  )

  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={56}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  )
}
