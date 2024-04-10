/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
    BaseContract,
    BigNumber,
    BigNumberish,
    BytesLike,
    CallOverrides,
    ContractTransaction,
    Overrides,
    PopulatedTransaction,
    Signer,
    utils,
} from 'ethers'
import { FunctionFragment, Result } from '@ethersproject/abi'
import { Listener, Provider } from '@ethersproject/providers'
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from './common'

export declare namespace IQuoterV2 {
    export type QuoteExactInputSingleParamsStruct = {
        tokenIn: string
        tokenOut: string
        amountIn: BigNumberish
        fee: BigNumberish
        sqrtPriceLimitX96: BigNumberish
    }

    export type QuoteExactInputSingleParamsStructOutput = [string, string, BigNumber, number, BigNumber] & {
        tokenIn: string
        tokenOut: string
        amountIn: BigNumber
        fee: number
        sqrtPriceLimitX96: BigNumber
    }

    export type QuoteExactOutputSingleParamsStruct = {
        tokenIn: string
        tokenOut: string
        amount: BigNumberish
        fee: BigNumberish
        sqrtPriceLimitX96: BigNumberish
    }

    export type QuoteExactOutputSingleParamsStructOutput = [string, string, BigNumber, number, BigNumber] & {
        tokenIn: string
        tokenOut: string
        amount: BigNumber
        fee: number
        sqrtPriceLimitX96: BigNumber
    }
}

export interface UniV3QuoterInterface extends utils.Interface {
    contractName: 'UniV3Quoter'
    functions: {
        'WETH9()': FunctionFragment
        'factory()': FunctionFragment
        'quoteExactInput(bytes,uint256)': FunctionFragment
        'quoteExactInputSingle((address,address,uint256,uint24,uint160))': FunctionFragment
        'quoteExactOutput(bytes,uint256)': FunctionFragment
        'quoteExactOutputSingle((address,address,uint256,uint24,uint160))': FunctionFragment
        'uniswapV3SwapCallback(int256,int256,bytes)': FunctionFragment
    }

    encodeFunctionData(functionFragment: 'WETH9', values?: undefined): string
    encodeFunctionData(functionFragment: 'factory', values?: undefined): string
    encodeFunctionData(functionFragment: 'quoteExactInput', values: [BytesLike, BigNumberish]): string
    encodeFunctionData(
        functionFragment: 'quoteExactInputSingle',
        values: [IQuoterV2.QuoteExactInputSingleParamsStruct]
    ): string
    encodeFunctionData(functionFragment: 'quoteExactOutput', values: [BytesLike, BigNumberish]): string
    encodeFunctionData(
        functionFragment: 'quoteExactOutputSingle',
        values: [IQuoterV2.QuoteExactOutputSingleParamsStruct]
    ): string
    encodeFunctionData(
        functionFragment: 'uniswapV3SwapCallback',
        values: [BigNumberish, BigNumberish, BytesLike]
    ): string

    decodeFunctionResult(functionFragment: 'WETH9', data: BytesLike): Result
    decodeFunctionResult(functionFragment: 'factory', data: BytesLike): Result
    decodeFunctionResult(functionFragment: 'quoteExactInput', data: BytesLike): Result
    decodeFunctionResult(functionFragment: 'quoteExactInputSingle', data: BytesLike): Result
    decodeFunctionResult(functionFragment: 'quoteExactOutput', data: BytesLike): Result
    decodeFunctionResult(functionFragment: 'quoteExactOutputSingle', data: BytesLike): Result
    decodeFunctionResult(functionFragment: 'uniswapV3SwapCallback', data: BytesLike): Result

    events: {}
}

export interface UniV3Quoter extends BaseContract {
    contractName: 'UniV3Quoter'
    connect(signerOrProvider: Signer | Provider | string): this
    attach(addressOrName: string): this
    deployed(): Promise<this>

    interface: UniV3QuoterInterface

    queryFilter<TEvent extends TypedEvent>(
        event: TypedEventFilter<TEvent>,
        fromBlockOrBlockhash?: string | number | undefined,
        toBlock?: string | number | undefined
    ): Promise<Array<TEvent>>

    listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>
    listeners(eventName?: string): Array<Listener>
    removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this
    removeAllListeners(eventName?: string): this
    off: OnEvent<this>
    on: OnEvent<this>
    once: OnEvent<this>
    removeListener: OnEvent<this>

