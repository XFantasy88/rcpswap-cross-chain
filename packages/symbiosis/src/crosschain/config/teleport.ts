import { Config } from "../types"

export const config: Config = {
  advisor: {
    url: "https://api.teleport.symbiosis.finance/calculations",
  },
  omniPools: [
    {
      chainId: 56288,
      address: "0x566E412387AE3FaB8b5Aa3A77178B120BCfF5Af8",
      oracle: "0x851B43189de721dD94AbA767AAd9E6F6d6a95CCA",
    },
    {
      chainId: 56288,
      address: "0xE7e68D336F90f98D22A479253eafA5f2424aCaD8",
      oracle: "0xDdD4F712F43e26eaDc10e88A0050552c196b0403",
    },
  ],
  revertableAddress: {
    default: "0x93541c07bE765B4012c5ca81c2CAA88258Dd356A",
  },
  chains: [
    {
      id: 137,
      rpc: "https://rpc.ankr.com/polygon",
      filterBlockOffset: 2000,
      waitForBlocksCount: 17,
      stables: [
        {
          name: "XDAO",
          address: "0x71eebA415A523F5C952Cc2f06361D5443545Ad28",
          symbol: "XDAO",
          decimals: 18,
          chainId: 137,
          icons: {
            large:
              "https://s2.coinmarketcap.com/static/img/coins/64x64/21760.png",
            small:
              "https://s2.coinmarketcap.com/static/img/coins/64x64/21760.png",
          },
        },
      ],
      router: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
      dexFee: 30,
      metaRouter: "0xb657f823fd8c4B94901e78b75481D5b39D59ec61",
      metaRouterGateway: "0x51d47A870cF9A8584f3FF850A50925E0CB930CD7",
      bridge: "0xfeC09BE39F82b13471D2e0E7d72e6ee589c631c6",
      synthesis: "0x0000000000000000000000000000000000000000",
      portal: "0x3338BE49A5f60e2593337919F9aD7098e9a7Dd7E",
      fabric: "0x0000000000000000000000000000000000000000",
      multicallRouter: "0xc5B61b9abC3C6229065cAD0e961aF585C5E0135c",
      aavePool: "0x0000000000000000000000000000000000000000",
      aavePoolDataProvider: "0x0000000000000000000000000000000000000000",
      creamComptroller: "0x0000000000000000000000000000000000000000",
      creamCompoundLens: "0x0000000000000000000000000000000000000000",
      renGatewayRegistry: "0x0000000000000000000000000000000000000000",
      blocksPerYear: 0,
    },
    {
      id: 56288,
      rpc: "https://symbiosis.bnb.boba.network",
      filterBlockOffset: 3000,
      waitForBlocksCount: 0,
      stables: [],
      router: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
      dexFee: 30,
      metaRouter: "0x906C9b4802AeC01d565b0412422224D1a2932D76",
      metaRouterGateway: "0x5F010D019e4D4f9b1CbA682e055A622BF76c0575",
      bridge: "0xe1f16F6C5cCbF9BA32E0fd1E668a133AFAe0f105",
      synthesis: "0xF818D26215BB22B79F8501530bd6d54FfE166735",
      portal: "0x0000000000000000000000000000000000000000",
      fabric: "0x6BB1864d4e5A58dfcD142d9f560bB6389742822E",
      multicallRouter: "0xcB28fbE3E9C0FEA62E0E63ff3f232CECfE555aD4",
      aavePool: "0x0000000000000000000000000000000000000000",
      aavePoolDataProvider: "0x0000000000000000000000000000000000000000",
      creamComptroller: "0x0000000000000000000000000000000000000000",
      creamCompoundLens: "0x0000000000000000000000000000000000000000",
      renGatewayRegistry: "0x0000000000000000000000000000000000000000",
      blocksPerYear: 0,
    },
    {
      id: 42161,
      rpc: "https://arb1.arbitrum.io/rpc",
      filterBlockOffset: 2000,
      waitForBlocksCount: 240,
      stables: [
        {
          name: "Symbiosis",
          address: "0x9E758B8a98a42d612b3D38B66a22074DC03D7370",
          symbol: "SIS",
          chainId: 42161,
          decimals: 18,
          icons: {
            large:
              "https://s2.coinmarketcap.com/static/img/coins/64x64/15084.png",
            small:
              "https://s2.coinmarketcap.com/static/img/coins/128x128/15084.png",
          },
        },
        {
          name: "XDAO",
          address: "0x71eebA415A523F5C952Cc2f06361D5443545Ad28",
          symbol: "XDAO",
          decimals: 18,
          chainId: 42161,
          icons: {
            large:
              "https://s2.coinmarketcap.com/static/img/coins/64x64/21760.png",
            small:
              "https://s2.coinmarketcap.com/static/img/coins/64x64/21760.png",
          },
        },
      ],
      router: "0xD01319f4b65b79124549dE409D36F25e04B3e551",
      dexFee: 30,
      metaRouter: "0x4F82CAA8F34564Ab22371f3c5d22868ab8eDD5E3",
      metaRouterGateway: "0x2A223EB19085E0AB286205403951F3863A9d45DE",
      bridge: "0x844e4a0ade23b1BA5642A8d0010E42aE4434Df30",
      synthesis: "0x0000000000000000000000000000000000000000",
      portal: "0x0425841529882628880fBD228AC90606e0c2e09A",
      fabric: "0x0000000000000000000000000000000000000000",
      multicallRouter: "0xF951789c6A356BfbC3033648AA10b5Dd3e9d88C0",
      aavePool: "0x0000000000000000000000000000000000000000",
      aavePoolDataProvider: "0x0000000000000000000000000000000000000000",
      creamComptroller: "0x0000000000000000000000000000000000000000",
      creamCompoundLens: "0x0000000000000000000000000000000000000000",
      renGatewayRegistry: "0x0000000000000000000000000000000000000000",
      blocksPerYear: 0,
    },
  ],
}
