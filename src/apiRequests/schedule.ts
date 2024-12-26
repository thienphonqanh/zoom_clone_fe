import http from '@/lib/http'
import { CreateScheduleReqBody, UpdateScheduleReqBody } from '@/types/requests/schedule.requests'
import { GetAllScheduleResponse } from '@/types/responses/getAllSchedule.responses'
import { ResponseDataType } from '@/types/responses/responseDataType'

const scheduleApiRequest = {
  getAllSchedule: () => http.get<ResponseDataType<GetAllScheduleResponse[]>>('/schedules/schedule'),
  createNewSchedule: (body: CreateScheduleReqBody) => http.post<ResponseDataType>('/schedules/schedule', body),
  deleteSchedule: (id: string) => http.delete<ResponseDataType>(`/schedules/schedule/${id}`),
  getOneSchedule: (id: string) => http.get<ResponseDataType<GetAllScheduleResponse>>(`/schedules/schedule/${id}`),
  updateSchedule: (body: UpdateScheduleReqBody) => http.put<ResponseDataType>('/schedules/schedule', body)
}

export default scheduleApiRequest