    functions: {
        WETH9(overrides?: CallOverrides): Promise<[string]>

        factory(overrides?: CallOverrides): Promise<[string]>

        quoteExactInput(
            path: BytesLike,
            amountIn: BigNumberish,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<ContractTransaction>

        quoteExactInputSingle(
            params: IQuoterV2.QuoteExactInputSingleParamsStruct,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<ContractTransaction>

        quoteExactOutput(
            path: BytesLike,
            amountOut: BigNumberish,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<ContractTransaction>

        quoteExactOutputSingle(
            params: IQuoterV2.QuoteExactOutputSingleParamsStruct,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<ContractTransaction>

        uniswapV3SwapCallback(
            amount0Delta: BigNumberish,
            amount1Delta: BigNumberish,
            path: BytesLike,
            overrides?: CallOverrides
        ): Promise<[void]>
    }

    WETH9(overrides?: CallOverrides): Promise<string>

    factory(overrides?: CallOverrides): Promise<string>

    quoteExactInput(
        path: BytesLike,
        amountIn: BigNumberish,
        overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    quoteExactInputSingle(
        params: IQuoterV2.QuoteExactInputSingleParamsStruct,
        overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    quoteExactOutput(
        path: BytesLike,
        amountOut: BigNumberish,
        overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    quoteExactOutputSingle(
        params: IQuoterV2.QuoteExactOutputSingleParamsStruct,
        overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    uniswapV3SwapCallback(
        amount0Delta: BigNumberish,
        amount1Delta: BigNumberish,
        path: BytesLike,
        overrides?: CallOverrides
    ): Promise<void>

    callStatic: {
        WETH9(overrides?: CallOverrides): Promise<string>

        factory(overrides?: CallOverrides): Promise<string>

        quoteExactInput(
            path: BytesLike,
            amountIn: BigNumberish,
            overrides?: CallOverrides
        ): Promise<
            [BigNumber, BigNumber[], number[], BigNumber] & {
                amountOut: BigNumber
                sqrtPriceX96AfterList: BigNumber[]
                initializedTicksCrossedList: number[]
                gasEstimate: BigNumber
            }
        >

        quoteExactInputSingle(
            params: IQuoterV2.QuoteExactInputSingleParamsStruct,
            overrides?: CallOverrides
        ): Promise<
            [BigNumber, BigNumber, number, BigNumber] & {
                amountOut: BigNumber
                sqrtPriceX96After: BigNumber
                initializedTicksCrossed: number
                gasEstimate: BigNumber
            }
        >

        quoteExactOutput(
            path: BytesLike,
            amountOut: BigNumberish,
            overrides?: CallOverrides
        ): Promise<
            [BigNumber, BigNumber[], number[], BigNumber] & {
                amountIn: BigNumber
                sqrtPriceX96AfterList: BigNumber[]
                initializedTicksCrossedList: number[]
                gasEstimate: BigNumber
            }
        >

        quoteExactOutputSingle(
            params: IQuoterV2.QuoteExactOutputSingleParamsStruct,
            overrides?: CallOverrides
        ): Promise<
            [BigNumber, BigNumber, number, BigNumber] & {
                amountIn: BigNumber
                sqrtPriceX96After: BigNumber
                initializedTicksCrossed: number
                gasEstimate: BigNumber
            }
        >

        uniswapV3SwapCallback(
            amount0Delta: BigNumberish,
            amount1Delta: BigNumberish,
            path: BytesLike,
            overrides?: CallOverrides
        ): Promise<void>
    }

    filters: {}

    estimateGas: {
        WETH9(overrides?: CallOverrides): Promise<BigNumber>

        factory(overrides?: CallOverrides): Promise<BigNumber>

        quoteExactInput(
            path: BytesLike,
            amountIn: BigNumberish,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<BigNumber>

        quoteExactInputSingle(
            params: IQuoterV2.QuoteExactInputSingleParamsStruct,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<BigNumber>

        quoteExactOutput(
            path: BytesLike,
            amountOut: BigNumberish,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<BigNumber>

        quoteExactOutputSingle(
            params: IQuoterV2.QuoteExactOutputSingleParamsStruct,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<BigNumber>

        uniswapV3SwapCallback(
            amount0Delta: BigNumberish,
            amount1Delta: BigNumberish,
            path: BytesLike,
            overrides?: CallOverrides
        ): Promise<BigNumber>
    }

    populateTransaction: {
        WETH9(overrides?: CallOverrides): Promise<PopulatedTransaction>

        factory(overrides?: CallOverrides): Promise<PopulatedTransaction>

        quoteExactInput(
            path: BytesLike,
            amountIn: BigNumberish,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<PopulatedTransaction>

        quoteExactInputSingle(
            params: IQuoterV2.QuoteExactInputSingleParamsStruct,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<PopulatedTransaction>

        quoteExactOutput(
            path: BytesLike,
            amountOut: BigNumberish,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<PopulatedTransaction>

        quoteExactOutputSingle(
            params: IQuoterV2.QuoteExactOutputSingleParamsStruct,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<PopulatedTransaction>

        uniswapV3SwapCallback(
            amount0Delta: BigNumberish,
            amount1Delta: BigNumberish,
            path: BytesLike,
            overrides?: CallOverrides
        ): Promise<PopulatedTransaction>
    }
}
