import React, { useContext, useMemo } from "react"
import Image from "next/image"
import { Flex, Text } from "rebass"
import styled, { ThemeContext } from "styled-components"
import { ChainId } from "rcpswap/chain"
import { Type } from "rcpswap/currency"
import {
  getEtherscanLink,
  getExplorerName,
  useAccount,
  useConnect,
  useNetwork,
  useWalletClient,
} from "@rcpswap/wagmi"
import { useAddTokenToMetamask } from "@rcpswap/wagmi"

import Modal from "../Modal"
import { StyledInternalLink } from "@/theme"
import { CloseIcon, CustomLightSpinner } from "@/theme/components"
import Row, { RowBetween, RowFixed, RowFlat } from "../Row"
import {
  FiAlertTriangle,
  FiArrowUpCircle,
  FiCheckCircle,
  FiExternalLink,
} from "react-icons/fi"
import { RxDotFilled } from "react-icons/rx"
import { ButtonPrimary, ButtonLight } from "../Button"
import Column, { AutoColumn, ColumnCenter } from "../Column"

import Circle from "@/assets/images/blue-loader.svg"
import MetaMaskLogo from "@/assets/images/wallets/metamask.svg"
import Loader from "../Loader"
import Link from "next/link"
import CircleProgressBar from "../CircleProgressBar"

const Wrapper = styled.div`
  width: 100%;
`
const Section = styled(AutoColumn)`
  padding: 24px;
`

const PendingHeaderSection = styled(AutoColumn)`
  padding: 24px;
  background-color: ${({ theme }) => theme.bg2};
`

const BottomSection = styled(Section)`
  background-color: ${({ theme }) => theme.bg2};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 20px 0;
`

const StyledLogo = styled(Image)`
  height: 16px;
  width: 16px;
  margin-left: 6px;
`

export type StepType = {
  title: string
  desc: string
  link?: string
  status?: "success" | "failed" | "pending"
  totalRounds?: number
  currentRounds?: number
}

function ConfirmationPendingContent({
  onDismiss,
  pendingText,
  steps,
}: {
  onDismiss: () => void
  pendingText: string
  steps: StepType[]
}) {
  const theme = useContext(ThemeContext)

  return (
    <Wrapper>
      <PendingHeaderSection>
        <RowBetween>
          <div />
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <AutoColumn gap="12px">
          <Text fontWeight={500} fontSize={24}>
            Waiting For Confirmation
          </Text>
          <AutoColumn gap="12px">
            <Text fontWeight={500} fontSize={14} color={theme?.text2}>
              {pendingText}
            </Text>
          </AutoColumn>
        </AutoColumn>
      </PendingHeaderSection>
      <Section>
        <Text>Swapping...</Text>
        {steps.map((step, i) => (
          <RowBetween key={i} align="start" marginTop={"24px"}>
            <Flex marginRight={"8px"} marginTop={"2px"} minWidth={"16px"}>
              {step.status === "pending" ? (
                <Loader />
              ) : step.status === "success" ? (
                <FiCheckCircle size={"16px"} stroke={theme?.green1} />
              ) : step.status === "failed" ? (
                <FiAlertTriangle size={"16px"} stroke={theme?.red2} />
              ) : (
                <RxDotFilled size={"16px"} stroke={theme?.text3} />
              )}
            </Flex>

            <Column style={{ width: "100%" }}>
              <Text>{step.title}</Text>
              {step.status && (
                <Text color={theme?.text3} marginTop={"4px"} fontSize={"90%"}>
                  {step.desc}{" "}
                  {step?.link && (
                    <Link href={step.link} target="_blank" rel="noreferrer">
                      <FiExternalLink stroke={theme?.text3} />
                    </Link>
                  )}
                </Text>
              )}
            </Column>
            {step.status &&
              step.currentRounds !== undefined &&
              step.totalRounds !== undefined && (
                <CircleProgressBar
                  current={step.currentRounds}
                  total={step.totalRounds}
                />
              )}
          </RowBetween>
        ))}
      </Section>
    </Wrapper>
  )
}

