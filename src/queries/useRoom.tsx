import roomApiRequest from '@/apiRequests/room'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useCreateRoomMutation = () => {
  return useMutation({
    mutationFn: roomApiRequest.createRoom
  })
}

export const useCheckRoomMutation = () => {
  return useMutation({
    mutationFn: roomApiRequest.checkRoom
  })
}

export const useGetStreamToken = () => {
  return useQuery({
    queryKey: ['stream-token'],
    queryFn: roomApiRequest.getStreamToken
  })
}
