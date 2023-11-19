import React, { Fragment, memo, useContext } from "react"
import { FiChevronRight } from "react-icons/fi"
import { Flex } from "rebass"
import { ThemeContext } from "styled-components"
import { type RToken } from "@rcpswap/tines"

import { TYPE } from "@/theme"
import { UseTradeReturn } from "@rcpswap/router"

export default memo(function SwapRoute({ trade }: { trade: UseTradeReturn }) {
  const theme = useContext(ThemeContext)
  return (
    <Flex
      flexWrap="wrap"
      width="100%"
      justifyContent="flex-end"
      alignItems="center"
    >
      {trade.route.legs
        .map((leg) => [leg.tokenFrom, leg.tokenTo])
        .flat()
        .reduce((prev: RToken[], cur) => {
          if (prev.indexOf(cur) < 0) prev.push(cur)
          return prev
        }, [])
        .map((leg, i, path) => {
          const isLastItem: boolean = i === path.length - 1
          return (
            <Fragment key={i}>
              <Flex alignItems="end">
                <TYPE.black
                  fontSize={14}
                  color={theme?.text1}
                  ml="0.125rem"
                  mr="0.125rem"
                >
                  {leg.symbol}
                </TYPE.black>
              </Flex>
              {isLastItem ? null : (
                <FiChevronRight size={12} color={theme?.text2} />
              )}
            </Fragment>
          )
        })}
    </Flex>
  )
})
