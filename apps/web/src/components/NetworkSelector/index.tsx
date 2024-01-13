import { ChainId } from "rcpswap/chain"
import React, { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { transparentize } from "polished"
import { FiChevronDown, FiSearch } from "react-icons/fi"
import Image from "next/image"
import { allChains } from "@rcpswap/wagmi-config"

import { SUPPORTED_NETWORK_INFO } from "@/config"

interface NetworkSelectorProps {
  network: ChainId
  onChange: (network: ChainId) => void
}

const StyledNetworkSelectorWrapped = styled.div`
  position: relative;
`

const StyledNetworkInput = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  background: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text1};
  border-radius: 10px;
  transition: all 300ms ease-in-out;
  font-size: 12px;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => transparentize(0.2, theme.bg3)};
  }
`

const StyledNetworkIcon = styled(Image)<{ size?: string }>`
  width: ${({ size }) => size ?? "16px"};
  height: ${({ size }) => size ?? "16px"};
  border-radius: 9999px;
`

const StyledNetworkDropdownWrapper = styled.div<{ open: boolean }>`
  position: absolute;
  left: 50%;
  margin-top: 0.5rem;
  transform: translateX(-50%);
  max-height: ${({ open }) => (open ? "300px" : "0px")};
  overflow: hidden;
  z-index: 10;
`

const StyledNetworkDropdown = styled.div`
  background: ${({ theme }) => transparentize(0, theme.bg2)};
  border: 1px solid ${({ theme }) => theme.bg3}
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  border-radius: 16px;
  width: 15rem;
`

const StyledNetworkDropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  transition: all 300ms ease-in-out;
  cursor: pointer;
  white-space: nowrap;
  border-radius: 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.text2};

  &:hover {
    background-color: ${({ theme }) => theme.bg3};
  }
`

const StyledNetworkSearch = styled.div`
  position: relative;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.bg3};
  margin-bottom: 0.5rem;
`

const StyledNetworkSearchInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
  margin-left: 0.5rem;
  font-size: 14px;
  color: ${({ theme }) => theme.text1};
`

export default function NetworkSelector({
  network,
  onChange,
}: NetworkSelectorProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const [search, setSearch] = useState("")

  const selected =
    allChains.find((chain) => chain.id === network) ?? allChains[0]

  useEffect(() => {
    document.addEventListener("click", closeMenu)

    return () => {
      document.removeEventListener("click", closeMenu)
    }
  }, [])

  const onClose = () => {
    setSearch("")
    setOpen(false)
  }

  const closeMenu = (e: MouseEvent) => {
    if (!ref.current?.contains(e.target as Node)) onClose()
  }

  const onSelect = (chain: ChainId) => {
    return () => {
      onClose()
      onChange(chain)
    }
  }

  return (
    <StyledNetworkSelectorWrapped ref={ref}>
      <StyledNetworkInput onClick={() => setOpen(!open)}>
        <StyledNetworkIcon
          src={SUPPORTED_NETWORK_INFO[network].image.src}
          width={SUPPORTED_NETWORK_INFO[network].image.width}
          height={SUPPORTED_NETWORK_INFO[network].image.height}
          alt={selected.name}
        />
        {selected.name}
        <FiChevronDown />
      </StyledNetworkInput>

      <StyledNetworkDropdownWrapper open={open}>
        <StyledNetworkDropdown>
          <StyledNetworkSearch>
            <FiSearch width="20px" height="20px" />
            <StyledNetworkSearchInput
              type="text"
              placeholder="Search network"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </StyledNetworkSearch>
          {allChains
            .filter(
              (item) =>
                item.name.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
                item.id.toString().indexOf(search.toLowerCase()) > -1
            )
            .map((item) => (
              <StyledNetworkDropdownItem
                key={item.id}
                onClick={onSelect(item.id as ChainId)}
              >
                <StyledNetworkIcon
                  src={SUPPORTED_NETWORK_INFO[item.id as ChainId].image.src}
                  width={SUPPORTED_NETWORK_INFO[item.id as ChainId].image.width}
                  height={
                    SUPPORTED_NETWORK_INFO[item.id as ChainId].image.height
                  }
                  alt={item.name}
                  size="18px"
                />
                {item.name}
              </StyledNetworkDropdownItem>
            ))}
        </StyledNetworkDropdown>
      </StyledNetworkDropdownWrapper>
    </StyledNetworkSelectorWrapped>
  )
}
