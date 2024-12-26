import userApiRequest from '@/apiRequests/user'
import { useQuery } from '@tanstack/react-query'

export const useGetMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: userApiRequest.me
  })
}
