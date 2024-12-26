import { z } from 'zod'

const configSchema = z.object({
  NEXT_PUBLIC_API_END_POINT: z.string(),
  NEXT_PUBLIC_URL: z.string(),
  NEXT_PUBLIC_STREAM_API_KEY: z.string(),
  NEXT_PUBLIC_STREAM_SECRET_KEY: z.string()
})

const configProject = configSchema.safeParse({
  NEXT_PUBLIC_API_END_POINT: process.env.NEXT_PUBLIC_API_END_POINT,
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  NEXT_PUBLIC_STREAM_API_KEY: process.env.NEXT_PUBLIC_STREAM_API_KEY,
  NEXT_PUBLIC_STREAM_SECRET_KEY: process.env.NEXT_PUBLIC_STREAM_SECRET_KEY
})

if (!configProject.success) {
  console.error(configProject.error.errors)
  throw new Error('Các khai báo biến môi trường không hợp lệ hoặc bị thiếu!')
}

const envConfig = configProject.data

export default envConfig
