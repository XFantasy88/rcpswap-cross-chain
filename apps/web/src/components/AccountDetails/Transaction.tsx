import React from "react"
import styled from "styled-components"
import { FiCheckCircle, FiTriangle } from "react-icons/fi"

import { getEtherscanLink } from "@rcpswap/wagmi"
import { ChainId } from "rcpswap/chain"
import { useAllTransactions } from "@rcpswap/dexie"

import { StyledInternalLink } from "../../theme"
import { RowFixed } from "../Row"
import Loader from "../Loader"

const TransactionWrapper = styled.div``

const TransactionStatusText = styled.div`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  &:hover {
    text-decoration: underline;
  }
`

const TransactionState = styled(StyledInternalLink)<{
  pending: boolean
  success?: boolean
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none !important;
  border-radius: 0.5rem;
  padding: 0.25rem 0rem;
  font-weight: 500;
  font-size: 0.825rem;
  color: ${({ theme }) => theme.primary1};
`

const IconWrapper = styled.div<{ pending: boolean; success?: boolean }>`
  display: flex;
  color: ${({ pending, success, theme }) =>
    pending ? theme.primary1 : success ? theme.green1 : theme.red1};
`

export default function Transaction({ hash }: { hash: string }) {
  // const { chainId } = useActiveWeb3React()
  const chainId = ChainId.ARBITRUM_NOVA
  const allTransactions = useAllTransactions(chainId)

  const tx = allTransactions?.find((tx) => tx.hash === hash)
  const summary = tx?.summary
  const pending = !tx?.receipt
  const success =
    !pending &&
    tx &&
    (tx.receipt?.status === "success" ||
      typeof tx.receipt?.status === "undefined")

  if (!chainId) return null

  return (
    <TransactionWrapper>
      <TransactionState
        href={getEtherscanLink(chainId, hash, "transaction")}
        target="_blank"
        rel="noreferrer"
        pending={pending}
        success={success}
      >
        <RowFixed>
          <TransactionStatusText>{summary ?? hash} ↗</TransactionStatusText>
        </RowFixed>
        <IconWrapper pending={pending} success={success}>
          {pending ? (
            <Loader />
          ) : success ? (
            <FiCheckCircle size="16" />
          ) : (
            <FiTriangle size="16" />
          )}
        </IconWrapper>
      </TransactionState>
    </TransactionWrapper>
  )
}
