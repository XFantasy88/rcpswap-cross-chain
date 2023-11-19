import { amountSchema } from 'rcpswap/currency'
import z from 'zod'

export const PoolSchema = z.object({
  reserve0: amountSchema,
  reserve1: amountSchema,
})

export type SerializedPool = z.infer<typeof PoolSchema>
