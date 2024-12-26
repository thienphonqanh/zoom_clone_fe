'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterReqBody } from '@/types/requests/user.requests'
import { RegisterBody } from '@/types/inputBodys/auth.body'
import { useRegisterMutation } from '@/queries/useAuth'
import { handleErrorApi } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { omit } from 'lodash'

export default function RegisterForm() {
  const registerMutation = useRegisterMutation()
  const router = useRouter()
  const form = useForm<RegisterReqBody>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (data: RegisterReqBody) => {
    if (registerMutation.isPending) return
    try {
      const result = await registerMutation.mutateAsync(omit(data, 'confirmPassword'))
      toast({
        title: 'Thành công',
        description: result.payload.message,
        className: 'bg-green-500 text-white'
      })
      router.push('/login')
    } catch (error) {
      handleErrorApi({ error, setError: form.setError })
    }
  }

  return (
    <div className="container flex flex-col items-center justify-center w-full h-full">
      <Image className="w-28 h-auto" src="logo.svg" alt="logo" width={0} height={0} />
      <Image className="w-44 h-auto mt-3" src="workplace.svg" alt="workplace" width={0} height={0} />
      <Form {...form}>
        <form
          className="space-y-2 max-w-[420px] flex-shrink-0 w-full mt-10"
          noValidate
          onSubmit={form.handleSubmit(onSubmit, console.log)}
        >
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-2">
                    <Input
                      id="name"
                      className="py-5 placeholder:text-sm placeholder:text-gray-400"
                      type="text"
                      placeholder="Họ và tên"
                      required
                      {...field}
                    />
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-2">
                    <Input
                      id="email"
                      className="py-5 placeholder:text-sm placeholder:text-gray-400"
                      type="email"
                      placeholder="Nhập email"
                      required
                      {...field}
                    />
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-2">
                    <div className="flex items-center"></div>
                    <Input
                      id="password"
                      className="py-5 placeholder:text-sm placeholder:text-gray-400"
                      type="password"
                      placeholder="Mật khẩu"
                      required
                      {...field}
                    />
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-2">
                    <div className="flex items-center"></div>
                    <Input
                      id="confirmPassword"
                      className="py-5 placeholder:text-sm placeholder:text-gray-400"
                      type="password"
                      placeholder="Nhập lại mật khẩu"
                      required
                      {...field}
                    />
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full py-5 mt-3 font-bold">
              Đăng ký
            </Button>
            <div className="flex items-center justify-center italic text-sm">
              <span className="text-gray-400">Bạn đã có tài khoản?</span>
              <button type="button" className="ml-1 font-bold hover:opacity-70" onClick={() => router.push('/login')}>
                Đăng nhập
              </button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
