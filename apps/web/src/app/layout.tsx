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
      <title>RCPSwap | Reddit Community Points Swap</title>{" "}
      <link
        rel="shortcut icon"
        type="image/png"
        href="%PUBLIC_URL%/favicon.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="192x192"
        href="%PUBLIC_URL%/android-chrome-192x192.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="512x512"
        href="%PUBLIC_URL%/android-chrome-512x512.png"
      />
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
