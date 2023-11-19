import React, { useRef } from "react"
import {
  FaReddit,
  FaTelegramPlane,
  FaBook,
  FaGithub,
  FaTwitter,
  FaRegChartBar,
  FaGlobe,
} from "react-icons/fa"
import styled from "styled-components"
import MenuSVG from "../svgs/Menu"
import { useOnClickOutside } from "@rcpswap/hooks"
import { ApplicationModal } from "@/state/application/actions"
import { useModalOpen, useToggleModal } from "@/state/application/hooks"
import Link from "next/link"

const StyledMenuButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text1};

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
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span`
  min-width: 9.125rem;
  background-color: ${({ theme }) => theme.bg3};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 12px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 4rem;
  right: 0rem;
  z-index: 100;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    top: -17.25rem;
  `};
`

const MenuItem = styled(Link)`
  flex: 1;
  padding: 0.5rem 0.5rem;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  &:hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
  }
  > svg {
    margin-right: 8px;
  }
`

export default function Menu() {
  const node = useRef<HTMLDivElement>(null)
  const open = useModalOpen(ApplicationModal.MENU)
  const toggle = useToggleModal(ApplicationModal.MENU)
  useOnClickOutside(node, open ? toggle : undefined)

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node}>
      <StyledMenuButton onClick={toggle}>
        <MenuSVG />
      </StyledMenuButton>

      {open && (
        <MenuFlyout>
          <MenuItem
            href="https://moonsdust.com"
            target="_blank"
            rel="noreferrer"
          >
            <FaGlobe size={16} className="mr-2" />
            MoonsDust
          </MenuItem>
          <MenuItem
            href="https://t.me/MoonsDustOfficial"
            target="_blank"
            rel="noreferrer"
          >
            <FaTelegramPlane size={16} className="mr-2" />
            Telegram
          </MenuItem>
          <MenuItem
            href="https://www.reddit.com/r/RCPswap/"
            target="_blank"
            rel="noreferrer"
          >
            <FaReddit size={16} className="mr-2" />
            Reddit
          </MenuItem>
          <MenuItem
            href="https://github.com/MoonsDusts"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub size={16} className="mr-2" />
            GitHub
          </MenuItem>
          <MenuItem
            href="https://twitter.com/moonsswap"
            target="_blank"
            rel="noreferrer"
          >
            <FaTwitter size={16} className="mr-2" />
            Twitter
          </MenuItem>
          <MenuItem
            href="https://moonsdust.gitbook.io/rcpswap/"
            target="_blank"
            rel="noreferrer"
          >
            <FaBook size={16} className="mr-2" />
            Docs
          </MenuItem>
          <MenuItem
            href="https://www.geckoterminal.com/arbitrum_nova/rcpswap/pools"
            target="_blank"
            rel="noreferrer"
          >
            <FaRegChartBar size={16} className="mr-2" />
            Analytics
          </MenuItem>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
