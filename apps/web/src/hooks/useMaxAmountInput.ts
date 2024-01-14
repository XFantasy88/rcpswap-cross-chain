import { useBalanceWeb3 } from "@rcpswap/wagmi"
import { ChainId } from "rcpswap/chain"
import { Amount, Type } from "rcpswap/currency"
import { parseEther } from "viem"

const feeAmount = {
  [ChainId.ARBITRUM_NOVA]: parseEther("0.0005"),
  [ChainId.POLYGON]: parseEther("0.25"),
  [ChainId.ARBITRUM_ONE]: parseEther("0.0005"),
  [ChainId.BSC]: parseEther("0.008"),
}

const useMaxAmountInput = ({
  account,
  currency,
  chainId,
}: {
  account: `0x${string}` | undefined
  currency: Type | undefined
  chainId: ChainId | undefined
}) => {
  const { data: maxAmountInput } = useBalanceWeb3({
    account,
    currency,
    chainId,
  })

  if (currency?.isNative && chainId) {
    const newMaxAmount = maxAmountInput?.subtract(
      Amount.fromRawAmount(currency, feeAmount[chainId])
    )
    return newMaxAmount?.greaterThan("0")
      ? newMaxAmount
      : Amount.fromRawAmount(currency, "0")
  }
  return maxAmountInput
}

export default useMaxAmountInput
