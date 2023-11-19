import { darken } from "polished"
import React, { useState } from "react"
import { FiChevronDown, FiChevronUp } from "react-icons/fi"
import { Text } from "rebass"
import styled from "styled-components"

import { TYPE } from "../../theme"
import { ButtonPrimary, ButtonEmpty } from "../Button"
import { transparentize } from "polished"
import { CardNoise } from "../styled"

import { useColor } from "@rcpswap/hooks"
import Card, { GreyCard, LightCard } from "../Card"
import { AutoColumn } from "../Column"
import CurrencyLogo from "../CurrencyLogo"
import DoubleCurrencyLogo from "../DoubleLogo"
import { RowBetween, RowFixed, AutoRow } from "../Row"
import { Dots } from "../swap/styleds"
import { Pool } from "@rcpswap/v2-sdk"
import { useAccount } from "wagmi"
import { Amount, Native, Token } from "rcpswap/currency"
import { useBalanceWeb3, useTotalSupply } from "@rcpswap/wagmi"
import { ChainId } from "rcpswap/chain"
import { Percent } from "rcpswap"
import Link from "next/link"
import { getCurrencyId } from "@/utils"

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

export const HoverCard = styled(Card)`
  border: 1px solid transparent;
  :hover {
    border: 1px solid ${({ theme }) => darken(0.06, theme.bg2)};
  }
`
const StyledPositionCard = styled(LightCard)<{ bgColor: any }>`
  border: none;
  background: ${({ theme, bgColor }) =>
    `radial-gradient(91.85% 100% at 1.84% 0%, ${transparentize(
      0.8,
      bgColor
    )} 0%, ${theme.bg3} 100%) `};
  position: relative;
  overflow: hidden;
`

interface PositionCardProps {
  pair: Pool
  showUnwrapped?: boolean
  border?: string
}

