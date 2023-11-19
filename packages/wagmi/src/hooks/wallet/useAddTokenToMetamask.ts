import { getCloudinaryImageLoader } from "../utils/getCloudinaryImageLoader"
import { Type } from "rcpswap/currency"
import { useCallback, useState, useMemo } from "react"
import { useWalletClient } from "wagmi"

export function useAddTokenToMetamask(currencyToAdd: Type | undefined): {
  addToken: () => void
  success: boolean | undefined
} {
  const { data: walletClient } = useWalletClient()

  const token = currencyToAdd?.wrapped

  const [success, setSuccess] = useState<boolean | undefined>()

  const image = useMemo(
    () =>
      getCloudinaryImageLoader({
        src: `tokens/${token?.chainId}/${token?.address}.jpg`,
        width: 40,
      }),
    [token]
  )

  const addToken = useCallback(() => {
    if (walletClient && token) {
      walletClient
        .watchAsset({
          type: "ERC20",
          options: {
            address: token.address,
            symbol: token.symbol ?? "",
            decimals: token.decimals,
            image,
          },
        })
        .then((success) => {
          setSuccess(success)
        })
        .catch(() => setSuccess(false))
    } else {
      setSuccess(false)
    }
  }, [walletClient, token])

  return { addToken, success }
}
