import Image, { ImageProps } from "next/image"
import React, { useMemo, useState } from "react"
import { FiHelpCircle } from "react-icons/fi"

const BAD_SRCS: { [tokenAddress: string]: true } = {}

export interface LogoProps
  extends Pick<ImageProps, "style" | "alt" | "className" | "width" | "height"> {
  srcs: string[]
}
/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
export default function Logo({ srcs, ...rest }: LogoProps) {
  const [, refresh] = useState<number>(0)

  const src = srcs.find((src) => !BAD_SRCS[src])

  if (src) {
    return (
      <Image
        {...rest}
        src={src}
        onError={() => {
          if (src) BAD_SRCS[src] = true
          refresh((i) => i + 1)
        }}
      />
    )
  }

  return <FiHelpCircle {...rest} />
}
