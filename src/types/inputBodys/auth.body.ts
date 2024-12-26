import { z } from 'zod'

export const LoginBody = z
  .object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu không ít hơn 6 ký tự').max(100, 'Mật khẩu không nhiều hơn 100 ký tự')
  })
  .strict()

export const RegisterBody = z
  .object({
    name: z.string().min(2, 'Tên không ít hơn 2 ký tự').max(100, 'Tên không nhiều hơn 100 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu không ít hơn 6 ký tự').max(100, 'Mật khẩu không nhiều hơn 100 ký tự'),
    confirmPassword: z.string().min(6, 'Mật khẩu không ít hơn 6 ký tự').max(100, 'Mật khẩu không nhiều hơn 100 ký tự')
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'] // Đặt lỗi vào trường confirmPassword
  })

export const LogoutBody = z
  .object({
    refreshToken: z.string()
  })
  .strict()
