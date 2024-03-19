import { Config } from "../types";

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
    {
      chainId: 56288,
      address: "0xA267C428b16728831Be52b144F78b8F054411f55",
      oracle: "0xECBe427C8F8ea1Ee5258cAf5aB0A9d26b4D91769",
    },
  ],
  revertableAddress: {
    default: "0xd99ac0681b904991169a4f398B9043781ADbe0C3",
  },
  chains: [
    {
      id: 56,
      rpc: "https://bsc.publicnode.com",
      filterBlockOffset: 2000,
      waitForBlocksCount: 10,
      stables: [
        {
          name: "USD Coin",
          address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
          symbol: "USDC",
          decimals: 18,
          chainId: 56,
          icons: {
            large:
              "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
            small:
              "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
          },
        },
        {
          deprecated: true,
          name: "BUSD Token",
          address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
          symbol: "BUSD",
          decimals: 18,
          chainId: 56,
          icons: {
            large:
              "https://s2.coinmarketcap.com/static/img/coins/64x64/4687.png",
            small:
              "https://s2.coinmarketcap.com/static/img/coins/64x64/4687.png",
          },
        },
        {
          name: "Ethereum Token",
          symbol: "ETH",
          address: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
          chainId: 56,
          decimals: 18,
          icons: {
            large:
              "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
            small:
              "https://s2.coinmarketcap.com/static/img/coins/128x128/1027.png",
          },
        },
        {
          name: "Binance-Peg BTCB Token",
          symbol: "BTCB",
          address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
          chainId: 56,
          decimals: 18,
          icons: {
            large: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
            small:
              "https://s2.coinmarketcap.com/static/img/coins/128x128/1.png",
          },
        },
      ],
      router: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
      dexFee: 25,
      metaRouter: "0x44487a445a7595446309464A82244B4bD4e325D5",
      metaRouterGateway: "0x5c97D726bf5130AE15408cE32bc764e458320D2f",
      bridge: "0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8",
      synthesis: "0x6B1bbd301782FF636601fC594Cd7Bfe74871bfaA",
      portal: "0x5Aa5f7f84eD0E5db0a4a85C3947eA16B53352FD4",
      fabric: "0xc17d768Bf4FdC6f20a4A0d8Be8767840D106D077",
      multicallRouter: "0x44b5d0F16Ad55c4e7113310614745e8771b963bB",
      aavePool: "0x0000000000000000000000000000000000000000",
      aavePoolDataProvider: "0x0000000000000000000000000000000000000000",
      creamComptroller: "0x589de0f0ccf905477646599bb3e5c622c84cc0ba",
      creamCompoundLens: "0x06fd4e17Dd35d0dE9FE17eeAE4e94fBA57fEF154",
      renGatewayRegistry: "0xf36666C230Fa12333579b9Bd6196CB634D6BC506",
      blocksPerYear: 0,
    },
    {
      id: 43114,
      rpc: "https://avalanche-c-chain.publicnode.com",
      filterBlockOffset: 2000,
      waitForBlocksCount: 30,
      stables: [
        {
          name: "USD Coin",
          address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
          symbol: "USDC",
          decimals: 6,
          chainId: 43114,
          icons: {
            large:
              "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
            small:
              "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
          },
        },
        {
          deprecated: true,
          name: "USD Coin",
          address: "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664",
          symbol: "USDC.e",
          decimals: 6,
          chainId: 43114,
          icons: {
            large:
              "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
            small:
              "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
          },
        },
      ],
      router: "0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106",
      dexFee: 30,
      metaRouter: "0x6F0f6393e45fE0E7215906B6f9cfeFf53EA139cf",
      metaRouterGateway: "0x4cfA66497Fa84D739a0f785FBcEe9196f1C64e4a",
      bridge: "0x292fC50e4eB66C3f6514b9E402dBc25961824D62",
      synthesis: "0x0000000000000000000000000000000000000000",
      portal: "0xE75C7E85FE6ADd07077467064aD15847E6ba9877",
      fabric: "0x0000000000000000000000000000000000000000",
      multicallRouter: "0xDc9a6a26209A450caC415fb78487e907c660cf6a",
      aavePool: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
      aavePoolDataProvider: "0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654",
      creamComptroller: "0x486Af39519B4Dc9a7fCcd318217352830E8AD9b4",
      creamCompoundLens: "0x5b4058A9000e86fe136Ac896352C4DFD539E32a1",
      renGatewayRegistry: "0x0000000000000000000000000000000000000000",
      blocksPerYear: 0,
    },
    {
      id: 137,
      rpc: "https://polygon-bor.publicnode.com",
      filterBlockOffset: 2000,
      waitForBlocksCount: 17,
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
      metaRouter: "0xa260E3732593E4EcF9DdC144fD6C4c5fe7077978",
      metaRouterGateway: "0xAb83653fd41511D638b69229afBf998Eb9B0F30c",
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
      rpc: "https://replica.bnb.boba.network",
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
      metaRouter: "0x2cBABD7329b84e2c0A317702410E7c73D0e0246d",
      metaRouterGateway: "0xd666ab407c8E77DB239F473a49E309514aa55e0C",
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
      id: 42161,
      rpc: "https://arb1.arbitrum.io/rpc",
      filterBlockOffset: 2000,
      waitForBlocksCount: 240,
      stables: [
        {
          name: "USD Coin",
          symbol: "USDC",
          address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
          chainId: 42161,
          decimals: 6,
          icons: {
            large:
              "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
            small:
              "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
          },
        },
        {
          deprecated: true,
          name: "USD Coin (Arb1)",
          symbol: "USDC.e",
          address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
          chainId: 42161,
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
          address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
          chainId: 42161,
          decimals: 18,
          icons: {
            large:
              "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
            small:
              "https://s2.coinmarketcap.com/static/img/coins/128x128/1027.png",
          },
        },
      ],
      router: "0xD01319f4b65b79124549dE409D36F25e04B3e551",
      dexFee: 30,
      metaRouter: "0xf7e96217347667064DEE8f20DB747B1C7df45DDe",
      metaRouterGateway: "0x80ddDDa846e779cceE463bDC0BCc2Ae296feDaF9",
      bridge: "0x5523985926Aa12BA58DC5Ad00DDca99678D7227E",
      synthesis: "0x0000000000000000000000000000000000000000",
      portal: "0x01A3c8E513B758EBB011F7AFaf6C37616c9C24d9",
      fabric: "0x0000000000000000000000000000000000000000",
      multicallRouter: "0xda8057acB94905eb6025120cB2c38415Fd81BfEB",
      aavePool: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
      aavePoolDataProvider: "0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654",
      creamComptroller: "0x0000000000000000000000000000000000000000",
      creamCompoundLens: "0x0000000000000000000000000000000000000000",
      renGatewayRegistry: "0x0000000000000000000000000000000000000000",
      blocksPerYear: 0,
    },
    {
      id: 42170,
      rpc: "https://nova.arbitrum.io/rpc",
      filterBlockOffset: 2000,
      waitForBlocksCount: 2,
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
      router: "0xEe01c0CD76354C383B8c7B4e65EA88D00B06f36f",
      dexFee: 30,
      metaRouter: "0xca506793A420E901BbCa8066be5661E3C52c84c2",
      metaRouterGateway: "0xd92Ca299F1C2518E78E48C207b64591BA6E9b9a8",
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
};
