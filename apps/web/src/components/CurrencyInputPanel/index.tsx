"use client"

import { ChainId } from "rcpswap/chain"
import { Amount, Type, tryParseAmount } from "rcpswap/currency"
import { Fraction, ZERO } from "rcpswap/math"
import { Pool } from "@rcpswap/v2-sdk"
import { useAccount, useBalanceWeb3 } from "@rcpswap/wagmi"

import React, { useState, useCallback, useMemo } from "react"
import styled from "styled-components"
import { darken } from "polished"
import { FiChevronDown } from "react-icons/fi"

import CurrencySearchModal from "@/components/SearchModal/CurrencySearchModal"
import CurrencyLogo from "@/components/CurrencyLogo"
import DoubleCurrencyLogo from "@/components/DoubleLogo"
import { RowBetween } from "@/components/Row"
import { TYPE } from "@/theme"
import { Input as NumericalInput } from "@/components/NumericalInput"
import NetworkSelector from "@/components/NetworkSelector"

import useTheme from "@/hooks/useTheme"
import { usePrice } from "@rcpswap/react-query"

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) =>
    selected ? "0.75rem 0.5rem 0.75rem 1rem" : "0.75rem 0.75rem 0.75rem 1rem"};
`

const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 2.2rem;
  font-size: 20px;
  font-weight: 500;
  background-color: ${({ selected, theme }) =>
    selected ? theme.bg1 : theme.primary1};
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
  border-radius: 12px;
  box-shadow: ${({ selected }) =>
    selected ? "none" : "0px 6px 10px rgba(0, 0, 0, 0.075)"};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;

  &:focus,
  &:hover {
    background-color: ${({ selected, theme }) =>
      selected ? theme.bg2 : darken(0.05, theme.primary1)};
  }
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`

const NetworkRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  justify-content: end;
  padding: 0.75rem 1rem 0 1rem;
`

const PriceRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  color: ${({ theme }) => theme.text3};
  font-size: 0.75rem;
  padding: 0 0.75rem 0.75rem 1rem;
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledDropDown = styled(FiChevronDown)<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;
  stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};

  path {
    stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
    stroke-width: 1.5px;
  }
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? "8px" : "20px")};
  background-color: ${({ theme }) => theme.bg2};
  z-index: 2;
`

const Container = styled.div<{ hideInput: boolean; inactive?: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? "8px" : "20px")};
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme, inactive }) =>
    inactive ? theme.bg1 : theme.bg1};
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) =>
    active
      ? "  margin: 0 0.25rem 0 0.75rem;"
      : "  margin: 0 0.25rem 0 0.25rem;"}
  font-size:  ${({ active }) => (active ? "20px" : "16px")};
`

const PriceImpact = styled.span<{ impact: number }>`
  color: ${({ impact, theme }) =>
    impact <= -5 ? "#e61537" : impact <= -2 ? "#f7c40c" : theme.green1};
