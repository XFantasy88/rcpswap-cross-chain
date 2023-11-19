export default [
  {
    "chainId": 137,
    "explorers": [
      {
        "name": "polygonscan",
        "url": "https://polygonscan.com",
        "standard": "EIP3091"
      }
    ],
    "nativeCurrency": {
      "name": "MATIC",
      "symbol": "MATIC",
      "decimals": 18
    },
    "name": "Polygon Mainnet",
    "shortName": "matic"
  },
  {
    "chainId": 42170,
    "explorers": [
      {
        "name": "Arbitrum Nova Chain Explorer",
        "url": "https://nova-explorer.arbitrum.io",
        "icon": "blockscout",
        "standard": "EIP3091"
      }
    ],
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18
    },
    "name": "Arbitrum Nova",
    "shortName": "arb-nova",
    "parent": {
      "type": "L2",
      "chain": "eip155-1",
      "bridges": [
        {
          "url": "https://bridge.arbitrum.io"
        }
      ]
    }
  }
] as const;

