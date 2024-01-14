import JSBI from "jsbi"

// exports for external consumption
export type BigintIsh = JSBI | bigint | string

export type Icons = {
  large?: string
  small?: string
}

export type TokenConstructor = {
  name?: string
  symbol?: string
  address: string
  decimals: number
  chainId: ChainId
  isNative?: boolean
  chainFromId?: ChainId
  icons?: Icons
  userToken?: boolean
  deprecated?: boolean
}

export type ChainConstructor = {
  id: ChainId
  name: string
  explorer: string
  disabled: boolean
  icons: Icons
  swappable?: boolean
  evm?: boolean
}

export enum ChainId {
  BSC = 56,
  MATIC_MAINNET = 137,
  BOBA_BNB = 56288,
  ARBITRUM_NOVA = 42170,
  ARBITRUM_ONE = 42161,
}

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT,
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP,
}
export const FACTORY_ADDRESS = {
  [ChainId.BSC]: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
  [ChainId.MATIC_MAINNET]: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",
  [ChainId.BOBA_BNB]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  [ChainId.ARBITRUM_NOVA]: "0xf6239423fcf1c19ed2791d9648a90836074242fd", // arbSwap
  [ChainId.ARBITRUM_ONE]: "0xd394e9cc20f43d2651293756f8d320668e850f1b",
}

export const INIT_CODE_HASH = {
  [ChainId.BSC]:
    "0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5",
  [ChainId.MATIC_MAINNET]:
    "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f",
  [ChainId.BOBA_BNB]:
    "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
  [ChainId.ARBITRUM_NOVA]:
    "0x70b19cf85a176c6b86e2d324be179104bdc8fafee13d548ae07d28b9f53cbc71", // arbSwap
  [ChainId.ARBITRUM_ONE]:
    "0x8336ef61546f16041265cbd61fb71f00434b515a1f3dba059227802ec4a4be4f",
}

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000)

// exports for internal consumption
export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const TWO = JSBI.BigInt(2)
export const THREE = JSBI.BigInt(3)
export const FIVE = JSBI.BigInt(5)
export const TEN = JSBI.BigInt(10)
export const _100 = JSBI.BigInt(100)
export const _998 = JSBI.BigInt(998)
export const _1000 = JSBI.BigInt(1000)

export enum SolidityType {
  uint8 = "uint8",
  uint256 = "uint256",
}

export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: JSBI.BigInt("0xff"),
  [SolidityType.uint256]: JSBI.BigInt(
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
  ),
}

export const NATIVE_TOKEN_ADDRESS =
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" as const
export const NATIVE_TOKEN_ADDRESS_MAP: Partial<Record<ChainId, string>> =
  {} as const

export function getNativeTokenAddress(chainId: ChainId) {
  const specificTokenAddress = NATIVE_TOKEN_ADDRESS_MAP[chainId]
  if (specificTokenAddress) {
    return specificTokenAddress
  }

  return NATIVE_TOKEN_ADDRESS
}
