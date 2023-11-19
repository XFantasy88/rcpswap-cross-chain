import React from "react"
import Link from "next/link"
import styled, { keyframes } from "styled-components"
import { darken } from "polished"
import {
  FiArrowLeft,
  FiX,
  FiExternalLink as LinkIconFeather,
  FiTrash,
} from "react-icons/fi"
import Image from "next/image"

export const ButtonText = styled.button`
  outline: none;
  border: none;
  font-size: inherit;
  padding: 0;
  margin: 0;
  background: none;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }

  &:focus {
    text-decoration: underline;
  }
`

export const Button = styled.button<{
  warning: boolean
  backgroundColor: string
}>`
  padding: 1rem 2rem 1rem 2rem;
  border-radius: 3rem;
  cursor: pointer;
  user-select: none;
  font-size: 1rem;
  border: none;
  outline: none;
  background-color: ${({ warning, theme }) =>
    warning ? theme.red1 : theme.primary1};
  color: ${({ theme }) => theme.white};
  width: 100%;

  &:hover,
  &:focus {
    background-color: ${({ warning, theme }) =>
      darken(0.05, warning ? theme.red1 : theme.primary1)};
  }

  &:active {
    background-color: ${({ warning, theme }) =>
      darken(0.1, warning ? theme.red1 : theme.primary1)};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.bg1};
    color: ${({ theme }) => theme.text4};
    cursor: auto;
  }
`

export const CloseIcon = styled(FiX)<{ onClick: () => void }>`
  cursor: pointer;
`

// for wrapper react feather icons
export const IconWrapper = styled.div<{
  stroke?: string
  size?: string
  marginRight?: string
  marginLeft?: string
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ size }) => size ?? "20px"};
  height: ${({ size }) => size ?? "20px"};
  margin-right: ${({ marginRight }) => marginRight ?? 0};
  margin-left: ${({ marginLeft }) => marginLeft ?? 0};
  & > * {
    stroke: ${({ theme, stroke }) => stroke ?? theme.blue1};
  }
`

// A button that triggers some onClick result, but looks like a link.
export const LinkStyledButton = styled.button<{ disabled?: boolean }>`
  border: none;
  text-decoration: none;
  background: none;

  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  color: ${({ theme, disabled }) => (disabled ? theme.text2 : theme.primary1)};
  font-weight: 500;

  &:hover {
    text-decoration: ${({ disabled }) => (disabled ? null : "underline")};
  }

  &:focus {
    outline: none;
    text-decoration: ${({ disabled }) => (disabled ? null : "underline")};
  }

  &:active {
    text-decoration: none;
  }
`

export const ToggleStyledText = styled.div<{ disabled?: boolean }>`
  color: ${({ theme, disabled }) => (disabled ? theme.text3 : theme.green1)};
  font-weight: ${({ disabled }) => (disabled ? "500" : "600")};
  margin-right: 8px;
  font-size: 15px;
`

// An internal link from the react-router-dom library that is correctly styled
export const StyledInternalLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.primary1};
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }

  &:focus {
    outline: none;
    text-decoration: underline;
  }

  &:active {
    text-decoration: none;
  }
`

export const LinkIcon = styled(LinkIconFeather)`
  height: 16px;
  width: 18px;
  margin-left: 10px;
  stroke: ${({ theme }) => theme.blue1};
`

export const TrashIcon = styled(FiTrash)`
  height: 16px;
  width: 18px;
  margin-left: 10px;
  stroke: ${({ theme }) => theme.text3};

  cursor: pointer;
  align-items: center;
  justify-content: center;
  display: flex;

  &:hover {
    opacity: 0.7;
  }
`

const rotateImg = keyframes`
  0% {
    transform: perspective(1000px) rotateY(0deg);
  }

  100% {
    transform: perspective(1000px) rotateY(360deg);
  }
`

export const UniTokenAnimated = styled.img`
  animation: ${rotateImg} 5s cubic-bezier(0.83, 0, 0.17, 1) infinite;
  padding: 2rem 0 0 0;
  filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.15));
`

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export const Spinner = styled(Image)`
  animation: 2s ${rotate} linear infinite;
  width: 16px;
  height: 16px;
`

const BackArrowLink = styled(StyledInternalLink)`
  color: ${({ theme }) => theme.text1};
`

export function BackArrow({ to }: { to: string }) {
  return (
    <BackArrowLink href={to}>
      <FiArrowLeft />
    </BackArrowLink>
  )
}

export const CustomLightSpinner = styled(Spinner)<{ size: string }>`
  height: ${({ size }) => size};
  width: ${({ size }) => size};
`

export const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

export const HideExtraSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

export const ExtraSmallOnly = styled.span`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: block;
  `};
`
