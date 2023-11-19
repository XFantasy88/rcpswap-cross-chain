import { Config } from "../types"

export const config: Config = {
  advisor: {
    url: "https://api-v2.symbiosis.finance/calculations",
  },
  omniPools: [
    {
      chainId: 56288,
      address: "0x6148FD6C649866596C3d8a971fC313E5eCE84882",
      oracle: "0x7775b274f0C3fA919B756b22A4d9674e55927ab8",
    },
    {
      chainId: 56288,
      address: "0xBcc2637DFa64999F75abB53a7265b5B4932e40eB",
      oracle: "0x628613064b1902a1A422825cf11B687C6f17961E",
    },
  ],
  revertableAddress: {
    default: "0xd99ac0681b904991169a4f398B9043781ADbe0C3",
  },
  chains: [
    {
      id: 137,
      rpc: "https://polygon-bor.publicnode.com",
      filterBlockOffset: 2000,
      waitForBlocksCount: 60,
      stables: [
        {
          name: "USD Coin (PoS) (USDC.e)",
          address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
          symbol: "USDC.e",
          decimals: 6,
          chainId: 137,
          icons: {
            large:
              "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
            small:
              "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
          },
        },
        {
          name: "Wrapped Ether",
          symbol: "WETH",
          address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
          chainId: 137,
          decimals: 18,
          icons: {
            large:
              "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
            small:
              "https://s2.coinmarketcap.com/static/img/coins/128x128/1027.png",
          },
        },
      ],
      router: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
      dexFee: 30,
      metaRouter: "0xF951789c6A356BfbC3033648AA10b5Dd3e9d88C0",
      metaRouterGateway: "0x5d025432bcbe100354b5fb7b1a68d1641e677f6c",
      bridge: "0x5523985926Aa12BA58DC5Ad00DDca99678D7227E",
      synthesis: "0x0000000000000000000000000000000000000000",
      portal: "0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8",
      fabric: "0x0000000000000000000000000000000000000000",
      multicallRouter: "0xc5B61b9abC3C6229065cAD0e961aF585C5E0135c",
      aavePool: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
      aavePoolDataProvider: "0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654",
      creamComptroller: "0x20CA53E2395FA571798623F1cFBD11Fe2C114c24",
      creamCompoundLens: "0xa7B0C2e904d597b89b4bf91927A3B90459f8bb9E",
      renGatewayRegistry: "0xf36666C230Fa12333579b9Bd6196CB634D6BC506",
      blocksPerYear: 0,
    },
    {
      id: 56288,
      rpc: "https://symbiosis.bnb.boba.network",
      filterBlockOffset: 3000,
      waitForBlocksCount: 0,
      stables: [
        {
          name: "USD Coin",
          address: "0x9F98f9F312D23d078061962837042b8918e6aff2",
          symbol: "USDC",
          decimals: 18,
          chainId: 56288,
          icons: {
            large:
              "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
            small:
              "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
          },
        },
      ],
      router: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
      dexFee: 30,
      metaRouter: "0xB79A4F5828eb55c10D7abF4bFe9a9f5d11aA84e0",
      metaRouterGateway: "0x37E44E4400A43F0c27ed42cF6EBEE3493A3e4d2f",
      bridge: "0x5523985926Aa12BA58DC5Ad00DDca99678D7227E",
      synthesis: "0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8",
      portal: "0x0000000000000000000000000000000000000000",
      fabric: "0x5Aa5f7f84eD0E5db0a4a85C3947eA16B53352FD4",
      multicallRouter: "0xcB28fbE3E9C0FEA62E0E63ff3f232CECfE555aD4",
      aavePool: "0x0000000000000000000000000000000000000000",
      aavePoolDataProvider: "0x0000000000000000000000000000000000000000",
      creamComptroller: "0x0000000000000000000000000000000000000000",
      creamCompoundLens: "0x0000000000000000000000000000000000000000",
      renGatewayRegistry: "0x0000000000000000000000000000000000000000",
      blocksPerYear: 0,
    },
    {
      id: 42170,
      rpc: "https://nova.arbitrum.io/rpc",
      filterBlockOffset: 2000,
      waitForBlocksCount: 60,
      stables: [
        {
          name: "USD Coin",
          symbol: "USDC",
          address: "0x750ba8b76187092B0D1E87E28daaf484d1b5273b",
          chainId: 42170,
          decimals: 6,
          icons: {
            large:
              "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
            small:
              "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
          },
        },
        {
          name: "Wrapped Ether",
          symbol: "WETH",
          address: "0x722e8bdd2ce80a4422e880164f2079488e115365",
          chainId: 42170,
          decimals: 18,
          icons: {
            large:
              "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
            small:
              "https://s2.coinmarketcap.com/static/img/coins/128x128/1027.png",
          },
        },
      ],
      router: "0x9186bf4F5f4b3192fBAE5467758156Ec479b2b50",
      dexFee: 30,
      metaRouter: "0xf85fc807d05d3ab2309364226970aac57b4e1ea4",
      metaRouterGateway: "0xcd7c056b39ddfb568e451923abedb9b6a7aeb885",
      bridge: "0x5523985926Aa12BA58DC5Ad00DDca99678D7227E",
      synthesis: "0x0000000000000000000000000000000000000000",
      portal: "0x292fC50e4eB66C3f6514b9E402dBc25961824D62",
      fabric: "0x0000000000000000000000000000000000000000",
      multicallRouter: "0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8",
      aavePool: "0x0000000000000000000000000000000000000000",
      aavePoolDataProvider: "0x0000000000000000000000000000000000000000",
      creamComptroller: "0x0000000000000000000000000000000000000000",
      creamCompoundLens: "0x0000000000000000000000000000000000000000",
      renGatewayRegistry: "0x0000000000000000000000000000000000000000",
      blocksPerYear: 0,
    },
  ],
}
