import { getCurrencyCombinations } from '@rcpswap/router'

import { Pool, isRCPSwapChainId } from '@rcpswap/v2-sdk'
import { Type } from 'rcpswap/currency'
import { TradeType } from 'rcpswap/dex'

import { UsePoolsParams, UsePoolsReturn } from '../types'
import { PairState, getSwapV2Pools } from './getSwapV2Pools'

const queryFn = async ({
  chainId,
  currencyA,
  currencyB,
  tradeType = TradeType.EXACT_INPUT,
  withCombinations = true,
}: UsePoolsParams) => {
  const [currencyIn, currencyOut] =
    tradeType === TradeType.EXACT_INPUT
      ? [currencyA, currencyB]
      : [currencyB, currencyA]

  let currencyCombinations: [Type | undefined, Type | undefined][] = [
    [currencyIn, currencyOut],
  ]
  if (withCombinations && currencyIn && currencyOut && chainId) {
    currencyCombinations = getCurrencyCombinations(
      chainId,
      currencyIn,
      currencyOut,
    )
  }

  // let v3CurrencyCombinations: [Type | undefined, Type | undefined][] = [[currencyIn, currencyOut]]
  // if (withCombinations && currencyIn && currencyOut && chainId) {
  //   v3CurrencyCombinations = getV3CurrencyCombinations(chainId, currencyIn, currencyOut)
  // }


  const [pairs] =
    await Promise.all([
      isRCPSwapChainId(chainId)
        ? getSwapV2Pools(chainId, currencyCombinations)
        : Promise.resolve([])
    ])
  // const filteredCurrencyCombinations = currencyCombinations.filter(([a, b]) =>  a === currencyA || b === currencyA || a === currencyB || b === currencyB)
  // const v3Pools = await getV3Pools(chainId, v3CurrencyCombinations)

  return {
    pairs
  }
}

export const getAllPools = async (
  variables: Omit<UsePoolsParams, 'enabled'> & { asMap?: boolean },
): Promise<UsePoolsReturn> => {
  if (!variables.currencyA || !variables.currencyB) {
    return {
      pools: [],
    }
  }
  const data = await queryFn(variables)
  return {
    pools: Object.values(
      data.pairs
        .filter((result): result is [PairState.EXISTS, Pool] =>
          Boolean(result[0] === PairState.EXISTS && result[1]),
        )
        .map(([, pair]) => pair as Pool),
    )
  }
}
