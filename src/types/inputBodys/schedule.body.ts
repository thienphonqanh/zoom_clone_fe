import { z } from 'zod'

export const ScheduleBody = z
  .object({
    name: z.string().min(1, 'Tên sự kiện là bắt buộc'),
    roomId: z.string(),
    start_time: z.string().min(1, 'Thời gian bắt đầu là bắt buộc'),
    end_time: z.string().min(1, 'Thời gian kết thúc là bắt buộc'),
    description: z.string().optional(),
    gen_room: z.boolean().optional()
  })
  .strict()
  .refine((data) => new Date(data.start_time) < new Date(data.end_time), {
    message: 'Thời gian kết thúc phải sau thời gian bắt đầu',
    path: ['end_time']
  })

export const UpdateScheduleBody = z
  .object({
    name: z.string().min(1, 'Tên sự kiện là bắt buộc'),
    roomId: z.string(),
    startTime: z.string().min(1, 'Thời gian bắt đầu là bắt buộc'),
    endTime: z.string().min(1, 'Thời gian kết thúc là bắt buộc'),
    description: z.string().optional(),
    gen_room: z.boolean().optional()
  })
  .strict()
  .refine((data) => new Date(data.startTime) < new Date(data.endTime), {
    message: 'Thời gian kết thúc phải sau thời gian bắt đầu',
    path: ['endTime']
  })
