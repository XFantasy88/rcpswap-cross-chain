import { UseTradeReturn } from "@rcpswap/router"
import React, { FC, createContext, useContext, useMemo, useState } from "react"

interface State {
  mutate: {
    setShowConfirm: (state: boolean) => void
    setTradeToConfirm: (trade: any) => void
    setAttemptingTxn: (state: boolean) => void
    setSwapErrorMessage: (message: string | undefined) => void
    setTxHash: (hash: string | undefined) => void
  }
  state: {
    showConfirm: boolean
    tradeToConfirm: any
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }
}

const DerivedSwapTradeStateContext = createContext<State>({} as State)

interface DerivedSwapTradeStateProviderProps {
  children: React.ReactNode
}

const DerivedSwapTradeStateProvider: FC<DerivedSwapTradeStateProviderProps> = ({
  children,
}) => {
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [tradeToConfirm, setTradeToConfirm] = useState<any>()
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [swapErrorMessage, setSwapErrorMessage] = useState<string | undefined>()
  const [txHash, setTxHash] = useState<string | undefined>()

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
          },
          state: {
            showConfirm,
            tradeToConfirm,
            attemptingTxn,
            swapErrorMessage,
            txHash,
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
