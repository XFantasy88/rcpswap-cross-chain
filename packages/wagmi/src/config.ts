import { allChains, allProviders } from "@rcpswap/wagmi-config"
import { configureChains, createConfig } from "wagmi"
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets"
import { injectedWallet } from "@rainbow-me/rainbowkit/wallets"
import { walletConnectWallet } from "@rainbow-me/rainbowkit/wallets"
import { coinbaseWallet } from "@rainbow-me/rainbowkit/wallets"
import { ledgerWallet } from "@rainbow-me/rainbowkit/wallets"
import { trustWallet } from "@rainbow-me/rainbowkit/wallets"
import { connectorsForWallets } from "@rainbow-me/rainbowkit"

const projectId = "6ad02f9ab9bf39893167c8d7e962f5cf"

const { chains, publicClient } = configureChains(allChains, allProviders, {
  pollingInterval: 4_000,
})

export const wallets = {
  metaMask: metaMaskWallet({ chains, projectId }),
  walletConnect: walletConnectWallet({ chains, projectId }),
  coinbaseWallet: coinbaseWallet({ chains, appName: "RCPSwap" }),
  ledgerWallet: ledgerWallet({ chains, projectId }),
  trustWallet: trustWallet({ chains, projectId }),
  // ledgerWallet({ chains, projectId }),
} as const

export const wagmiConfig = createConfig({
  publicClient,
  autoConnect: true,
  connectors: connectorsForWallets(Object.values(wallets)).filter(
    (item, i, connectors) => connectors.indexOf(item) === i
  ),
  // connectors: [
  //   new InjectedConnector({
  //     chains,
  //     options: {
  //       name: "Injected",
  //       shimDisconnect: true,
  //     },
  //   }),
  //   new MetaMaskConnector({
  //     chains,
  //     options: {
  //       shimDisconnect: true,
  //     },
  //   }),
  //   new LedgerConnector({
  //     chains,
  //     options: {},
  //   }),
  //   new WalletConnectConnector({
  //     chains,
  //     options: {
  //       showQrModal: true,
  //       projectId: "6ad02f9ab9bf39893167c8d7e962f5cf",
  //       metadata: {
  //         name: "RCPSwap",
  //         description: "Reddit Community Points Swap",
  //         url: "https://www.rcpswap.com",
  //         icons: ["https://www.rcpswap.com/icon.png"],
  //       },
  //     },
  //   }),
  //   new CoinbaseWalletConnector({
  //     // TODO: Flesh out coinbase wallet connect options?
  //     chains,
  //     options: {
  //       appName: "RCPSwap",
  //       appLogoUrl: "https://www.rcpswap.com/icon.png",
  //     },
  //   }),
  // ],
})

// export const config = createWagmiConfig()
