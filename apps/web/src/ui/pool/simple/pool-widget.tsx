"use client"

import styled from "styled-components"

import { AutoColumn } from "../../../components/Column"
import PoolBanner from "./pool-banner"
import PoolLiquidityLists from "./pool-liquidity-lists"

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

export default function Pool() {
  return (
    <>
      <PageWrapper>
        <PoolBanner />
        <PoolLiquidityLists />
      </PageWrapper>
    </>
  )
}
