"use client"

import { useDebounce, useSlippageTolerance } from "@rcpswap/hooks"
import { Address, useAccount, useClientTrade, useFeeData } from "@rcpswap/wagmi"
import {
  Symbiosis,
  TokenAmount as SymbiosisTokenAmount,
  Token as SymbiosisToken,
  ErrorCode,
} from "@rcpswap/symbiosis"
import {
  FC,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import { ChainId } from "rcpswap/chain"
import {
  Amount,
  Native,
  Price,
  Token,
  Type,
  tryParseAmount,
} from "rcpswap/currency"
import { Percent, ZERO } from "rcpswap/math"
import { LiquidityProviders } from "@rcpswap/router"
import { useQuery } from "@tanstack/react-query"
import {
  convertAmountFromSymbiosis,
  convertAmountToSymbiosis,
  convertTokenToSymbiosis,
} from "@/utils"

interface State {
  mutate: {
    setChainId0(chainId: ChainId): void
    setChainId1(chainId: ChainId): void
    setToken0(token0: Type | undefined): void
    setToken1(token1: Type | undefined): void
    setSwapAmount(swapAmount: string): void
    switchTokens(amount?: string): void
    switchSwapMode(): void
    setRecipient(address: string | undefined): void
    setUltraMode(mode: boolean): void
    setSwapSlidePercentage: (value: number) => void
  }
  state: {
    token0: Type | undefined
    token1: Type | undefined
    chainId0: ChainId
    chainId1: ChainId
    swapAmount: string | undefined
    recipient: string | undefined
    swapMode: number
    ultraMode: boolean
    swapSlidePercentage: number
  }
}

const DerivedSwapStateContext = createContext<State>({} as State)

interface DerivedSwapStateProviderProps {
  children: React.ReactNode
}

const DerivedSwapStateProvider: FC<DerivedSwapStateProviderProps> = ({
  children,
}) => {
  const { address } = useAccount()

  const [chainId0, setChainId0] = useState<ChainId>(ChainId.ARBITRUM_NOVA)
  const [chainId1, setChainId1] = useState<ChainId>(ChainId.ARBITRUM_NOVA)
  const [swapMode, setSwapMode] = useState(1)
  const [swapAmount, setSwapAmount] = useState<string | undefined>()
  const [token0, setToken0] = useState<Type | undefined>(
    Native.onChain(ChainId.ARBITRUM_NOVA)
  )
  const [token1, setToken1] = useState<Type | undefined>()
  const [recipient, setRecipient] = useState<string | undefined>()
  const [ultraMode, setUltraMode] = useState(false)
  const [swapSlidePercentage, setSwapSlidePercentage] = useState(0)

  const _setChainId0 = useCallback<{ (_chainId: ChainId): void }>(
    (chainId) => {
      setChainId0(chainId)
      setToken0(undefined)
    },
    [setChainId0, setToken0]
  )

  const _setChainId1 = useCallback<{ (_chainId: ChainId): void }>(
    (chainId) => {
      setChainId1(chainId)
      setToken1(undefined)
    },
    [setChainId1, setToken1]
  )

  const _switchToken = useCallback(
    (amount?: string) => {
      const data = {
        chainId0,
        chainId1,
        token0,
        token1,
      }

      setChainId0(data.chainId1)
      setChainId1(data.chainId0)
      setToken0(data.token1)
      setToken1(data.token0)
      setSwapAmount(amount)
    },
    [
      chainId0,
      chainId1,
      token0,
      token1,
      setChainId0,
      setChainId1,
      setToken0,
      setToken1,
      setSwapAmount,
    ]
  )

  const _setToken0 = useCallback<{ (_token: Type | undefined): void }>(
    (_token) => {
      if (chainId0 === chainId1 && _token && _token === token1) {
        setToken1(token0)
      }
      setToken0(_token)
    },
    [chainId0, chainId1, token1, setToken0]
  )

  const _setToken1 = useCallback<{ (_token: Type | undefined): void }>(
    (_token) => {
      if (chainId0 === chainId1 && _token && _token === token0) {
        setToken0(token1)
      }
      setToken1(_token)
    },
    [chainId0, chainId1, token0, setToken1]
  )

  const _setSwapAmount = useCallback<{ (value: string): void }>(
    (value) => {
      setSwapAmount(value)
    },
    [setSwapAmount, swapAmount]
  )

  const _switchSwapMode = useCallback<{ (): void }>(() => {
    setSwapMode(1 - swapMode)
    setChainId0(ChainId.ARBITRUM_NOVA)
    setChainId1(ChainId.ARBITRUM_NOVA)
    setToken0(undefined)
    setToken1(undefined)
    setSwapAmount("")
  }, [
    setSwapAmount,
    swapMode,
    setChainId0,
    setChainId1,
    setToken0,
    setToken1,
    setSwapAmount,
  ])

  return (
    <DerivedSwapStateContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setChainId0: _setChainId0,
            setChainId1: _setChainId1,
            setToken0: _setToken0,
            setToken1: _setToken1,
            switchTokens: _switchToken,
            setSwapAmount: _setSwapAmount,
            switchSwapMode: _switchSwapMode,
            setRecipient,
            setUltraMode,
            setSwapSlidePercentage,
          },
          state: {
            recipient,
            chainId0,
            chainId1,
            swapAmount,
            token0: token0,
            token1: token1,
            swapMode,
            ultraMode,
            swapSlidePercentage,
          },
        }
      }, [
        address,
        _setChainId0,
        _setChainId1,
        _setToken0,
        _setToken1,
        _switchToken,
        _setSwapAmount,
        _switchSwapMode,
        setRecipient,
        recipient,
        token0,
        token1,
        swapAmount,
        swapSlidePercentage,
        setSwapSlidePercentage,
        ultraMode,
        setUltraMode,
      ])}
    >
      {children}
    </DerivedSwapStateContext.Provider>
  )
}

