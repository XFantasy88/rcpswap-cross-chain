import { StepType } from "@/components/TransactionConfirmationModal"
import { UseTradeReturn } from "@rcpswap/router"
import { Type } from "rcpswap/currency"
import React, { FC, createContext, useContext, useMemo, useState } from "react"

interface State {
  mutate: {
    setShowConfirm: (state: boolean) => void
    setTradeToConfirm: (trade: any) => void
    setAttemptingTxn: (state: boolean) => void
    setSwapErrorMessage: (message: string | undefined) => void
    setSwapWarningMessage: (message: string | undefined) => void
    setTxHash: (hash: string | undefined) => void
    setSteps: (value: StepType[]) => void
    setCurrencyToAdd: (currency: Type | undefined) => void
  }
  state: {
    showConfirm: boolean
    tradeToConfirm: any
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    swapWarningMessage: string | undefined
    txHash: string | undefined
    steps: StepType[]
    currencyToAdd: Type | undefined
  }
}

const DerivedSwapTradeStateContext = createContext<State>({} as State)

interface DerivedSwapTradeStateProviderProps {
  children: React.ReactNode
}

const DerivedSwapTradeStateProvider: FC<DerivedSwapTradeStateProviderProps> = ({
  children,
}) => {
  const [steps, setSteps] = useState<StepType[]>([])
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [tradeToConfirm, setTradeToConfirm] = useState<any>()
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [swapErrorMessage, setSwapErrorMessage] = useState<string | undefined>()
  const [txHash, setTxHash] = useState<string | undefined>()
  const [swapWarningMessage, setSwapWarningMessage] = useState<
    string | undefined
  >()
  const [currencyToAdd, setCurrencyToAdd] = useState<Type | undefined>(
    undefined
  )

  return (
    <DerivedSwapTradeStateContext.Provider
      value={useMemo(
        () => ({
          mutate: {
            setShowConfirm,
            setTradeToConfirm,
            setAttemptingTxn,
            setSwapErrorMessage,
            setTxHash,
            setSteps,
            setSwapWarningMessage,
            setCurrencyToAdd,
          },
          state: {
            showConfirm,
            tradeToConfirm,
            attemptingTxn,
            swapErrorMessage,
            txHash,
            steps,
            swapWarningMessage,
            currencyToAdd,
          },
        }),
        [
          showConfirm,
          tradeToConfirm,
          attemptingTxn,
          swapErrorMessage,
          txHash,
          setShowConfirm,
          setTradeToConfirm,
          setAttemptingTxn,
          setSwapErrorMessage,
          setTxHash,
          steps,
          setSteps,
          swapWarningMessage,
          setSwapWarningMessage,
          currencyToAdd,
          setCurrencyToAdd,
        ]
      )}
    >
      {children}
    </DerivedSwapTradeStateContext.Provider>
  )
}

const useDerivedSwapTradeState = () => {
  const context = useContext(DerivedSwapTradeStateContext)
  if (!context) {
    throw new Error(
      "Hook can only be used inside Simple Swap Derived Trade State Context"
    )
  }

  return context
}

export { DerivedSwapTradeStateProvider, useDerivedSwapTradeState }
