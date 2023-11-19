"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { FiMoon, FiSun } from "react-icons/fi"
import { useAccount, useBalance, useNetwork } from "wagmi"
import { darken } from "polished"
import styled from "styled-components"
import { ChainId } from "rcpswap/chain"
import { Amount, Native } from "rcpswap/currency"

import Logo from "@/assets/images/logo/black.svg"
import LogoDark from "@/assets/images/logo/white.svg"
import NovaLogo from "@/assets/images/networks/42170.png"

import { useDarkMode } from "@rcpswap/hooks"

import Menu from "../Menu"
import Row, { RowFixed } from "../Row"
import { YellowCard } from "../Card"
import Web3Status from "../Web3Status"

const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    padding: 0 1rem;
    width: calc(100%);
    position: relative;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0.5rem 1rem;
  `}
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    max-width: 960px;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    height: 72px;
    border-radius: 12px 12px 0 0;
    background-color: ${theme.bg1};
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  /* addresses safari's lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
   width: 100%;
  `};
`

const HeaderLinks = styled(Row)`
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem 0 1rem 1rem;
    justify-content: flex-end;
`};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
`

const NetworkCard = styled(YellowCard)`
  border-radius: 12px;
  padding: 8px 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`

const BalanceText = styled.div`
  display: flex;
  align-items: center;
  padding-left: 0.75rem;
  padding-right: 0.5rem;
  flex-shrink: 0;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const NetworkLogo = styled.img`
  width: 20px;
  height: auto;
  margin-right: 6px;
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`

const UniIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
`

const LogoImage = styled(Image)`
  width: 48px;
  height: auto;
`

const StyledNavLink = styled(Link)<{ active?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme, active }) => (active ? theme.text1 : theme.text2)};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: ${({ active }) => (active ? 600 : 500)};

  &:hover,
  &:focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};
  margin-left: 8px;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  &:hover,
  &:focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
  & > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

export default function Header() {
  const { address } = useAccount()
  const { chain } = useNetwork()

  const { data: userEthBalance } = useBalance({
    address,
    chainId: ChainId.ARBITRUM_NOVA,
  })

  const { darkMode, toggleDarkMode } = useDarkMode()

  const pathname = usePathname()

  return (
    <HeaderFrame>
      <HeaderRow>
        <Title href=".">
          <UniIcon>
            <LogoImage
              src={(darkMode ? LogoDark : Logo).src}
              width={(darkMode ? LogoDark : Logo).width}
              height={(darkMode ? LogoDark : Logo).height}
              alt="logo"
            />
          </UniIcon>
        </Title>
        <HeaderLinks>
          <StyledNavLink href={"/swap"} active={pathname.startsWith("/swap")}>
            Swap
          </StyledNavLink>
          <StyledNavLink
            href={"/pool"}
            active={
              pathname.startsWith("/pool") ||
              pathname.startsWith("/add") ||
              pathname.startsWith("/create") ||
              pathname.startsWith("/find") ||
              pathname.startsWith("/remove")
            }
          >
            Pool
          </StyledNavLink>
          <StyledNavLink
            href="https://bridge.arbitrum.io"
            target="_blank"
            rel="noreferrer"
          >
            Bridge
          </StyledNavLink>
        </HeaderLinks>
      </HeaderRow>
      <HeaderControls>
        <HeaderElement>
          <AccountElement active={!!address}>
            {address && !chain?.unsupported ? (
              <BalanceText>
                <NetworkLogo
                  src={NovaLogo.src}
                  width={NovaLogo.width}
                  height={NovaLogo.height}
                  alt="nova"
                />
                {Amount.fromRawAmount(
                  Native.onChain(ChainId.ARBITRUM_NOVA),
                  userEthBalance?.value ?? 0n
                ).toSignificant(4)}{" "}
                {userEthBalance?.symbol}
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        <HeaderElementWrap>
          <StyledMenuButton onClick={() => toggleDarkMode()}>
            {darkMode ? <FiMoon size={20} /> : <FiSun size={20} />}
          </StyledMenuButton>
          <Menu />
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  )
}
