import { ChainId } from "../chain"

// v1
export const ROUTE_PROCESSOR_SUPPORTED_CHAIN_IDS = [
  ChainId.BSC,
  ChainId.POLYGON,
  ChainId.ARBITRUM_ONE,
  ChainId.ARBITRUM_NOVA,
  ChainId.AVALANCHE,
] as const
export type RouteProcessorChainId =
  (typeof ROUTE_PROCESSOR_SUPPORTED_CHAIN_IDS)[number]
export const ROUTE_PROCESSOR_ADDRESS: Record<
  RouteProcessorChainId,
  `0x${string}`
> = {
  [ChainId.BSC]: "0x7cf167390E2526Bc03F3CF6852A7AF1CEC3e243d",
  [ChainId.POLYGON]: "0x0dc8E47a1196bcB590485eE8bF832c5c68A52f4B",
  [ChainId.ARBITRUM_ONE]: "0x9c6522117e2ed1fE5bdb72bb0eD5E3f2bdE7DBe0",
  [ChainId.ARBITRUM_NOVA]: "0xaB235da7f52d35fb4551AfBa11BFB56e18774A65",
  [ChainId.AVALANCHE]: "0x400d75dAb26bBc18D163AEA3e83D9Ea68F6c1804",
} as const
export const isRouteProcessorChainId = (
  chainId: ChainId
): chainId is RouteProcessorChainId =>
  ROUTE_PROCESSOR_SUPPORTED_CHAIN_IDS.includes(chainId as RouteProcessorChainId)

// v2
export const ROUTE_PROCESSOR_2_SUPPORTED_CHAIN_IDS = [
  ChainId.BSC,
  ChainId.POLYGON,
  ChainId.ARBITRUM_ONE,
  ChainId.ARBITRUM_NOVA,
  ChainId.AVALANCHE,
] as const
export type RouteProcessor2ChainId =
  (typeof ROUTE_PROCESSOR_2_SUPPORTED_CHAIN_IDS)[number]
export const ROUTE_PROCESSOR_2_ADDRESS: Record<
  RouteProcessor2ChainId,
  `0x${string}`
> = {
  [ChainId.BSC]: "0xD75F5369724b513b497101fb15211160c1d96550",
  [ChainId.POLYGON]: "0x5097CBB61D3C75907656DC4e3bbA892Ff136649a",
  [ChainId.ARBITRUM_ONE]: "0xA7caC4207579A179c1069435d032ee0F9F150e5c",
  [ChainId.ARBITRUM_NOVA]: "0x1c5771e96C9d5524fb6e606f5B356d08C40Eb194",
  [ChainId.AVALANCHE]: "0xbACEB8eC6b9355Dfc0269C18bac9d6E2Bdc29C4F",
} as const
export const isRouteProcessor2ChainId = (
  chainId: ChainId
): chainId is RouteProcessor2ChainId =>
  ROUTE_PROCESSOR_2_SUPPORTED_CHAIN_IDS.includes(
    chainId as RouteProcessor2ChainId
  )

// v3
export const ROUTE_PROCESSOR_3_SUPPORTED_CHAIN_IDS = [
  ChainId.BSC,
  ChainId.POLYGON,
  ChainId.ARBITRUM_ONE,
  ChainId.ARBITRUM_NOVA,
  ChainId.AVALANCHE,
] as const
export type RouteProcessor3ChainId =
  (typeof ROUTE_PROCESSOR_3_SUPPORTED_CHAIN_IDS)[number]
export const ROUTE_PROCESSOR_3_ADDRESS: Record<
  RouteProcessor3ChainId,
  `0x${string}`
> = {
  [ChainId.BSC]: "0x780f32439B3c7435AB11B4d48c4BA2035190A7bF",
  [ChainId.POLYGON]: "0x7d2e410b5f0fd1620bac7ec62f10bbcfa2fd3d70",
  [ChainId.ARBITRUM_ONE]: "0x44Dd4e691F9E385a10b540E53E9215Fd6116A4BB",
  [ChainId.ARBITRUM_NOVA]: "0x9186bf4f5f4b3192fbae5467758156ec479b2b50",
  [ChainId.AVALANCHE]: "0xa08ACc71e5c7a164f7ed3F0c996a78Fdf06aD8F5",
} as const
export const isRouteProcessor3ChainId = (
  chainId: ChainId
): chainId is RouteProcessor3ChainId =>
  ROUTE_PROCESSOR_3_SUPPORTED_CHAIN_IDS.includes(
    chainId as RouteProcessor3ChainId
  )

// meta
export const META_ROUTE_PROCESSOR_SUPPORTED_CHAIN_IDS = [
  ChainId.BSC,
  ChainId.POLYGON,
  ChainId.ARBITRUM_ONE,
  ChainId.ARBITRUM_NOVA,
  ChainId.AVALANCHE,
] as const
export type MetaRouteProcessorChainId =
  (typeof META_ROUTE_PROCESSOR_SUPPORTED_CHAIN_IDS)[number]
export const META_ROUTE_PROCESSOR_ADDRESS: Record<
  MetaRouteProcessorChainId,
  `0x${string}`
> = {
  [ChainId.BSC]: "0x2bc0c8727be2c073aaff4adc9bfd770c528146da",
  [ChainId.POLYGON]: "0x7df9c618fbb73fb46a356cfdc17dec9b4c87e261",
  [ChainId.ARBITRUM_ONE]: "0xe30590a4162859364B61d37e08620E4e53D88127",
  [ChainId.ARBITRUM_NOVA]: "0x98e3542200Bf5048Dab45B7b2915EeB4E6fD6954",
  [ChainId.AVALANCHE]: "0x2f8A69b0F843E95eaE444681a5047d38620dD5c4",
} as const
export const isMetaRouteProcessorChainId = (
  chainId: ChainId
): chainId is MetaRouteProcessorChainId =>
  META_ROUTE_PROCESSOR_SUPPORTED_CHAIN_IDS.includes(
    chainId as MetaRouteProcessorChainId
  )
