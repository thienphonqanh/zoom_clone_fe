export interface GetAllScheduleResponse {
  id?: number
  name?: string
  startTime?: Date
  endTime?: Date
  description?: string
  status?: string
  room?: {
    id?: number
    name?: string
    is_active?: boolean
  }
}
