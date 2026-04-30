import { useQuery } from '@tanstack/react-query'
import { authApi } from '@/lib/api'
import { ApiError } from '@/lib/api/client'
import { queryKeys } from '@/lib/queryKeys'
import { createClient, getAccessToken } from '@/lib/supabase'

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: async () => {
      const token = await getAccessToken()
      if (!token) return null
      try {
        return await authApi.me().then(r => r.payload)
      } catch (e) {
        if (e instanceof ApiError && e.isUnauthorized) {
          await createClient().auth.signOut()
          return null
        }
        throw e
      }
    },
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.isUnauthorized) && failureCount < 1,
  })
}
