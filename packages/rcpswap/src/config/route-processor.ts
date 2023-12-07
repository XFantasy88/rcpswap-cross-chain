import { ChainId } from "../chain"

// v1
export const ROUTE_PROCESSOR_SUPPORTED_CHAIN_IDS = [
  ChainId.ARBITRUM_NOVA,
  ChainId.POLYGON,
] as const
export type RouteProcessorChainId =
  (typeof ROUTE_PROCESSOR_SUPPORTED_CHAIN_IDS)[number]
export const ROUTE_PROCESSOR_ADDRESS: Record<
  RouteProcessorChainId,
  `0x${string}`
> = {
  [ChainId.ARBITRUM_NOVA]: "0xaB235da7f52d35fb4551AfBa11BFB56e18774A65",
  [ChainId.POLYGON]: "0x0dc8E47a1196bcB590485eE8bF832c5c68A52f4B",
} as const
export const isRouteProcessorChainId = (
  chainId: ChainId
): chainId is RouteProcessorChainId =>
  ROUTE_PROCESSOR_SUPPORTED_CHAIN_IDS.includes(chainId as RouteProcessorChainId)

// v2
export const ROUTE_PROCESSOR_2_SUPPORTED_CHAIN_IDS = [
  ChainId.ARBITRUM_NOVA,
  ChainId.POLYGON,
] as const
export type RouteProcessor2ChainId =
  (typeof ROUTE_PROCESSOR_2_SUPPORTED_CHAIN_IDS)[number]
export const ROUTE_PROCESSOR_2_ADDRESS: Record<
  RouteProcessor2ChainId,
  `0x${string}`
> = {
  [ChainId.ARBITRUM_NOVA]: "0x1c5771e96C9d5524fb6e606f5B356d08C40Eb194",
  [ChainId.POLYGON]: "0x5097CBB61D3C75907656DC4e3bbA892Ff136649a",
} as const
export const isRouteProcessor2ChainId = (
  chainId: ChainId
): chainId is RouteProcessor2ChainId =>
  ROUTE_PROCESSOR_2_SUPPORTED_CHAIN_IDS.includes(
    chainId as RouteProcessor2ChainId
  )

// v3
export const ROUTE_PROCESSOR_3_SUPPORTED_CHAIN_IDS = [
  ChainId.ARBITRUM_NOVA,
  ChainId.POLYGON,
] as const
export type RouteProcessor3ChainId =
  (typeof ROUTE_PROCESSOR_3_SUPPORTED_CHAIN_IDS)[number]
export const ROUTE_PROCESSOR_3_ADDRESS: Record<
  RouteProcessor3ChainId,
  `0x${string}`
> = {
  [ChainId.ARBITRUM_NOVA]: "0x9186bf4f5f4b3192fbae5467758156ec479b2b50",
  [ChainId.POLYGON]: "0x7d2e410b5f0fd1620bac7ec62f10bbcfa2fd3d70",
} as const
export const isRouteProcessor3ChainId = (
  chainId: ChainId
): chainId is RouteProcessor3ChainId =>
  ROUTE_PROCESSOR_3_SUPPORTED_CHAIN_IDS.includes(
    chainId as RouteProcessor3ChainId
  )

// meta
export const META_ROUTE_PROCESSOR_SUPPORTED_CHAIN_IDS = [
  ChainId.ARBITRUM_NOVA,
  ChainId.POLYGON,
] as const
export type MetaRouteProcessorChainId =
  (typeof META_ROUTE_PROCESSOR_SUPPORTED_CHAIN_IDS)[number]
export const META_ROUTE_PROCESSOR_ADDRESS: Record<
  MetaRouteProcessorChainId,
  `0x${string}`
> = {
  [ChainId.ARBITRUM_NOVA]: "0x36060019b864D6b12310528fdA8315d7a9A08348",
  [ChainId.POLYGON]: "0x2e73b7b8c5431fa439980a9ad07507dc0a8b0cad",
} as const
export const isMetaRouteProcessorChainId = (
  chainId: ChainId
): chainId is MetaRouteProcessorChainId =>
  META_ROUTE_PROCESSOR_SUPPORTED_CHAIN_IDS.includes(
    chainId as MetaRouteProcessorChainId
  )