function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
  currencyToAdd,
}: {
  onDismiss: () => void
  hash: string | undefined
  chainId: ChainId
  currencyToAdd?: Type | undefined
}) {
  const theme = useContext(ThemeContext)
  const { data: walletClient } = useWalletClient()
  const { addToken, success } = useAddTokenToMetamask(currencyToAdd)
  const { connector } = useAccount()

  const explorerName = useMemo(() => getExplorerName(chainId), [chainId])

  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <div />
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <ConfirmedIcon>
          <FiArrowUpCircle
            strokeWidth={0.5}
            size={90}
            color={theme?.primary1}
          />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify={"center"}>
          <Text fontWeight={500} fontSize={20}>
            Transaction Submitted
          </Text>
          {chainId && hash && (
            <StyledInternalLink
              href={getEtherscanLink(chainId, hash, "transaction")}
              target="_blank"
              rel="noreferrer"
            >
              <Text fontWeight={500} fontSize={14} color={theme?.primary1}>
                View on {explorerName}
              </Text>
            </StyledInternalLink>
          )}
          {currencyToAdd &&
            (connector?.id === "metaMask" || connector?.id === "injected") && (
              <ButtonLight
                mt="12px"
                padding="6px 12px"
                width="fit-content"
                onClick={addToken}
              >
                {!success ? (
                  <RowFixed>
                    Add {currencyToAdd?.wrapped?.symbol} to Metamask{" "}
                    <StyledLogo
                      src={MetaMaskLogo.src}
                      width={MetaMaskLogo.width}
                      height={MetaMaskLogo.height}
                      alt="metamask"
                    />
                  </RowFixed>
                ) : (
                  <RowFixed>
                    Added {currencyToAdd?.wrapped?.symbol}{" "}
                    <FiCheckCircle
                      size={"16px"}
                      stroke={theme?.green1}
                      style={{ marginLeft: "6px" }}
                    />
                  </RowFixed>
                )}
              </ButtonLight>
            )}
          <ButtonPrimary onClick={onDismiss} style={{ margin: "20px 0 0 0" }}>
            <Text fontWeight={500} fontSize={20}>
              Close
            </Text>
          </ButtonPrimary>
        </AutoColumn>
      </Section>
    </Wrapper>
  )
}

export function ConfirmationModalContent({
  title,
  bottomContent,
  onDismiss,
  topContent,
}: {
  title: string
  onDismiss: () => void
  topContent: () => React.ReactNode
  bottomContent: () => React.ReactNode
}) {
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <Text fontWeight={500} fontSize={20}>
            {title}
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        {topContent()}
      </Section>
      <BottomSection gap="12px">{bottomContent()}</BottomSection>
    </Wrapper>
  )
}

export function TransactionErrorContent({
  message,
  onDismiss,
}: {
  message: string
  onDismiss: () => void
}) {
  const theme = useContext(ThemeContext)

  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <Text fontWeight={500} fontSize={20}>
            Error
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
            color={theme?.red1}
            style={{
              textAlign: "center",
              width: "85%",
              overflowX: "hidden",
              wordBreak: "break-all",
              maxHeight: "200px",
            }}
          >
            {message}
          </Text>
        </AutoColumn>
      </Section>
      <BottomSection gap="12px">
        <ButtonPrimary onClick={onDismiss}>Dismiss</ButtonPrimary>
      </BottomSection>
    </Wrapper>
  )
}

interface ConfirmationModalProps {
  isOpen: boolean
  onDismiss: () => void
  hash: string | undefined
  content: () => React.ReactNode
  attemptingTxn: boolean
  pendingText: string
  steps: StepType[]
  currencyToAdd?: Type | undefined
}

export default function TransactionConfirmationModal({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  content,
  currencyToAdd,
  steps,
}: ConfirmationModalProps) {
  // const { chainId } = useActiveWeb3React()
  const chainId = useNetwork().chain?.id

  if (!chainId) return null

  // confirmation screen
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90}>
      {attemptingTxn ? (
        <ConfirmationPendingContent
          onDismiss={onDismiss}
          pendingText={pendingText}
          steps={steps}
        />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId as ChainId}
          hash={hash}
          onDismiss={onDismiss}
          currencyToAdd={currencyToAdd}
        />
      ) : (
        content()
      )}
    </Modal>
  )
}
