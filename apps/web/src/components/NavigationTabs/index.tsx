import React from "react"
import styled from "styled-components"
import { darken } from "polished"

import { FiArrowLeft } from "react-icons/fi"
import { RowBetween } from "../Row"
import Settings from "../Settings"
import { useDispatch } from "react-redux"

import Link from "next/link"

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`

const StyledNavLink = styled(Link)<{ active?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  height: 3rem;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme, active }) => (active ? theme.text1 : theme.text3)};
  font-size: 20px;
  font-weight: ${({ active }) => (active ? 500 : 400)};

  &:hover,
  &:focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`

const StyledArrowLeft = styled(FiArrowLeft)`
  color: ${({ theme }) => theme.text1};
`

export function SwapPoolTabs({ active }: { active: "swap" | "pool" }) {
  return (
    <Tabs style={{ marginBottom: "20px", display: "none" }}>
      <StyledNavLink
        id={`swap-nav-link`}
        href={"/swap"}
        active={active === "swap"}
      >
        Swap
      </StyledNavLink>
      <StyledNavLink
        id={`pool-nav-link`}
        href={"/pool"}
        active={active === "pool"}
      >
        Pool
      </StyledNavLink>
    </Tabs>
  )
}

export function FindPoolTabs() {
  return (
    <Tabs>
      <RowBetween style={{ padding: "1rem 1rem 0 1rem" }}>
        <Link href="/pool">
          <StyledArrowLeft />
        </Link>
        <ActiveText>Import Pool</ActiveText>
        <Settings />
      </RowBetween>
    </Tabs>
  )
}

export function AddRemoveTabs({
  adding,
  creating,
}: {
  adding: boolean
  creating: boolean
}) {
  // reset states on back

  return (
    <Tabs>
      <RowBetween style={{ padding: "1rem 1rem 0 1rem" }}>
        <Link
          href="/pool"
          onClick={() => {
            // adding && dispatch(resetMintState())
          }}
        >
          <StyledArrowLeft />
        </Link>
        <ActiveText>
          {creating
            ? "Create a pair"
            : adding
            ? "Add Liquidity"
            : "Remove Liquidity"}
        </ActiveText>
        <Settings />
      </RowBetween>
    </Tabs>
  )
}
