/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { ChainId } from "rcpswap/chain"
import { AiOutlineClose } from "react-icons/ai"
import {
  Connector,
  useAccount,
  useConnect,
  useNetwork,
  useSwitchNetwork,
} from "wagmi"

import usePrevious from "../../hooks/usePrevious"
import { ApplicationModal } from "../../state/application/actions"
import {
  useModalOpen,
  useWalletModalToggle,
} from "../../state/application/hooks"
import { StyledInternalLink } from "../../theme"
import { ButtonPrimary } from "../Button"
import AccountDetails from "../AccountDetails"

import Modal from "../Modal"
import Option from "./Option"
import PendingView from "./PendingView"
import { SUPPORTED_CONNECTORS } from "@/config"

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

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 100%;
`

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

const ContentWrapper = styled.div`
  background-color: ${({ theme }) => theme.bg2};
  padding: 2rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
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

const Blurb = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin: 1rem;
    font-size: 12px;
  `};
`

const OptionGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    grid-gap: 10px;
  `};
`

const HoverText = styled.div`
  &:hover {
    cursor: pointer;
  }
`

const WALLET_VIEWS = {
  OPTIONS: "options",
  OPTIONS_SECONDARY: "options_secondary",
  ACCOUNT: "account",
  PENDING: "pending",
}

export default function WalletModal({
  pendingTransactions,
  confirmedTransactions,
  ENSName,
}: {
  pendingTransactions: string[] // hashes of pending
  confirmedTransactions: string[] // hashes of confirmed
  ENSName?: string
}) {
  // important that these are destructed from the account-specific web3-react context

  const { address, connector, isConnected: active } = useAccount()
  const { connectors, connectAsync } = useConnect()
  const { chain } = useNetwork()
  const { switchNetworkAsync } = useSwitchNetwork()

  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)

  const [pendingWallet, setPendingWallet] = useState<
    Connector<any, any> | undefined
  >()

  const [pendingError, setPendingError] = useState<boolean>()

  const walletModalOpen = useModalOpen(ApplicationModal.WALLET)
  const toggleWalletModal = useWalletModalToggle()

  const previousAccount = usePrevious(address)

  // close on connection, when logged out before
  useEffect(() => {
    if (address && !previousAccount && walletModalOpen) {
      toggleWalletModal()
    }
  }, [address, previousAccount, toggleWalletModal, walletModalOpen])

  // always reset to account view
  useEffect(() => {
    if (walletModalOpen) {
      setPendingError(false)
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [walletModalOpen])

  // close modal when a connection is successful
  const activePrevious = usePrevious(active)
  const connectorPrevious = usePrevious(connector)
  useEffect(() => {
    if (
      walletModalOpen &&
      ((active && !activePrevious) ||
        (connector && connector !== connectorPrevious))
    ) {
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [
    setWalletView,
    active,
    // error,
    connector,
    walletModalOpen,
    activePrevious,
    connectorPrevious,
  ])

  const tryActivation = async (connector: Connector<any, any> | undefined) => {
    setPendingWallet(connector) // set wallet for pending view
    setWalletView(WALLET_VIEWS.PENDING)

    connector &&
      connectAsync({ connector }).catch((error) => {
        console.log(error)
        setPendingError(true)
      })
  }

  // get wallets user can switch too, depending on device/browser
  function getOptions() {
    return connectors.map((item) => {
      return (
        <Option
          onClick={() => {
            tryActivation(item)
          }}
          id={`connect-${item.id}`}
          key={item.id}
          active={connector === item}
          color={SUPPORTED_CONNECTORS[item.id].color}
          link={SUPPORTED_CONNECTORS[item.id].href}
          header={item.name}
          subheader={null}
          icon={SUPPORTED_CONNECTORS[item.id].image}
        ></Option>
      )
    })
  }

  function getModalContent() {
    if (chain?.unsupported) {
      return (
        <UpperSection>
          <CloseIcon onClick={toggleWalletModal}>
            <CloseColor />
          </CloseIcon>
          <HeaderRow>Wrong Network</HeaderRow>
          <ContentWrapper>
            <ButtonPrimary
              onClick={() => switchNetworkAsync?.(ChainId.ARBITRUM_NOVA)}
              padding="8px"
              borderRadius="8px"
            >
              Click here to connect to Arbitrum Nova
            </ButtonPrimary>
          </ContentWrapper>
        </UpperSection>
      )
    }
    if (address && walletView === WALLET_VIEWS.ACCOUNT) {
      return (
        <AccountDetails
          toggleWalletModal={toggleWalletModal}
          pendingTransactions={pendingTransactions}
          confirmedTransactions={confirmedTransactions}
          ENSName={ENSName}
          openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
        />
      )
    }
    return (
      <UpperSection>
        <CloseIcon onClick={toggleWalletModal}>
          <CloseColor />
        </CloseIcon>
        {walletView !== WALLET_VIEWS.ACCOUNT ? (
          <HeaderRow color="blue">
            <HoverText
              onClick={() => {
                setPendingError(false)
                setWalletView(WALLET_VIEWS.ACCOUNT)
              }}
            >
              Back
            </HoverText>
          </HeaderRow>
        ) : (
          <HeaderRow>
            <HoverText>Connect to a wallet</HoverText>
          </HeaderRow>
        )}
        <ContentWrapper>
          {walletView === WALLET_VIEWS.PENDING ? (
            <PendingView
              connector={pendingWallet}
              error={pendingError}
              setPendingError={setPendingError}
              tryActivation={tryActivation}
            />
          ) : (
            <OptionGrid>{getOptions()}</OptionGrid>
          )}
          {walletView !== WALLET_VIEWS.PENDING && (
            <Blurb>
              <span>New? &nbsp;</span>{" "}
              <StyledInternalLink
                href="https://nova.arbitrum.io/"
                target="_blank"
                rel="noreferrer"
              >
                Learn more about Nova
              </StyledInternalLink>
            </Blurb>
          )}
        </ContentWrapper>
      </UpperSection>
    )
  }

  return (
    <Modal
      isOpen={walletModalOpen}
      onDismiss={toggleWalletModal}
      minHeight={false}
      maxHeight={90}
    >
      <Wrapper>{getModalContent()}</Wrapper>
    </Modal>
  )
}
