"use client"

import { AutoColumn } from "@/components/Column"
import { AutoRow } from "@/components/Row"
import { ArrowWrapper } from "@/components/swap/styleds"
import {
  useDerivedSwapState,
  useSwapTrade,
  useSymbiosisTrade,
} from "@/ui/swap/derived-swap-state-provider"
import { LinkStyledButton } from "@/theme"
import { useExpertMode } from "@rcpswap/hooks"
import { useContext } from "react"
import { FiArrowDown } from "react-icons/fi"
import { ThemeContext } from "styled-components"
import { UseTradeReturn } from "@rcpswap/router"
import { Amount } from "rcpswap/currency"

export default function SwapSwitchTokensButton() {
  const [isExpertMode] = useExpertMode()
  const {
    state: { token0, token1, recipient, chainId0, chainId1 },
    mutate: { switchTokens, setRecipient },
  } = useDerivedSwapState()
  const theme = useContext(ThemeContext)
  const trade = useSwapTrade().data as UseTradeReturn
  const { data: symbiosis } = useSymbiosisTrade()

  return (
    <AutoColumn justify="space-between">
      <AutoRow
        justify={isExpertMode ? "space-between" : "center"}
        style={{ padding: "0 1rem" }}
      >
        <ArrowWrapper clickable>
          <FiArrowDown
            size="16"
            onClick={() =>
              switchTokens(
                chainId0 === chainId1
                  ? trade?.amountOut
                      ?.subtract(
                        trade.feeAmount ??
                          Amount.fromRawAmount(trade.amountOut.currency, 0)
                      )
                      .toExact() ?? ""
                  : symbiosis?.amountOut?.toExact() ?? ""
              )
            }
            color={token0 && token1 ? theme?.primary1 : theme?.text2}
          />
        </ArrowWrapper>
        {/* {recipient === null && !showWrap && isExpertMode ? ( */}
        {recipient === undefined && isExpertMode ? (
          <LinkStyledButton
            id="add-recipient-button"
            onClick={() => setRecipient("")}
          >
            + Add a send (optional)
          </LinkStyledButton>
        ) : null}
      </AutoRow>
    </AutoColumn>
  )
}
