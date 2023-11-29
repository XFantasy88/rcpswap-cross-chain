import React, { useCallback, useMemo } from "react"
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  StepType,
  TransactionErrorContent,
} from "../TransactionConfirmationModal"
import SwapModalFooter from "./SwapModalFooter"
import SwapModalHeader from "./SwapModalHeader"
import { Amount, Type } from "rcpswap/currency"
import { ChainId } from "rcpswap/chain"

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param tradeA trade A
 * @param tradeB trade B
 */
function tradeMeaningfullyDiffers(tradeA: any, tradeB: any): boolean {
  return (
    Boolean(
      tradeA.amountIn &&
        tradeB.amountIn &&
        (!tradeA.amountIn.currency.equals(tradeB.amountIn.currency) ||
          !tradeA.amountIn.equalTo(tradeB.amountIn))
    ) ||
    Boolean(
      tradeA.amountOut &&
        tradeB.amountOut &&
        (!tradeA.amountOut.currency.equals(tradeB.amountOut.currency) ||
          !tradeA.amountOut.equalTo(tradeB.amountOut))
    )
  )
}

export default function ConfirmSwapModal({
  trade,
  onAcceptChanges,
  originalTrade,
  onConfirm,
  onDismiss,
  recipient,
  swapErrorMessage,
  swapWarningMessage,
  isOpen,
  attemptingTxn,
  txHash,
  swapMode,
  isCross,
  steps,
  chainId,
  currencyToAdd,
}: {
  isOpen: boolean
  trade: any
  originalTrade: any
  attemptingTxn: boolean
  txHash: string | undefined
  recipient: string | undefined
  onAcceptChanges: () => void
  onConfirm: () => void
  swapErrorMessage: string | undefined
  onDismiss: () => void
  swapMode: number
  isCross: boolean
  steps: StepType[]
  swapWarningMessage?: string
  chainId?: ChainId
  currencyToAdd?: Type
}) {
  const successed =
    steps.length > 0 && steps[steps.length - 1].status === "success"

  const showAcceptChanges = useMemo(
    () =>
      Boolean(
        trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)
      ),
    [originalTrade, trade]
  )

  const modalHeader = useCallback(() => {
    return trade || swapMode === 1 ? (
      <SwapModalHeader
        trade={trade}
        isCross={isCross}
        recipient={recipient}
        showAcceptChanges={showAcceptChanges}
        onAcceptChanges={onAcceptChanges}
      />
    ) : null
  }, [onAcceptChanges, recipient, showAcceptChanges, trade])

  const modalBottom = useCallback(() => {
    return trade || swapMode === 1 ? (
      <SwapModalFooter
        onConfirm={onConfirm}
        trade={trade}
        swapMode={swapMode}
        disabledConfirm={showAcceptChanges}
        swapErrorMessage={swapErrorMessage}
      />
    ) : null
  }, [onConfirm, showAcceptChanges, swapErrorMessage, trade])

  // text to show while loading
  const pendingText = `${
    successed ? "Swapped" : `Swapping`
  } ${trade?.amountIn?.toSignificant(6)} ${
    trade?.amountIn?.currency.symbol
  } for ${trade?.amountOut
    ?.subtract(
      trade.feeAmount ?? Amount.fromRawAmount(trade.amountOut.currency, 0)
    )
    ?.toSignificant(6)} ${trade?.amountOut?.currency.symbol}`

  const confirmationContent = useCallback(() => {
    return swapErrorMessage ? (
      <TransactionErrorContent
        onDismiss={onDismiss}
        message={swapErrorMessage}
      />
    ) : (
      <ConfirmationModalContent
        title="Confirm Swap"
        onDismiss={onDismiss}
        topContent={modalHeader}
        bottomContent={modalBottom}
      />
    )
  }, [onDismiss, modalBottom, modalHeader, swapErrorMessage])

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
      currencyToAdd={currencyToAdd ?? trade?.amountOut?.currency}
      steps={steps}
      txWarning={swapWarningMessage}
      chainId={chainId}
    />
  )
}
