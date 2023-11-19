"use client"

import React, { useContext, useMemo } from "react"
import styled, { ThemeContext } from "styled-components"
import Link from "next/link"

import FullPositionCard from "../../../components/PositionCard"
import { StyledInternalLink, TYPE, HideSmall } from "../../../theme"
import { Text } from "rebass"
import Card from "../../../components/Card"
import { RowBetween, RowFixed } from "../../../components/Row"
import { ButtonPrimary, ButtonSecondary } from "../../../components/Button"
import { AutoColumn } from "../../../components/Column"

import { useTrackedTokenPairs } from "@/hooks/Pairs"
import { toV2LiquidityToken } from "@/utils"
import { Dots } from "../../../components/swap/styleds"
import { useAccount } from "wagmi"
import { ChainId } from "rcpswap/chain"
import { useBalancesWeb3, useSwapV2Pools } from "@rcpswap/wagmi"
import { Pool } from "@rcpswap/v2-sdk"

const TitleRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`

const ButtonRow = styled(RowFixed)`
  gap: 8px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    flex-direction: row-reverse;
    justify-content: space-between;
  `};
`

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`

const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`

const EmptyProposals = styled.div`
  border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function PoolLiquidityLists() {
  const theme = useContext(ThemeContext)
  const { address } = useAccount()

  const chainId = ChainId.ARBITRUM_NOVA

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () =>
      trackedTokenPairs.map((tokens) => ({
        liquidityToken: toV2LiquidityToken(tokens),
        tokens,
      })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens]
  )

  const { data: v2PairsBalances } = useBalancesWeb3({
    account: address,
    chainId,
    currencies: liquidityTokens,
  })

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances?.[liquidityToken.address]?.greaterThan("0")
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const { data: v2Pairs, isLoading } = useSwapV2Pools(
    chainId,
    liquidityTokensWithBalances.map(({ tokens }) => tokens)
  )

  const v2IsLoading =
    isLoading ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    v2Pairs?.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs
    .map(([, pair]) => pair)
    .filter((v2Pair): v2Pair is Pool => Boolean(v2Pair))

  return (
    <AutoColumn gap="lg" justify="center">
      <AutoColumn gap="lg" style={{ width: "100%" }}>
        <TitleRow style={{ marginTop: "1rem" }} padding={"0"}>
          <HideSmall>
            <TYPE.mediumHeader style={{ justifySelf: "flex-start" }}>
              Your liquidity
            </TYPE.mediumHeader>
          </HideSmall>
          <ButtonRow>
            <ResponsiveButtonSecondary
              as={Link}
              padding="6px 8px"
              href={`/pool/create/ETH`}
            >
              Create a pair
            </ResponsiveButtonSecondary>
            <ResponsiveButtonPrimary
              id="join-pool-button"
              as={Link}
              padding="6px 8px"
              borderRadius="12px"
              href={`/pool/add/ETH`}
            >
              <Text fontWeight={500} fontSize={16}>
                Add Liquidity
              </Text>
            </ResponsiveButtonPrimary>
          </ButtonRow>
        </TitleRow>

        {!address ? (
          <Card padding="40px">
            <TYPE.body color={theme?.text3} textAlign="center">
              Connect to a wallet to view your liquidity.
            </TYPE.body>
          </Card>
        ) : v2IsLoading ? (
          <EmptyProposals>
            <TYPE.body color={theme?.text3} textAlign="center">
              <Dots>Loading</Dots>
            </TYPE.body>
          </EmptyProposals>
        ) : allV2PairsWithLiquidity?.length > 0 ? (
          <>
            {allV2PairsWithLiquidity.map((v2Pair) => (
              <FullPositionCard
                key={v2Pair.liquidityToken.address}
                pair={v2Pair}
              />
            ))}
          </>
        ) : (
          <EmptyProposals>
            <TYPE.body color={theme?.text3} textAlign="center">
              No liquidity found.
            </TYPE.body>
          </EmptyProposals>
        )}

        <AutoColumn justify={"center"} gap="md">
          <Text
            textAlign="center"
            fontSize={14}
            style={{ padding: ".5rem 0 .5rem 0" }}
          >
            {"Don't see a pool you joined?"}{" "}
            <StyledInternalLink id="import-pool-link" href={"/pool/find"}>
              Import it.
            </StyledInternalLink>
          </Text>
        </AutoColumn>
      </AutoColumn>
    </AutoColumn>
  )
}