`

const StyledBalanceMax = styled.button`
  height: 28px;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: 0.5rem;
  font-size: 0.875rem;

  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.primaryText1};
  &:hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  &:focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton?: boolean
  label?: string
  onCurrencySelect?: (currency: Type) => void
  currency?: Type | null
  onChainSelect?: (chain: ChainId) => void
  chainId?: ChainId | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  hideChain?: boolean
  pair?: Pool | null
  hideInput?: boolean
  otherCurrency?: Type | null
  otherAmount?: string
  id: string
  showCommonBases?: boolean
  customBalanceText?: string
  inactive?: boolean
  showPriceImpact?: boolean
  loading?: boolean
  fee?: Amount<Type>
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = "Input",
  onCurrencySelect,
  currency,
  onChainSelect,
  chainId,
  disableCurrencySelect = false,
  hideBalance = false,
  hideChain = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  otherAmount,
  id,
  showCommonBases,
  customBalanceText,
  inactive = false,
  showPriceImpact = false,
  loading = false,
  fee,
}: CurrencyInputPanelProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const { address } = useAccount()

  const { data: selectedCurrencyBalance } = useBalanceWeb3({
    chainId: chainId ?? ChainId.ARBITRUM_NOVA,
    account: address,
    currency: currency ?? undefined,
  })

  const theme = useTheme()

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  const onChange = useCallback(
    (nextValue: string) => {
      const [integer, decimals] = nextValue.split(".")
      if (decimals && decimals.length > (currency?.decimals ?? 18)) {
        nextValue = `${integer}.${decimals.slice(0, currency?.decimals ?? 18)}`
      }
      onUserInput(nextValue)
    },
    [onUserInput, value, currency]
  )

  const { data: price, isInitialLoading: isPriceLoading } = usePrice({
    chainId: currency?.chainId,
    address: currency?.wrapped?.address,
  })

  const parsedValue = useMemo(
    () => tryParseAmount(value, currency ?? undefined),
    [currency, value]
  )

  const totalPrice =
    parsedValue && price ? parsedValue.multiply(price) : undefined

  const { data: otherPrice, isInitialLoading: isOtherPriceLoading } = usePrice({
    chainId: otherCurrency?.chainId,
    address: otherCurrency?.wrapped?.address,
  })

  const { data: feePrice } = usePrice({
    chainId: fee?.currency?.chainId,
    address: fee?.currency?.wrapped?.address,
  })

  const otherParsedValue = useMemo(
    () => tryParseAmount(otherAmount, otherCurrency ?? undefined),
    [otherCurrency, otherAmount]
  )

  const otherTotalPrice =
    otherParsedValue && otherPrice
      ? otherParsedValue.multiply(otherPrice)
      : undefined

  const feeTotalPrice = fee && feePrice ? fee.multiply(feePrice) : undefined

  const impact =
    totalPrice && otherTotalPrice && otherTotalPrice.greaterThan("0")
      ? parseFloat(
          (
            ((parseFloat(totalPrice.toExact()) +
              parseFloat(feeTotalPrice?.toExact() ?? "0")) /
              parseFloat(otherTotalPrice.toExact()) -
              1) *
            100
          ).toFixed(2)
        )
      : undefined

  return (
    <InputPanel id={id}>
      <Container hideInput={hideInput} inactive={inactive}>
        {!hideInput && (
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme?.text2} fontWeight={500} fontSize={14}>
                {label}
              </TYPE.body>
              {address && (
                <TYPE.body
                  onClick={onMax}
                  color={theme?.text2}
                  fontWeight={500}
                  fontSize={14}
                  style={{ display: "inline", cursor: "pointer" }}
                >
                  {!hideBalance && !!currency && selectedCurrencyBalance
                    ? (customBalanceText ?? "Balance: ") +
                      selectedCurrencyBalance?.toSignificant(6)
                    : " -"}
                </TYPE.body>
              )}
            </RowBetween>
          </LabelRow>
        )}
        {!hideChain && chainId && onChainSelect && (
          <NetworkRow>
            <NetworkSelector network={chainId} onChange={onChainSelect} />
          </NetworkRow>
        )}
        <InputRow
          style={hideInput ? { padding: "0", borderRadius: "8px" } : {}}
          selected={disableCurrencySelect}
        >
          {!hideInput && (
            <>
              <NumericalInput
                className="token-amount-input"
                value={value}
                onUserInput={onChange}
                inactive={inactive}
              />
              {address && currency && showMaxButton && label !== "To" && (
                <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>
              )}
            </>
          )}
          <CurrencySelect
            selected={!!currency}
            className="open-currency-select-button"
            onClick={() => {
              if (!disableCurrencySelect) {
                setModalOpen(true)
              }
            }}
          >
            <Aligner>
              {pair ? (
                <DoubleCurrencyLogo
                  currency0={pair.token0}
                  currency1={pair.token1}
                  size={24}
                  margin={true}
                />
              ) : currency ? (
                <CurrencyLogo currency={currency} size={24} />
              ) : null}
              {pair ? (
                <StyledTokenName className="pair-name-container">
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </StyledTokenName>
              ) : (
                <StyledTokenName
                  className="token-symbol-container"
                  active={Boolean(currency && currency.symbol)}
                >
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? currency.symbol.slice(0, 4) +
                      "..." +
                      currency.symbol.slice(
                        currency.symbol.length - 5,
                        currency.symbol.length
                      )
                    : currency?.symbol) || "Select a token"}
                </StyledTokenName>
              )}
              {!disableCurrencySelect && (
                <StyledDropDown selected={!!currency} />
              )}
            </Aligner>
          </CurrencySelect>
        </InputRow>
        <PriceRow>
          {!isPriceLoading && price?.equalTo("0")
            ? "Price not available"
            : `~$ ${parseFloat(totalPrice?.toExact() ?? "0").toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}`}
          &nbsp;
          {showPriceImpact && impact && impact < -1.5 && !loading ? (
            <PriceImpact impact={loading ? 0 : impact}>
              ({loading ? "0.00" : impact.toFixed(2)}
              %)
            </PriceImpact>
          ) : null}
        </PriceRow>
      </Container>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          chainId={chainId ?? undefined}
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
        />
      )}
    </InputPanel>
  )
}