export function MinimalPositionCard({
  pair,
  showUnwrapped = false,
  border,
}: PositionCardProps) {
  const { address } = useAccount()

  const currency0 = showUnwrapped
    ? pair.token0
    : pair.token0.equals(Native.onChain(pair.token0.chainId).wrapped)
    ? Native.onChain(pair.token0.chainId)
    : pair.token0
  const currency1 = showUnwrapped
    ? pair.token1
    : pair.token1.equals(Native.onChain(pair.token1.chainId).wrapped)
    ? Native.onChain(pair.token1.chainId)
    : pair.token1

  const [showMore, setShowMore] = useState(false)

  const { data: userPoolBalance } = useBalanceWeb3({
    chainId: pair.chainId as ChainId,
    currency: pair.liquidityToken,
    account: address,
  })
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance &&
    !!totalPoolTokens &&
    !totalPoolTokens.lessThan(userPoolBalance)
      ? new Percent(userPoolBalance.quotient, totalPoolTokens.quotient)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    !totalPoolTokens.lessThan(userPoolBalance)
      ? [
          pair.getLiquidityValue(
            pair.token0,
            totalPoolTokens,
            userPoolBalance as Amount<Token>,
            false
          ),
          pair.getLiquidityValue(
            pair.token1,
            totalPoolTokens,
            userPoolBalance as Amount<Token>,
            false
          ),
        ]
      : [undefined, undefined]

  return (
    <>
      {userPoolBalance && userPoolBalance.greaterThan(0) ? (
        <GreyCard border={border}>
          <AutoColumn gap="12px">
            <FixedHeightRow>
              <RowFixed>
                <Text fontWeight={500} fontSize={16}>
                  Your position
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <FixedHeightRow onClick={() => setShowMore(!showMore)}>
              <RowFixed>
                <DoubleCurrencyLogo
                  currency0={currency0}
                  currency1={currency1}
                  margin={true}
                  size={20}
                />
                <Text fontWeight={500} fontSize={20}>
                  {currency0.symbol}/{currency1.symbol}
                </Text>
              </RowFixed>
              <RowFixed>
                <Text fontWeight={500} fontSize={20}>
                  {userPoolBalance ? userPoolBalance.toSignificant(4) : "-"}
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <AutoColumn gap="4px">
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  Your pool share:
                </Text>
                <Text fontSize={16} fontWeight={500}>
                  {poolTokenPercentage
                    ? poolTokenPercentage.toFixed(6) + "%"
                    : "-"}
                </Text>
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  {currency0.symbol}:
                </Text>
                {token0Deposited ? (
                  <RowFixed>
                    <Text fontSize={16} fontWeight={500} marginLeft={"6px"}>
                      {token0Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  "-"
                )}
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  {currency1.symbol}:
                </Text>
                {token1Deposited ? (
                  <RowFixed>
                    <Text fontSize={16} fontWeight={500} marginLeft={"6px"}>
                      {token1Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  "-"
                )}
              </FixedHeightRow>
            </AutoColumn>
          </AutoColumn>
        </GreyCard>
      ) : (
        <LightCard>
          <TYPE.subHeader style={{ textAlign: "center" }}>
            <span role="img" aria-label="wizard-icon">
              ⭐️
            </span>{" "}
            By adding liquidity you&apos;ll earn 0.25% of all trades on this
            pair proportional to your share of the pool. Fees are added to the
            pool, accrue in real time and can be claimed by withdrawing your
            liquidity.
          </TYPE.subHeader>
        </LightCard>
      )}
    </>
  )
}

export default function FullPositionCard({ pair, border }: PositionCardProps) {
  const { address } = useAccount()

  const currency0 = pair.token0.equals(
    Native.onChain(pair.token0.chainId).wrapped
  )
    ? Native.onChain(pair.token0.chainId)
    : pair.token0
  const currency1 = pair.token1.equals(
    Native.onChain(pair.token1.chainId).wrapped
  )
    ? Native.onChain(pair.token1.chainId)
    : pair.token1

  const [showMore, setShowMore] = useState(false)

  const { data: userPoolBalance } = useBalanceWeb3({
    chainId: pair.chainId as ChainId,
    currency: pair.liquidityToken,
    account: address,
  })
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance &&
    !!totalPoolTokens &&
    !totalPoolTokens.lessThan(userPoolBalance)
      ? new Percent(userPoolBalance.quotient, totalPoolTokens.quotient)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    !totalPoolTokens.lessThan(userPoolBalance)
      ? [
          pair.getLiquidityValue(
            pair.token0,
            totalPoolTokens,
            userPoolBalance as Amount<Token>,
            false
          ),
          pair.getLiquidityValue(
            pair.token1,
            totalPoolTokens,
            userPoolBalance as Amount<Token>,
            false
          ),
        ]
      : [undefined, undefined]

  const backgroundColor = useColor(pair?.token0)

  return (
    <StyledPositionCard border={border} bgColor={backgroundColor}>
      <CardNoise />
      <AutoColumn gap="12px">
        <FixedHeightRow>
          <AutoRow gap="8px">
            <DoubleCurrencyLogo
              currency0={currency0}
              currency1={currency1}
              size={20}
            />
            <Text fontWeight={500} fontSize={20}>
              {!currency0 || !currency1 ? (
                <Dots>Loading</Dots>
              ) : (
                `${currency0.symbol}/${currency1.symbol}`
              )}
            </Text>
          </AutoRow>
          <RowFixed gap="8px">
            <ButtonEmpty
              padding="6px 8px"
              borderRadius="12px"
              width="fit-content"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? (
                <>
                  Manage
                  <FiChevronUp size="20" style={{ marginLeft: "10px" }} />
                </>
              ) : (
                <>
                  Manage
                  <FiChevronDown size="20" style={{ marginLeft: "10px" }} />
                </>
              )}
            </ButtonEmpty>
          </RowFixed>
        </FixedHeightRow>

        {showMore && (
          <AutoColumn gap="8px">
            <FixedHeightRow>
              <Text fontSize={16} fontWeight={500}>
                Your total pool tokens:
              </Text>
              <Text fontSize={16} fontWeight={500}>
                {userPoolBalance ? userPoolBalance.toSignificant(4) : "-"}
              </Text>
            </FixedHeightRow>
            <FixedHeightRow>
              <RowFixed>
                <Text fontSize={16} fontWeight={500}>
                  Pooled {currency0.symbol}:
                </Text>
              </RowFixed>
              {token0Deposited ? (
                <RowFixed>
                  <Text fontSize={16} fontWeight={500} marginLeft={"6px"}>
                    {token0Deposited?.toSignificant(6)}
                  </Text>
                  <CurrencyLogo
                    size={20}
                    style={{ marginLeft: "8px" }}
                    currency={currency0}
                  />
                </RowFixed>
              ) : (
                "-"
              )}
            </FixedHeightRow>

            <FixedHeightRow>
              <RowFixed>
                <Text fontSize={16} fontWeight={500}>
                  Pooled {currency1.symbol}:
                </Text>
              </RowFixed>
              {token1Deposited ? (
                <RowFixed>
                  <Text fontSize={16} fontWeight={500} marginLeft={"6px"}>
                    {token1Deposited?.toSignificant(6)}
                  </Text>
                  <CurrencyLogo
                    size={20}
                    style={{ marginLeft: "8px" }}
                    currency={currency1}
                  />
                </RowFixed>
              ) : (
                "-"
              )}
            </FixedHeightRow>

            <FixedHeightRow>
              <Text fontSize={16} fontWeight={500}>
                Your pool share:
              </Text>
              <Text fontSize={16} fontWeight={500}>
                {poolTokenPercentage
                  ? (poolTokenPercentage.toFixed(2) === "0.00"
                      ? "<0.01"
                      : poolTokenPercentage.toFixed(2)) + "%"
                  : "-"}
              </Text>
            </FixedHeightRow>

            {userPoolBalance && userPoolBalance.greaterThan(0) && (
              <RowBetween marginTop="10px">
                <ButtonPrimary
                  padding="8px"
                  borderRadius="8px"
                  as={Link}
                  href={`/pool/add/${getCurrencyId(currency0)}/${getCurrencyId(
                    currency1
                  )}`}
                  width="48%"
                >
                  Add
                </ButtonPrimary>
                <ButtonPrimary
                  padding="8px"
                  borderRadius="8px"
                  as={Link}
                  width="48%"
                  href={`/pool/remove/${getCurrencyId(
                    currency0
                  )}/${getCurrencyId(currency1)}`}
                >
                  Remove
                </ButtonPrimary>
              </RowBetween>
            )}
          </AutoColumn>
        )}
      </AutoColumn>
    </StyledPositionCard>
  )
}