const useDerivedSwapState = () => {
  const context = useContext(DerivedSwapStateContext)
  if (!context) {
    throw new Error(
      "Hook can only be used inside Simple Swap Derived State Context"
    )
  }

  return context
}

const useSwapTrade = () => {
  const {
    state: {
      token0,
      chainId0,
      chainId1,
      swapAmount,
      token1,
      recipient,
      swapMode,
      ultraMode,
    },
  } = useDerivedSwapState()

  const { address } = useAccount()

  const parsedAmount = useDebounce(tryParseAmount(swapAmount, token0), 200)

  const [slippageTolerance] = useSlippageTolerance()

  const clientTrade = useClientTrade({
    chainId: chainId0,
    fromToken: token0,
    toToken: token1,
    amount: parsedAmount,
    slippagePercentage: slippageTolerance === "AUTO" ? "50" : slippageTolerance,
    recipient: (recipient ?? address) as Address,
    feeEnabled: swapMode === 1,
    providers: swapMode === 0 ? [LiquidityProviders.RCPSwap] : undefined,
    maxFlowNumber: swapMode === 0 ? 1 : ultraMode ? 1500 : 100,
    enabled: Boolean(parsedAmount?.greaterThan(ZERO) && chainId0 === chainId1),
  })

  return clientTrade
}

const symbiosis = new Symbiosis("mainnet", "rcpswap-cross-chain")

const useSymbiosisTrade = () => {
  const {
    state: {
      token0,
      chainId0,
      chainId1,
      swapAmount,
      token1,
      recipient,
      swapMode,
      ultraMode,
    },
  } = useDerivedSwapState()

  const [allowedSlippage] = useSlippageTolerance()

  const { address } = useAccount()

  const parsedAmount = useDebounce(tryParseAmount(swapAmount, token0), 200)

  return useQuery({
    queryKey: [
      "symbosis-swap",
      address,
      token0,
      token1,
      parsedAmount,
      recipient,
      allowedSlippage,
      ultraMode,
    ],
    queryFn: async () => {
      if (!token0 || !token1 || !parsedAmount) {
        return {
          priceImpact: undefined,
          amountIn: undefined,
          amountOut: undefined,
          fee: undefined,
          minAmountOut: undefined,
          transaction: undefined,
          symbiosis: undefined,
        }
      }
      console.log("fetching.........")
      const symbiosisSwapping = symbiosis.bestPoolSwapping()

      const res = await symbiosisSwapping.exactIn({
        tokenAmountIn: convertAmountToSymbiosis(parsedAmount),
        tokenOut: convertTokenToSymbiosis(token1),
        from: address ?? "0xd52c556ecbd260cf3bf5b78f3f94d6878939adf7",
        to:
          recipient ?? address ?? "0xd52c556ecbd260cf3bf5b78f3f94d6878939adf7",
        deadline: Math.floor(Date.now() / 1e3) + 604800,
        slippage: +allowedSlippage * 100,
        maxDepth: ultraMode ? 1000 : 100,
      })

      console.log(
        (res?.tokenAmountOutMin as SymbiosisTokenAmount)?.raw?.toString()
      )
      const amountOut = Amount.fromRawAmount(
        token1,
        (res?.tokenAmountOut as SymbiosisTokenAmount)?.raw?.toString() ?? "0"
      )

      const result = {
        swapPrice: new Price({
          baseAmount: parsedAmount,
          quoteAmount: amountOut,
        }),
        priceImpact: new Percent(
          res?.priceImpact?.numerator?.toString() ?? 0,
          res?.priceImpact?.denominator?.toString() ?? 100
        ),
        amountIn: parsedAmount,
        amountOut,
        minAmountOut: Amount.fromRawAmount(
          token1,
          (res?.tokenAmountOutMin as SymbiosisTokenAmount)?.raw?.toString() ??
            "0"
        ),
        fee:
          res.fee && res.fee instanceof SymbiosisTokenAmount
            ? convertAmountFromSymbiosis(res.fee)
            : undefined,
        transaction: res?.transactionRequest,
        symbiosis: symbiosisSwapping,
      }
      return result
    },
    retry: false,
    enabled: Boolean(parsedAmount?.greaterThan(ZERO) && chainId0 !== chainId1),
    refetchInterval: 25000,
    refetchOnWindowFocus: false,
  })
}

export {
  DerivedSwapStateProvider,
  useDerivedSwapState,
  useSwapTrade,
  useSymbiosisTrade,
}
