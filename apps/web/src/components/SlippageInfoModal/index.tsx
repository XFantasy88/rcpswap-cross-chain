import styled, { ThemeContext } from "styled-components"
import Modal from "../Modal"
import { AutoColumn } from "../Column"
import { RowBetween } from "../Row"
import { CloseIcon } from "@/theme"
import { Text } from "rebass"
import { FiAlertTriangle } from "react-icons/fi"
import { useContext } from "react"

const Wrapper = styled.div`
  width: 100%;
`
const Section = styled(AutoColumn)`
  padding: 24px;
`

interface SlippageInfoModalProps {
  isOpen: boolean
  onDismiss: () => void
}

export default function SlippageInfoModal({
  isOpen,
  onDismiss,
}: SlippageInfoModalProps) {
  const theme = useContext(ThemeContext)

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <Wrapper>
        <Section>
          <RowBetween>
            <Text fontWeight={500} fontSize={20}>
              Slippage Tolerance
            </Text>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
          <AutoColumn
            style={{ marginTop: 20, padding: "2rem 0" }}
            gap="24px"
            justify="center"
          >
            <FiAlertTriangle
              color={theme?.red1}
              style={{ strokeWidth: 1.5 }}
              size={64}
            />
            <Text
              fontWeight={500}
              fontSize={16}
              color={theme?.text2}
              style={{
                width: "85%",
                overflowX: "hidden",
                wordBreak: "break-all",
              }}
            >
              In rare cases, a user can receive stablecoins or WETH tokens on
              the destination network even if another token was selected as the
              destination token.
              <br />
              <br />
              Why does it happen?
              <br />
              <br />
              When assets are exchanged between different blockchains, they
              aren't processed instantly. If the exchange rate on the
              destination network changes during the processing time and the new
              conditions don't meet the stated ones, either a stablecoin or WETH
              will be received, even if another token was selected.
              <br />
              <br />
              How to minimize this incident?
              <br />
              <br />
              By increasing the Slippage tolerance in the settings just before
              the swap, enables more room for the swap conditions to be
              satisfied, decreasing the likelihood of failures.
            </Text>
          </AutoColumn>
        </Section>
      </Wrapper>
    </Modal>
  )
}
