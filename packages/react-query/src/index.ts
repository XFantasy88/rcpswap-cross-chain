import { captureException } from '@sentry/nextjs'
import {
  QueryCache,
  QueryClient,
  type QueryClientConfig,
} from '@tanstack/react-query'

const queryClientConfig = {
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      captureException(error)
    },
  }),
}

export const createQueryClient = (
  config: QueryClientConfig | undefined = queryClientConfig,
) => {
  return new QueryClient(config)
}

export * from './hooks'
