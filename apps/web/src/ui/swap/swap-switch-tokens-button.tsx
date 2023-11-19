"use client";

import { AutoColumn } from "@/components/Column";
import { AutoRow } from "@/components/Row";
import { ArrowWrapper } from "@/components/swap/styleds";
import { useDerivedSwapState } from "@/ui/swap/derived-swap-state-provider";
import { LinkStyledButton } from "@/theme";
import { useExpertMode } from "@rcpswap/hooks";
import { useContext } from "react";
import { FiArrowDown } from "react-icons/fi";
import { ThemeContext } from "styled-components";

export default function SwapSwitchTokensButton() {
  const [isExpertMode] = useExpertMode();
  const {
    state: { token0, token1, recipient },
    mutate: { switchTokens, setRecipient },
  } = useDerivedSwapState();
  const theme = useContext(ThemeContext);

  return (
    <AutoColumn justify="space-between">
      <AutoRow
        justify={isExpertMode ? "space-between" : "center"}
        style={{ padding: "0 1rem" }}
      >
        <ArrowWrapper clickable>
          <FiArrowDown
            size="16"
            onClick={switchTokens}
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
  );
}
