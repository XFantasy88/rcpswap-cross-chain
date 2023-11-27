import { allChains, allProviders } from "@rcpswap/wagmi-config"
import { Connector, configureChains, createConfig } from "wagmi"

import { InjectedConnector } from "wagmi/connectors/injected"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet"
import { LedgerConnector } from "wagmi/connectors/ledger"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"

const projectId = "6ad02f9ab9bf39893167c8d7e962f5cf"

const { chains, publicClient } = configureChains(allChains, allProviders, {
  pollingInterval: 4_000,
})

const isMetamaskInstalled = () => {
  if (typeof window === "undefined") {
    return false
  }

  if (window.ethereum?.isMetaMask) {
    return true
  }

  if (window.ethereum?.providers?.some((p: any) => p?.isMetaMask)) {
    return true
  }

  return false
}

export type WalletConfig = {
  id: string
  title: string
  icon: string
  color: string
  description: string
  connector: Connector<any, any>
  installed?: boolean
  deepLink?: string
}

export const wallets: WalletConfig[] = [
  {
    id: "injected",
    title: "Injected",
    icon: `/wallets/injected.png`,
    color: "#010101",
    description: "Injected web3 provider.",
    connector: new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
    installed: typeof window !== "undefined" && Boolean(window.ethereum),
    deepLink: "https://metamask.app.link/dapp/rcpswap.com/",
  },
  {
    id: "metaMask",
    title: "Metamask",
    icon: `/wallets/metamask.png`,
    color: "#E8831D",
    description: "Easy-to-use browser extension.",
    get installed() {
      return isMetamaskInstalled()
      // && metaMaskConnector.ready
    },
    connector: new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true,
      },
    }),
    deepLink: "https://metamask.app.link/dapp/rcpswap.com/",
  },
  {
    id: "walletConnect",
    title: "WalletConnect",
    icon: `/wallets/wallet-connect.png`,
    color: "#315CF5",
    description: "Use Coinbase Wallet app on mobile device",
    connector: new WalletConnectConnector({
      chains,
      options: {
        showQrModal: true,
        projectId: "6ad02f9ab9bf39893167c8d7e962f5cf",
        metadata: {
          name: "RCPSwap",
          description: "Reddit Community Points Swap",
          url: "https://www.rcpswap.com",
          icons: ["https://www.rcpswap.com/icon.png"],
        },
      },
    }),
  },
  {
    id: "coinbaseWallet",
    title: "Coinbase Wallet",
    icon: `/wallets/coinbase.png`,
    color: "#315CF5",
    description: "Open in Coinbase Wallet app.",
    connector: new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "RCPSwap",
        appLogoUrl: "https://www.rcpswap.com/icon.png",
      },
    }),
  },
  {
    id: "ledger",
    title: "Ledger",
    icon: `/wallets/ledger.png`,
    color: "#fafafa",
    description: "Hardware & Cold Wallet.",
    connector: new LedgerConnector({
      chains,
      options: {},
    }),
  },
]

export const wagmiConfig = createConfig({
  publicClient,
  autoConnect: true,
  // connectors: connectorsForWallets(Object.values(wallets)).filter(
  //   (item, i, connectors) => connectors.indexOf(item) === i
  // ),
  connectors: wallets.map((wallet) => wallet.connector),
})

// export const config = createWagmiConfig()
