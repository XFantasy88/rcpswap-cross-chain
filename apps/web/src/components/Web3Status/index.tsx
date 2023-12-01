import { darken, lighten } from "polished"
import React, { useMemo } from "react"
import { FiActivity } from "react-icons/fi"
import styled, { css } from "styled-components"
import { Connector, useAccount, useNetwork, useSwitchNetwork } from "wagmi"
import Image from "next/image"
import { ChainId } from "rcpswap/chain"
import { getShortenAddress } from "@rcpswap/wagmi"

import { useWalletModalToggle } from "../../state/application/hooks"
import { useAllTransactions } from "@rcpswap/dexie"
import { ButtonSecondary } from "../Button"

import Identicon from "../Identicon"
import Loader from "../Loader"

import { RowBetween } from "../Row"
import WalletModal from "../WalletModal"
import WalletConnectIcon from "@/assets/images/wallets/wallet-connect.svg"
import CoinbaseIcon from "@/assets/images/wallets/coinbase.svg"
import LedgerIcon from "@/assets/images/wallets/ledger.svg"

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + "px" : "32px")};
    width: ${({ size }) => (size ? size + "px" : "32px")};
  }
`

const Web3StatusGeneric = styled(ButtonSecondary)`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  &:focus {
    outline: none;
  }
`
const Web3StatusError = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.red1};
  border: 1px solid ${({ theme }) => theme.red1};
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  &:hover,
  &:focus {
    background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }
`

const Web3StatusConnect = styled(Web3StatusGeneric)<{ faded?: boolean }>`
  background-color: ${({ theme }) => theme.primary4};
  border: none;
  color: ${({ theme }) => theme.primaryText1};
  font-weight: 500;

  &:hover,
  &:focus {
    border: 1px solid ${({ theme }) => darken(0.05, theme.primary4)};
    color: ${({ theme }) => theme.primaryText1};
  }

  ${({ faded }) =>
    faded &&
    css`
      background-color: ${({ theme }) => theme.primary5};
      border: 1px solid ${({ theme }) => theme.primary5};
      color: ${({ theme }) => theme.primaryText1};

      &:hover,
      &:focus {
        border: 1px solid ${({ theme }) => darken(0.05, theme.primary4)};
        color: ${({ theme }) => darken(0.05, theme.primaryText1)};
      }
    `}
`

const Web3StatusConnected = styled(Web3StatusGeneric)<{ pending?: boolean }>`
  background-color: ${({ pending, theme }) =>
    pending ? theme.primary1 : theme.bg2};
  border: 1px solid
    ${({ pending, theme }) => (pending ? theme.primary1 : theme.bg3)};
  color: ${({ pending, theme }) => (pending ? theme.white : theme.text1)};
  font-weight: 500;
  &:hover,
  &:focus {
    background-color: ${({ pending, theme }) =>
      pending ? darken(0.05, theme.primary1) : lighten(0.05, theme.bg2)};

    &:focus {
      border: 1px solid
        ${({ pending, theme }) =>
          pending ? darken(0.1, theme.primary1) : darken(0.1, theme.bg3)};
    }
  }
`

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.25rem;
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
`

const NetworkIcon = styled(FiActivity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`

// eslint-disable-next-line react/prop-types
function StatusIcon({ connector }: { connector: Connector }) {
  if (connector.id === "injected" || connector.id === "metaMask") {
    return <Identicon />
  } else if (connector.id === "walletConnect") {
    return (
      <IconWrapper size={16}>
        <Image
          src={WalletConnectIcon.src}
          width={WalletConnectIcon.width}
          height={WalletConnectIcon.height}
          alt={"walletconnect"}
        />
      </IconWrapper>
    )
  } else if (connector.id === "coinbaseWallet") {
    return (
      <IconWrapper size={16}>
        <Image
          src={CoinbaseIcon.src}
          width={CoinbaseIcon.width}
          height={CoinbaseIcon.height}
          alt={"coinbase"}
        />
      </IconWrapper>
    )
  } else if (connector.id === "ledger") {
    return (
      <IconWrapper size={16}>
        <Image
          src={LedgerIcon.src}
          width={LedgerIcon.width}
          height={LedgerIcon.height}
          alt={"ledger"}
        />
      </IconWrapper>
    )
  }
  return null
}

function Web3StatusInner() {
  const { address, connector } = useAccount()
  const { chain } = useNetwork()
  const { switchNetworkAsync } = useSwitchNetwork()

  const allTransactions = useAllTransactions(
    (chain?.id ?? ChainId.ARBITRUM_NOVA) as ChainId
  )

  const pending = allTransactions
    ?.filter((tx) => !tx.status)
    ?.map((tx) => tx.hash)

  const hasPendingTransactions = !!pending?.length
  const toggleWalletModal = useWalletModalToggle()

  if (chain?.unsupported) {
    return (
      <Web3StatusError
        onClick={() => switchNetworkAsync?.(ChainId.ARBITRUM_NOVA)}
      >
        <NetworkIcon />
        <Text>Connect to Arbitrum Nova</Text>
      </Web3StatusError>
    )
  } else if (address) {
    return (
      <Web3StatusConnected
        id="web3-status-connected"
        onClick={toggleWalletModal}
        pending={hasPendingTransactions}
      >
        {hasPendingTransactions ? (
          <RowBetween>
            <Text>{pending?.length} Pending</Text> <Loader stroke="white" />
          </RowBetween>
        ) : (
          <>
            <Text>{getShortenAddress(address)}</Text>
          </>
        )}
        {!hasPendingTransactions && connector && (
          <StatusIcon connector={connector} />
        )}
      </Web3StatusConnected>
    )
  } else {
    return (
      <Web3StatusConnect
        id="connect-wallet"
        onClick={toggleWalletModal}
        faded={!address}
      >
        <Text>Connect a Wallet</Text>
      </Web3StatusConnect>
    )
  }
}

export default function Web3Status() {
  const chainId = useNetwork().chain?.id as ChainId
  const allTransactions = useAllTransactions(chainId ?? ChainId.ARBITRUM_NOVA)

  const pending = allTransactions
    ?.filter((tx) => !tx.status)
    ?.map((tx) => tx.hash)
  const confirmed = allTransactions
    ?.filter((tx) => tx.status)
    .map((tx) => tx.hash)

  return (
    <>
      <Web3StatusInner />
      <WalletModal
        pendingTransactions={pending ?? []}
        confirmedTransactions={confirmed ?? []}
      />
    </>
  )
}
