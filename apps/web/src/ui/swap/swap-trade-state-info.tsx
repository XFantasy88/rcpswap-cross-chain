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
import { Native, Price } from "rcpswap/currency"
import { useContext, useState } from "react"
import { Text } from "rebass"
import { ThemeContext } from "styled-components"
import QuestionHelper from "@/components/QuestionHelper"
import { FaArrowDown } from "react-icons/fa"
import AddressInputPanel from "@/components/AddressInputPanel"
import { usePrice } from "@rcpswap/react-query"
import SlippageInfoModal from "@/components/SlippageInfoModal"

export default function SwapTradeStateInfo() {
  const theme = useContext(ThemeContext)
  const [showInverted, setShowInverted] = useState(false)
  const [showSlippageInfo, setShowSlippageInfo] = useState(false)

  const {
    state: { ultraMode, swapMode, token0, token1, recipient },
    mutate: { setUltraMode, setRecipient },
  } = useDerivedSwapState()
  const [slippageTolerance] = useSlippageTolerance()

  const toggleSettings = useToggleSettingsMenu()

  const { data: trade, isInitialLoading: isLoading } = useSwapTrade()
  const { data: symbiosisTrade, isInitialLoading: isSymbiosisLoading } =
    useSymbiosisTrade()

  const { data: feeTokenPrice } = usePrice({
    chainId: symbiosisTrade?.fee?.currency?.chainId,
    address: symbiosisTrade?.fee?.currency?.wrapped?.address,
  })

  const isWrap = token0?.isNative && token1?.equals(token0.wrapped)
  const isUnwrap = token1?.isNative && token0?.equals(token1.wrapped)

  return (
    <>
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
                  id="ultra-saving"
                  content={`Ultra Saving enhances trade efficiency and increases savings, albeit with a trade-off of requiring additional time for route calculations.`}
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
          {symbiosisTrade &&
            symbiosisTrade.amountIn &&
            symbiosisTrade.amountOut && (
              <RowBetween align="center">
                <Text fontWeight={500} fontSize={14} color={theme?.text2}>
                  Price
                </Text>
                <TradePrice
                  price={
                    new Price({
                      baseAmount: symbiosisTrade?.amountIn,
                      quoteAmount: symbiosisTrade?.amountOut,
                    })
                  }
                  showInverted={showInverted}
                  setShowInverted={setShowInverted}
                />
              </RowBetween>
            )}
          {Boolean(symbiosisTrade) && (
            <RowBetween align="center">
              <Text fontWeight={500} fontSize={14} color={theme?.text2}>
                Cross-Chain Fee
                <QuestionHelper
                  id="cross-chain-fee"
                  content={`The cross-chain fee is paid to the third party cross-chain liquidity operators, note that this fee is fixed in $ instead of % - making larger orders more economically efficient compared with smaller size orders.`}
                />
              </Text>
              <TYPE.main
                color={theme?.text2}
                style={{ marginLeft: "8px" }}
                fontSize={14}
              >
                {symbiosisTrade?.fee
                  ? `${symbiosisTrade.fee
                      .multiply(feeTokenPrice ?? "1")
                      .toSignificant(2)}$`
                  : "-"}
              </TYPE.main>
            </RowBetween>
          )}
          <RowBetween align="center">
            <Text fontWeight={500} fontSize={14} color={theme?.text2}>
              Slippage Tolerance
              <QuestionHelper
                id="slippage-tolerance"
                content={
                  <div>
                    The trade will automatically cancel if the execution price
                    change exceeds this percentage. Low Slippage Tolerance can
                    cause receiving stablecoins or WETH tokens on the
                    destination network, even if another token was selected as
                    the destination token. <br />
                    <a
                      style={{ cursor: "pointer", fontWeight: 500 }}
                      onClick={() => setShowSlippageInfo(true)}
                    >
                      Read More
                    </a>
                  </div>
                }
              />
            </Text>
            <ClickableText
              fontWeight={500}
              fontSize={14}
              color={theme?.text2}
              onClick={toggleSettings}
            >
              {slippageTolerance}%
            </ClickableText>
          </RowBetween>
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
      <SlippageInfoModal
        isOpen={showSlippageInfo}
        onDismiss={() => setShowSlippageInfo(false)}
      />
    </>
  )
}
