import z from 'zod'

export const AccountSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  country: z.string(),
  dob: z.string()
})

export type AccountType = z.TypeOf<typeof AccountSchema>

export const AccountListRes = z.object({
  message: z.string(),
  data: z.array(AccountSchema)
})

export type AccountListResType = z.TypeOf<typeof AccountListRes>

export const RoomListRes = z.object({
  message: z.string(),
  data: z.array(AccountSchema)
})

export type RoomListResType = z.TypeOf<typeof RoomListRes>

export const AccountRes = z
  .object({
    data: AccountSchema,
    message: z.string()
  })
  .strict()

export const CreateUserAccountBody = z
  .object({
    name: z.string().min(2, 'Tên không ít hơn 2 ký tự').max(100, 'Tên không nhiều hơn 100 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu không ít hơn 6 ký tự').max(100, 'Mật khẩu không nhiều hơn 100 ký tự'),
    confirmPassword: z.string().min(6, 'Mật khẩu không ít hơn 6 ký tự').max(100, 'Mật khẩu không nhiều hơn 100 ký tự')
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword']
      })
    }
  })

export type CreateUserAccountBodyType = z.TypeOf<typeof CreateUserAccountBody>

export const UpdateUserAccountBody = z
  .object({
    name: z.string().trim().min(2, 'Tên không ít hơn 2 ký tự').max(100, 'Tên không nhiều hơn 100 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    changePassword: z.boolean().optional(),
    password: z
      .string()
      .min(6, 'Mật khẩu không ít hơn 6 ký tự')
      .max(100, 'Mật khẩu không nhiều hơn 100 ký tự')
      .optional(),
    confirmPassword: z
      .string()
      .min(6, 'Mật khẩu không ít hơn 6 ký tự')
      .max(100, 'Mật khẩu không nhiều hơn 100 ký tự')
      .optional()
  })
  .strict()
  .superRefine(({ confirmPassword, password, changePassword }, ctx) => {
    if (changePassword) {
      if (!password || !confirmPassword) {
        ctx.addIssue({
          code: 'custom',
          message: 'Hãy nhập mật khẩu mới và xác nhận mật khẩu mới',
          path: ['changePassword']
        })
      } else if (confirmPassword !== password) {
        ctx.addIssue({
          code: 'custom',
          message: 'Mật khẩu không khớp',
          path: ['confirmPassword']
        })
      }
    }
  })

export type UpdateUserAccountBodyType = z.TypeOf<typeof UpdateUserAccountBody>
