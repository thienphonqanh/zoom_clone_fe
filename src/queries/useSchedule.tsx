import scheduleApiRequest from '@/apiRequests/schedule'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useGetAllScheduleQuery = () => {
  return useQuery({
    queryKey: ['all-schedule'],
    queryFn: scheduleApiRequest.getAllSchedule
  })
}

export const useCreateNewScheduleMutation = () => {
  return useMutation({
    mutationFn: scheduleApiRequest.createNewSchedule
  })
}

export const useDeleteScheduleMutation = () => {
  return useMutation({
    mutationFn: scheduleApiRequest.deleteSchedule
  })
}

export const useUpdateScheduleMutation = () => {
  return useMutation({
    mutationFn: scheduleApiRequest.updateSchedule
  })
}

export const useGetOneScheduleQuery = ({ id, enabled }: { id: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['schedule', id],
    queryFn: () => scheduleApiRequest.getOneSchedule(id.toString()),
    enabled
  })
}
