import adminApiRequest from '@/apiRequests/admin'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useGetAllUserQuery = () => {
  return useQuery({
    queryKey: ['all-user'],
    queryFn: adminApiRequest.getAllUser
  })
}

export const useGetAllRoomQuery = () => {
  return useQuery({
    queryKey: ['all-room'],
    queryFn: adminApiRequest.getAllRoom
  })
}

export const useGetOneUserQuery = ({ id, enabled }: { id: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['one-user', id],
    queryFn: () => adminApiRequest.getOneUser(id.toString()),
    enabled
  })
}

export const useCreateUserMutation = () => {
  return useMutation({
    mutationFn: adminApiRequest.createUser
  })
}

export const useUpdateUserMutation = () => {
  return useMutation({
    mutationFn: adminApiRequest.updateUser
  })
}

export const useDeleteUserMutation = () => {
  return useMutation({
    mutationFn: adminApiRequest.deleteUser
  })
}

export const useDeleteRoomMutation = () => {
  return useMutation({
    mutationFn: adminApiRequest.deleteRoom
  })
}
