import { ChainId } from "rcpswap/chain"
import { Type } from "rcpswap/currency"
import React, { useMemo } from "react"
import styled from "styled-components"
import Logo from "../Logo"
import { getCloudinaryImageLoader } from "@rcpswap/wagmi"
import { WrappedTokenInfo } from "rcpswap"

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const LOGO = {
  [ChainId.ARBITRUM_NOVA]: "ethereum.svg",
  [ChainId.POLYGON]: "matic.svg",
  [ChainId.ARBITRUM_ONE]: "ethereum.svg",
  [ChainId.BSC]: "bnb.svg",
}

export default function CurrencyLogo({
  currency,
  size = 24,
  style,
}: {
  currency?: Type
  size?: number
  style?: React.CSSProperties
}) {
  const srcs: string[] = useMemo(() => {
    const fallbackURL = getCloudinaryImageLoader({
      src: currency?.isNative
        ? `native-currency/${LOGO[currency.chainId]}`
        : `tokens/${currency?.chainId}/${currency?.wrapped?.address}.jpg`,
      width: 40,
    })
    if (currency instanceof WrappedTokenInfo) {
      return [currency.tokenInfo.logoURI ?? "", fallbackURL]
    }
    return [fallbackURL]
  }, [currency])

  return (
    <StyledLogo
      srcs={srcs}
      width={size}
      height={size}
      size={`${size}px`}
      alt={`${currency?.symbol ?? "token"} logo`}
      style={style}
    />
  )
}
