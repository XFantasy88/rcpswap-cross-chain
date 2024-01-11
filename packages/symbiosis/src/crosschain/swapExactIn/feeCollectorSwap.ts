import { AddressZero } from "@ethersproject/constants"
import { BigNumber, BytesLike } from "ethers"
import { ChainId } from "../../constants"
import { TokenAmount } from "../../entities"
import { onchainSwap } from "./onchainSwap"
import { SwapExactInParams, SwapExactInResult } from "./types"
import { FeeCollector__factory } from "../contracts"
import { preparePayload } from "./preparePayload"
import { getFunctionSelector } from "../tron"

const FEE_COLLECTOR_ADDRESES: Partial<Record<ChainId, string>> = {
  [ChainId.MATIC_MAINNET]: "0x9d74807B8fA79d49bb95CF988Af3c25Fb1437B4f",
  [ChainId.ARBITRUM_NOVA]: "0x7B4E28E7273aA8CB64C56fF191ebF43b64f409F9",
  [ChainId.BOBA_BNB]: "0x7e0B73141c8a1AC26B8693e9F34cf42BE17Fea2C",
  [ChainId.ARBITRUM_ONE]: "0x4FDA0599b78a49d289577a8DF2046459abC04d82",
}

export function isFeeCollectorSwapSupported(
  params: SwapExactInParams
): boolean {
  const inChainId = params.inTokenAmount.token.chainId
  const outChainId = params.outToken.chainId

  return (
    inChainId === outChainId && FEE_COLLECTOR_ADDRESES[inChainId] !== undefined
  )
}

export async function feeCollectorSwap(
  params: SwapExactInParams
): Promise<SwapExactInResult> {
  const { symbiosis } = params

  const inChainId = params.inTokenAmount.token.chainId

  const feeCollectorAddress = FEE_COLLECTOR_ADDRESES[inChainId]
  if (!feeCollectorAddress) {
    throw new Error(`Fee collector not found for chain ${inChainId}`)
  }

  const provider = symbiosis.getProvider(inChainId)
  const contract = FeeCollector__factory.connect(feeCollectorAddress, provider)

  // TODO: Multicall
  const fee: BigNumber = await contract.callStatic.fee()
  const approveAddress: string = await contract.callStatic.onchainGateway()

  let inTokenAmount = params.inTokenAmount
  if (inTokenAmount.token.isNative) {
    const feeTokenAmount = new TokenAmount(inTokenAmount.token, fee.toString())
    if (inTokenAmount.lessThan(feeTokenAmount)) {
      throw new Error(
        `Amount is too low. Min amount: ${feeTokenAmount.toSignificant()}`
      )
    }

    inTokenAmount = inTokenAmount.subtract(feeTokenAmount)
  }

  // Get onchain swap transaction what will be executed by fee collector
  const result = await onchainSwap({
    ...params,
    inTokenAmount,
    fromAddress: feeCollectorAddress,
  })

  let value = result.transactionRequest.value?.toString() as string
  let callData = result.transactionRequest.data as BytesLike
  let routerAddress = result.transactionRequest.to as string

  if (inTokenAmount.token.isNative) {
    /**
     * To maintain consistency with any potential fees charged by the aggregator,
     * we calculate the total value by adding the fee to the value obtained from the aggregator.
     */
    value = BigNumber.from(value).add(fee).toString()
  } else {
    value = fee.toString()
  }

  callData = contract.interface.encodeFunctionData("onswap", [
    inTokenAmount.token.isNative ? AddressZero : inTokenAmount.token.address,
    inTokenAmount.raw.toString(),
    routerAddress,
    inTokenAmount.token.isNative ? AddressZero : result.approveTo,
    callData,
  ])

  const functionSelector = getFunctionSelector(
    contract.interface.getFunction("onswap")
  )

  const payload = preparePayload({
    functionSelector,
    chainId: inChainId,
    fromAddress: params.fromAddress,
    toAddress: feeCollectorAddress,
    value,
    callData,
  })

  return {
    ...result,
    ...payload,
    approveTo: approveAddress,
  }
}
