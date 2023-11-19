import React from "react"
import styled from "styled-components"
import { useCopyClipboard } from "@rcpswap/hooks"

import { LinkStyledButton } from "../../theme"
import { FiCheckCircle, FiCopy } from "react-icons/fi"

const CopyIcon = styled(LinkStyledButton)`
  color: ${({ theme }) => theme.text3};
  flex-shrink: 0;
  display: flex;
  text-decoration: none;
  font-size: 0.825rem;
  :hover,
  :active,
  :focus {
    text-decoration: none;
    color: ${({ theme }) => theme.text2};
  }
`
const TransactionStatusText = styled.span`
  margin-left: 0.25rem;
  font-size: 0.825rem;
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
`

export default function CopyHelper(props: {
  toCopy: string
  children?: React.ReactNode
}) {
  const [isCopied, setCopied] = useCopyClipboard()

  return (
    <CopyIcon onClick={() => setCopied(props.toCopy)}>
      {isCopied ? (
        <TransactionStatusText>
          <FiCheckCircle size={"16"} />
          <TransactionStatusText>Copied</TransactionStatusText>
        </TransactionStatusText>
      ) : (
        <TransactionStatusText>
          <FiCopy size={"16"} />
        </TransactionStatusText>
      )}
      {isCopied ? "" : props.children}
    </CopyIcon>
  )
}
