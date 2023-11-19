import styled from "styled-components"

import {
  CardBGImage,
  CardNoise,
  CardSection,
  DataCard,
} from "@/components/styled"
import { AutoColumn } from "@/components/Column"
import { RowBetween } from "@/components/Row"
import { TYPE } from "@/theme"

const VoteCard = styled(DataCard)`
  background: radial-gradient(
    76.02% 75.41% at 1.84% 0%,
    ${({ theme }) => theme.customCardGradientStart} 0%,
    ${({ theme }) => theme.customCardGradientEnd} 100%
  );
  overflow: hidden;
`

export default function PoolBanner() {
  return (
    <VoteCard>
      <CardBGImage />
      <CardNoise />
      <CardSection>
        <AutoColumn gap="md">
          <RowBetween>
            <TYPE.white fontWeight={600}>Liquidity provider rewards</TYPE.white>
          </RowBetween>
          <RowBetween>
            <TYPE.white fontSize={14}>
              {`Liquidity providers earn a 0.25% fee on all trades proportional to their share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.`}
            </TYPE.white>
          </RowBetween>
        </AutoColumn>
      </CardSection>
      <CardBGImage />
      <CardNoise />
    </VoteCard>
  )
}
