import { z } from 'zod'

export const RoomBody = z
  .object({
    roomId: z.string().min(18, 'Mã phòng họp phải có 18 ký tự bao gồm dấu -')
  })
  .strict()
