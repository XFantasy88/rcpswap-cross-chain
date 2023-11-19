import { StaticImageData } from "next/image"
import { ChainId } from "rcpswap/chain"

import MetamaskIcon from "@/assets/images/wallets/metamask.svg"
import WalletConnectIcon from "@/assets/images/wallets/wallet-connect.svg"
import CoinbaseIcon from "@/assets/images/wallets/coinbase.svg"
import LedgerIcon from "@/assets/images/wallets/ledger.svg"
import InjectedIcon from "@/assets/images/wallets/injected.webp"

import ArbitrumNova from "@/assets/images/networks/42170.png"
import Polygon from "@/assets/images/networks/137.png"

export const SUPPORTED_CONNECTORS: {
  [key: string]: {
    image: StaticImageData
    color: string
    href: string | null
    description: string | null
  }
} = {
  injected: {
    image: InjectedIcon,
    color: "#010101",
    href: null,
    description: "Injected web3 provider.",
  },
  metaMask: {
    image: MetamaskIcon,
    color: "#E8831D",
    href: null,
    description: "Easy-to-use browser extension.",
  },
  coinbaseWallet: {
    image: CoinbaseIcon,
    color: "#315CF5",
    href: null,
    description: "Open in Coinbase Wallet app.",
  },
  walletConnect: {
    image: WalletConnectIcon,
    color: "#4196FC",
    href: null,
    description: "Use Coinbase Wallet app on mobile device",
  },
  ledger: {
    image: LedgerIcon,
    color: "#fafafa",
    href: null,
    description: "Hardware & Cold Wallet.",
  },
}

export const SUPPORTED_NETWORK_INFO = {
  [ChainId.ARBITRUM_NOVA]: {
    image: ArbitrumNova,
  },
  [ChainId.POLYGON]: {
    image: Polygon,
  },
}

export const SUPPORTED_DEX_INFO: { [key: string]: { image: string } } = {
  RCP: { image: "/dex/rcpswap.png" },
  Arb: { image: "/dex/arbswap.png" },
  Sushi: { image: "/dex/sushiswap.png" },
} as const
