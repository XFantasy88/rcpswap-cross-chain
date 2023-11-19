"use client"

import type { Metadata } from "next"
import "./globals.css"
import "inter-ui"
import Header from "@/components/Header"

import { Providers } from "./providers"
import Polling from "@/components/Header/Polling"
import styled from "styled-components"
import Popups from "@/components/Popups"

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 100px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 16px;
    padding-top: 2rem;
  `};

  z-index: 1;
`

const Marginer = styled.div`
  margin-top: 5rem;
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <title>RCPSwap | Reddit Community Points Swap</title>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png?v=1"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png?v=1"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png?v=1"
      />
      <link rel="manifest" href="/site.webmanifest?v=1" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg?v=1" color="#363636" />
      <link rel="shortcut icon" href="/favicon.ico?v=1" />
      <body>
        <Providers>
          <Header />
          <Polling />
          <BodyWrapper>
            <Popups />
            {children}
            <Marginer />
          </BodyWrapper>
        </Providers>
      </body>
    </html>
  )
}
