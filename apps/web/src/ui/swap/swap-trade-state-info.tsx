"use client"

import Card from "@/components/Card"
import { AutoColumn } from "@/components/Column"
import TailLoader from "@/components/Loader/TailLoader"
import Row, { AutoRow, RowBetween } from "@/components/Row"
import Toggle from "@/components/Toggle"
import TradePrice from "@/components/swap/TradePrice"
import { ArrowWrapper, ClickableText } from "@/components/swap/styleds"
import { useToggleSettingsMenu } from "@/state/application/hooks"
import {
  useDerivedSwapState,
  useSwapTrade,
  useSymbiosisTrade,
} from "@/ui/swap/derived-swap-state-provider"
import { LinkStyledButton, TYPE, ToggleStyledText } from "@/theme"
import { INITIAL_ALLOWED_SLIPPAGE, useSlippageTolerance } from "@rcpswap/hooks"
import { UseTradeReturn } from "@rcpswap/router"
import { Native } from "rcpswap/currency"
import { useContext, useState } from "react"
import { Text } from "rebass"
import { ThemeContext } from "styled-components"
import QuestionHelper from "@/components/QuestionHelper"
import { FaArrowDown } from "react-icons/fa"
import AddressInputPanel from "@/components/AddressInputPanel"

export default function SwapTradeStateInfo() {
  const theme = useContext(ThemeContext)
  const [showInverted, setShowInverted] = useState(false)

  const {
    state: { ultraMode, swapMode, token0, token1, recipient },
    mutate: { setUltraMode, setRecipient },
  } = useDerivedSwapState()
  const [slippageTolerance] = useSlippageTolerance()

  const toggleSettings = useToggleSettingsMenu()

  const { data: trade, isInitialLoading: isLoading } = useSwapTrade()
  const { isInitialLoading: isSymbiosisLoading } = useSymbiosisTrade()

  const isWrap = token0?.isNative && token1?.equals(token0.wrapped)
  const isUnwrap = token1?.isNative && token0?.equals(token1.wrapped)

  return (
    <Card
      padding={isWrap || isUnwrap ? ".25rem 1rem 0 1rem" : "0px"}
      borderRadius={"20px"}
    >
      <AutoColumn gap="8px" style={{ padding: "0 16px" }}>
        {recipient !== undefined ? (
          <>
            <AutoRow justify="space-between" style={{ padding: "0 1rem" }}>
              <ArrowWrapper clickable={false}>
                <FaArrowDown size="16" color={theme?.text2} />
              </ArrowWrapper>
              <LinkStyledButton
                id="remove-recipient-button"
                onClick={() => setRecipient(undefined)}
              >
                - Remove send
              </LinkStyledButton>
            </AutoRow>
            <AddressInputPanel
              id="recipient"
              value={recipient}
              onChange={setRecipient}
            />
          </>
        ) : null}
        {swapMode === 1 && (
          <RowBetween>
            <ToggleStyledText disabled={!ultraMode}>
              Ultra Saving
              <QuestionHelper
                text={`Ultra Saving enhances trade efficiency and increases savings, albeit with a trade-off of requiring additional time for route calculations.`}
              />
            </ToggleStyledText>
            <Toggle
              id="toggle-expert-mode-button"
              isActive={ultraMode}
              toggle={() => setUltraMode(!ultraMode)}
            />
          </RowBetween>
        )}
        {Boolean(trade) && (
          <RowBetween align="center">
            <Text fontWeight={500} fontSize={14} color={theme?.text2}>
              Price
            </Text>
            <TradePrice
              price={(trade as UseTradeReturn).swapPrice}
              showInverted={showInverted}
              setShowInverted={setShowInverted}
            />
          </RowBetween>
        )}
        {+slippageTolerance !== INITIAL_ALLOWED_SLIPPAGE && (
          <RowBetween align="center">
            <ClickableText
              fontWeight={500}
              fontSize={14}
              color={theme?.text2}
              onClick={toggleSettings}
            >
              Slippage Tolerance
            </ClickableText>
            <ClickableText
              fontWeight={500}
              fontSize={14}
              color={theme?.text2}
              onClick={toggleSettings}
            >
              {slippageTolerance}%
            </ClickableText>
          </RowBetween>
        )}
        {(isLoading || isSymbiosisLoading) && swapMode === 1 ? (
          <Row
            align="center"
            color={theme?.text3}
            style={{ justifyContent: "end" }}
          >
            <TailLoader r={8} />
            <TYPE.main
              color={theme?.text3}
              style={{ marginLeft: "8px" }}
              fontSize={14}
            >
              Fetching the best price...
            </TYPE.main>
          </Row>
        ) : null}
      </AutoColumn>
    </Card>
  )
}
