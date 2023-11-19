import React, { useCallback, useContext } from "react"
import styled, { ThemeContext } from "styled-components"
import { AiOutlineClose } from "react-icons/ai"
import { FiExternalLink as LinkIcon } from "react-icons/fi"
import { useAccount, useDisconnect, useNetwork } from "wagmi"
import Image from "next/image"

import { useClearTransaction } from "@rcpswap/dexie"
import { getShortenAddress, getEtherscanLink } from "@rcpswap/wagmi"
import { ChainId } from "rcpswap/chain"

import { AutoRow } from "../Row"
import Copy from "./Copy"
import Transaction from "./Transaction"
import Identicon from "../Identicon"
import { ButtonSecondary } from "../Button"
import { StyledInternalLink, LinkStyledButton, TYPE } from "../../theme"

import WalletConnectIcon from "@/assets/images/wallets/wallet-connect.svg"
import CoinbaseIcon from "@/assets/images/wallets/coinbase.svg"
import LedgerIcon from "@/assets/images/wallets/ledger.svg"

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${(props) =>
    props.color === "blue" ? ({ theme }) => theme.primary1 : "inherit"};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

const UpperSection = styled.div`
  position: relative;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

const InfoCard = styled.div`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.bg3};
  border-radius: 20px;
  position: relative;
  display: grid;
  grid-row-gap: 12px;
  margin-bottom: 20px;
`

const AccountGroupingRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  color: ${({ theme }) => theme.text1};

  div {
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
  }
`

const AccountSection = styled.div`
  background-color: ${({ theme }) => theme.bg1};
  padding: 0rem 1rem;
  ${({ theme }) =>
    theme.mediaWidth.upToMedium`padding: 0rem 1rem 1.5rem 1rem;`};
`

const YourAccount = styled.div`
  h5 {
    margin: 0 0 1rem 0;
    font-weight: 400;
  }

  h4 {
    margin: 0;
    font-weight: 500;
  }
`

const LowerSection = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  padding: 1.5rem;
  flex-grow: 1;
  overflow: auto;
  background-color: ${({ theme }) => theme.bg2};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  h5 {
    margin: 0;
    font-weight: 400;
    color: ${({ theme }) => theme.text3};
  }
`

const AccountControl = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 0;
  width: 100%;

  font-weight: 500;
  font-size: 1.25rem;

  a:hover {
    text-decoration: underline;
  }

  p {
    min-width: 0;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const AddressLink = styled(StyledInternalLink)<{
  hasENS: boolean
  isENS: boolean
}>`
  font-size: 0.825rem;
  color: ${({ theme }) => theme.text3};
  margin-left: 1rem;
  font-size: 0.825rem;
  display: flex;
  :hover {
    color: ${({ theme }) => theme.text2};
  }
`

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const CloseColor = styled(AiOutlineClose)`
  path {
    stroke: ${({ theme }) => theme.text4};
  }
`

const WalletName = styled.div`
  width: initial;
  font-size: 0.825rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text3};
`

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  & > img,
  span {
    height: ${({ size }) => (size ? size + "px" : "32px")};
    width: ${({ size }) => (size ? size + "px" : "32px")};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
`

const TransactionListWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
`

const WalletAction = styled(ButtonSecondary)`
  width: fit-content;
  font-weight: 400;
  margin-left: 8px;
  font-size: 0.825rem;
  padding: 4px 6px;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`

function renderTransactions(transactions: string[]) {
  return (
    <TransactionListWrapper>
      {transactions.map((hash, i) => {
        return <Transaction key={i} hash={hash} />
      })}
    </TransactionListWrapper>
  )
}

interface AccountDetailsProps {
  toggleWalletModal: () => void
  pendingTransactions: string[]
  confirmedTransactions: string[]
  ENSName?: string
  openOptions: () => void
}

export default function AccountDetails({
  toggleWalletModal,
  pendingTransactions,
  confirmedTransactions,
  ENSName,
  openOptions,
}: AccountDetailsProps) {
  const { connector, address } = useAccount()
  const { disconnectAsync } = useDisconnect()
  const { chain } = useNetwork()
  const theme = useContext(ThemeContext)
  const clearAllTransactions = useClearTransaction()

  function getStatusIcon() {
    if (connector?.id === "injected" || connector?.id === "metaMask") {
      return (
        <IconWrapper size={16}>
          <Identicon />
        </IconWrapper>
      )
    } else if (connector?.id === "walletConnect") {
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
    } else if (connector?.id === "coinbaseWallet") {
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
    } else if (connector?.id === "ledger") {
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

  const clearAllTransactionsCallback = useCallback(() => {
    if (chain?.id) clearAllTransactions(chain.id as ChainId)
  }, [chain?.id])

  return (
    <>
      <UpperSection>
        <CloseIcon onClick={toggleWalletModal}>
          <CloseColor />
        </CloseIcon>
        <HeaderRow>Account</HeaderRow>
        <AccountSection>
          <YourAccount>
            <InfoCard>
              <AccountGroupingRow>
                <WalletName>{connector?.name}</WalletName>
                <div>
                  {connector?.id !== "injected" &&
                    connector?.id !== "coinbaseWallet" && (
                      <WalletAction
                        style={{
                          fontSize: ".825rem",
                          fontWeight: 400,
                          marginRight: "8px",
                        }}
                        onClick={() => {
                          disconnectAsync?.()
                        }}
                      >
                        Disconnect
                      </WalletAction>
                    )}
                  <WalletAction
                    style={{ fontSize: ".825rem", fontWeight: 400 }}
                    onClick={() => {
                      openOptions()
                    }}
                  >
                    Change
                  </WalletAction>
                </div>
              </AccountGroupingRow>
              <AccountGroupingRow id="web3-account-identifier-row">
                <AccountControl>
                  {ENSName ? (
                    <>
                      <div>
                        {getStatusIcon()}
                        <p> {ENSName}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        {getStatusIcon()}
                        <p> {address && getShortenAddress(address)}</p>
                      </div>
                    </>
                  )}
                </AccountControl>
              </AccountGroupingRow>
              <AccountGroupingRow>
                {ENSName ? (
                  <>
                    <AccountControl>
                      <div>
                        {address && (
                          <Copy toCopy={address}>
                            <span style={{ marginLeft: "4px" }}>
                              Copy Address
                            </span>
                          </Copy>
                        )}
                        {chain && address && (
                          <AddressLink
                            hasENS={!!ENSName}
                            isENS={true}
                            href={
                              chain &&
                              getEtherscanLink(
                                chain.id as ChainId,
                                ENSName,
                                "address"
                              )
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            <LinkIcon size={16} />
                            <span style={{ marginLeft: "4px" }}>
                              View on {chain?.blockExplorers?.etherscan?.name}
                            </span>
                          </AddressLink>
                        )}
                      </div>
                    </AccountControl>
                  </>
                ) : (
                  <>
                    <AccountControl>
                      <div>
                        {address && (
                          <Copy toCopy={address}>
                            <span style={{ marginLeft: "4px" }}>
                              Copy Address
                            </span>
                          </Copy>
                        )}
                        {chain && address && (
                          <AddressLink
                            hasENS={!!ENSName}
                            isENS={false}
                            href={getEtherscanLink(
                              chain.id as ChainId,
                              address,
                              "address"
                            )}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <LinkIcon size={16} />
                            <span style={{ marginLeft: "4px" }}>
                              View on {chain?.blockExplorers?.default?.name}
                            </span>
                          </AddressLink>
                        )}
                      </div>
                    </AccountControl>
                  </>
                )}
              </AccountGroupingRow>
            </InfoCard>
          </YourAccount>
        </AccountSection>
      </UpperSection>
      {!!pendingTransactions.length || !!confirmedTransactions.length ? (
        <LowerSection>
          <AutoRow mb={"1rem"} style={{ justifyContent: "space-between" }}>
            <TYPE.body>Recent Transactions</TYPE.body>
            <LinkStyledButton onClick={clearAllTransactionsCallback}>
              (clear all)
            </LinkStyledButton>
          </AutoRow>
          {renderTransactions(pendingTransactions)}
          {renderTransactions(confirmedTransactions)}
        </LowerSection>
      ) : (
        <LowerSection>
          <TYPE.body color={theme?.text1}>
            Your transactions will appear here...
          </TYPE.body>
        </LowerSection>
      )}
    </>
  )
}
