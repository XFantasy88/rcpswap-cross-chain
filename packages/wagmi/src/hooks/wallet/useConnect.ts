'use client'

import {
  useConnect as useWagmiConnect,
} from 'wagmi'

export const useConnect: typeof useWagmiConnect = (props) => {
  return useWagmiConnect({
    ...props
  })
}
