export default [
  {
    chainId: 56,
    explorers: [
      {
        name: "bscscan",
        url: "https://bscscan.com",
        standard: "EIP3091",
      },
    ],
    nativeCurrency: {
      name: "BNB Chain Native Token",
      symbol: "BNB",
      decimals: 18,
    },
    name: "BNB Smart Chain Mainnet",
    shortName: "bnb",
  },
  {
    chainId: 137,
    explorers: [
      {
        name: "polygonscan",
        url: "https://polygonscan.com",
        standard: "EIP3091",
      },
    ],
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    name: "Polygon Mainnet",
    shortName: "matic",
  },
  {
    chainId: 42161,
    explorers: [
      {
        name: "Arbiscan",
        url: "https://arbiscan.io",
        standard: "EIP3091",
      },
      {
        name: "Arbitrum Explorer",
        url: "https://explorer.arbitrum.io",
        standard: "EIP3091",
      },
    ],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    name: "Arbitrum One",
    shortName: "arb1",
    parent: {
      type: "L2",
      chain: "eip155-1",
      bridges: [
        {
          url: "https://bridge.arbitrum.io",
        },
      ],
    },
  },
  {
    chainId: 42170,
    explorers: [
      {
        name: "Arbitrum Nova Chain Explorer",
        url: "https://nova-explorer.arbitrum.io",
        icon: "blockscout",
        standard: "EIP3091",
      },
    ],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    name: "Arbitrum Nova",
    shortName: "arb-nova",
    parent: {
      type: "L2",
      chain: "eip155-1",
      bridges: [
        {
          url: "https://bridge.arbitrum.io",
        },
      ],
    },
  },
] as const
