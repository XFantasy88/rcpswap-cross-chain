"use client"

import React, { useCallback, useEffect, useState } from "react"
import { FiPlus } from "react-icons/fi"
import { Text } from "rebass"
import { ButtonDropdownLight } from "@/components/Button"
import { LightCard } from "@/components/Card"
import { AutoColumn, ColumnCenter } from "@/components/Column"
import CurrencyLogo from "@/components/CurrencyLogo"
import { MinimalPositionCard } from "@/components/PositionCard"
import Row from "@/components/Row"
import CurrencySearchModal from "@/components/SearchModal/CurrencySearchModal"
import { StyledInternalLink } from "@/theme"
import { BlueCard } from "@/components/Card"
import { TYPE } from "@/theme"
import styled from "styled-components"
import { FindPoolTabs } from "@/components/NavigationTabs"
import { useAccount } from "wagmi"
import { Native, Type } from "rcpswap/currency"
import { ChainId } from "rcpswap/chain"
import { SwapV2PoolState, useBalanceWeb3, useSwapV2Pools } from "@rcpswap/wagmi"
import { useCustomPairs } from "@rcpswap/hooks"
import { getCurrencyId } from "@/utils"

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1,
}

export const BodyWrapper = styled.div`
  position: relative;
  max-width: 420px;
  width: 100%;
  background: ${({ theme }) => theme.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 30px;
  /* padding: 1rem; */
`

export const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: ".";
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: ".";
    }
    33% {
      content: "..";
    }
    66% {
      content: "...";
    }
  }
`

export default function PoolFinder() {
  const { address } = useAccount()
  const chainId = ChainId.ARBITRUM_NOVA

  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)

  const [currency0, setCurrency0] = useState<Type | null>(
    Native.onChain(chainId)
  )
  const [currency1, setCurrency1] = useState<Type | null>(null)

  const {
    data: [[pairState, pair]],
  } = useSwapV2Pools(chainId, [
    [currency0 ?? undefined, currency1 ?? undefined],
  ])
  const addPair = useCustomPairs().mutate

  useEffect(() => {
    if (pair) {
      addPair("add", [[pair.token0, pair.token1]])
    }
  }, [pair?.liquidityToken.address])

  const validPairNoLiquidity: boolean =
    pairState === SwapV2PoolState.NOT_EXISTS ||
    Boolean(
      pairState === SwapV2PoolState.EXISTS &&
        pair &&
        pair.reserve0.equalTo(0) &&
        pair.reserve1.equalTo(1)
    )

  const { data: position } = useBalanceWeb3({
    chainId,
    account: address,
    currency: pair?.liquidityToken,
  })

  const hasPosition = Boolean(position && position.greaterThan(0))

  const handleCurrencySelect = useCallback(
    (currency: Type) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency)
      } else {
        setCurrency1(currency)
      }
    },
    [activeField]
  )

  const handleSearchDismiss = useCallback(() => {
    setShowSearch(false)
  }, [setShowSearch])

  const prerequisiteMessage = (
    <LightCard padding="45px 10px">
      <Text textAlign="center">
        {!address
          ? "Connect to a wallet to find pools"
          : "Select a token to find your liquidity."}
      </Text>
    </LightCard>
  )

  return (
    <BodyWrapper>
      <FindPoolTabs />
      <AutoColumn style={{ padding: "1rem" }} gap="md">
        <BlueCard>
          <AutoColumn gap="10px">
            <TYPE.link fontWeight={400} color={"primaryText1"}>
              <b>Tip:</b> Use this tool to find pairs that don&apos;t
              automatically appear in the interface.
            </TYPE.link>
          </AutoColumn>
        </BlueCard>
        <ButtonDropdownLight
          onClick={() => {
            setShowSearch(true)
            setActiveField(Fields.TOKEN0)
          }}
        >
          {currency0 ? (
            <Row>
              <CurrencyLogo currency={currency0} />
              <Text fontWeight={500} fontSize={20} marginLeft={"12px"}>
                {currency0.symbol}
              </Text>
            </Row>
          ) : (
            <Text fontWeight={500} fontSize={20} marginLeft={"12px"}>
              Select a Token
            </Text>
          )}
        </ButtonDropdownLight>

        <ColumnCenter>
          <FiPlus size="16" color="#888D9B" />
        </ColumnCenter>

        <ButtonDropdownLight
          onClick={() => {
            setShowSearch(true)
            setActiveField(Fields.TOKEN1)
          }}
        >
          {currency1 ? (
            <Row>
              <CurrencyLogo currency={currency1} />
              <Text fontWeight={500} fontSize={20} marginLeft={"12px"}>
                {currency1.symbol}
              </Text>
            </Row>
          ) : (
            <Text fontWeight={500} fontSize={20} marginLeft={"12px"}>
              Select a Token
            </Text>
          )}
        </ButtonDropdownLight>

        {hasPosition && (
          <ColumnCenter
            style={{
              justifyItems: "center",
              backgroundColor: "",
              padding: "12px 0px",
              borderRadius: "12px",
            }}
          >
            <Text textAlign="center" fontWeight={500}>
              Pool Found!
            </Text>
            <StyledInternalLink href={`/pool`}>
              <Text textAlign="center">Manage this pool.</Text>
            </StyledInternalLink>
          </ColumnCenter>
        )}

        {currency0 && currency1 ? (
          pairState === SwapV2PoolState.EXISTS ? (
            hasPosition && pair ? (
              <MinimalPositionCard pair={pair} border="1px solid #CED0D9" />
            ) : (
              <LightCard padding="45px 10px">
                <AutoColumn gap="sm" justify="center">
                  <Text textAlign="center">
                    You don’t have liquidity in this pool yet.
                  </Text>
                  <StyledInternalLink
                    href={`/add/${getCurrencyId(currency0)}/${getCurrencyId(
                      currency1
                    )}`}
                  >
                    <Text textAlign="center">Add liquidity.</Text>
                  </StyledInternalLink>
                </AutoColumn>
              </LightCard>
            )
          ) : validPairNoLiquidity ? (
            <LightCard padding="45px 10px">
              <AutoColumn gap="sm" justify="center">
                <Text textAlign="center">No pool found.</Text>
                <StyledInternalLink
                  href={`/add/${getCurrencyId(currency0)}/${getCurrencyId(
                    currency1
                  )}`}
                >
                  Create pool.
                </StyledInternalLink>
              </AutoColumn>
            </LightCard>
          ) : pairState === SwapV2PoolState.INVALID ? (
            <LightCard padding="45px 10px">
              <AutoColumn gap="sm" justify="center">
                <Text textAlign="center" fontWeight={500}>
                  Invalid pair.
                </Text>
              </AutoColumn>
            </LightCard>
          ) : pairState === SwapV2PoolState.LOADING ? (
            <LightCard padding="45px 10px">
              <AutoColumn gap="sm" justify="center">
                <Text textAlign="center">
                  Loading
                  <Dots />
                </Text>
              </AutoColumn>
            </LightCard>
          ) : null
        ) : (
          prerequisiteMessage
        )}
      </AutoColumn>

      <CurrencySearchModal
        isOpen={showSearch}
        onCurrencySelect={handleCurrencySelect}
        onDismiss={handleSearchDismiss}
        showCommonBases
        selectedCurrency={
          (activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined
        }
        chainId={ChainId.ARBITRUM_NOVA}
      />
    </BodyWrapper>
  )
}
