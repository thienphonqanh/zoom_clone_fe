'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginReqBody } from '@/types/requests/user.requests'
import { LoginBody } from '@/types/inputBodys/auth.body'
import { useLoginMutation } from '@/queries/useAuth'
import { handleErrorApi } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const loginMutation = useLoginMutation()
  const router = useRouter()
  const form = useForm<LoginReqBody>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: LoginReqBody) => {
    if (loginMutation.isPending) return
    try {
      const result = await loginMutation.mutateAsync(data)
      toast({
        title: 'Thành công',
        description: result.payload.message,
        className: 'bg-green-500 text-white'
      })
      router.push('/home')
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
            <Button type="submit" className="w-full py-5 mt-3 font-bold">
              Đăng nhập
            </Button>
            <div className="text-end">
              <button
                type="button"
                className="font-light text-gray-500 italic text-sm hover:underline"
                onClick={() => router.push('/')}
              >
                Quên mật khẩu?
              </button>
            </div>
            <div className="flex justify-center items-center">
              <div className="w-full h-0.5 bg-gray-100"></div>
              <div className="w-full text-center text-gray-500 text-xs font-bold">Hoặc đăng nhập với</div>
              <div className="w-full h-0.5 bg-gray-100"></div>
            </div>
            <div className="flex items-center w-full justify-center">
              <button type="button" onClick={() => router.push('/')}>
                <Image
                  src="google.svg"
                  alt="google"
                  width={50}
                  height={50}
                  className="border-2 p-2 border-gray-200 hover:bg-gray-100 hover:border-gray-400 transition duration-150 cursor-pointer rounded-xl"
                />
              </button>
            </div>
            <div className="flex items-center justify-center italic text-sm">
              <span className="text-gray-400">Bạn chưa có tài khoản?</span>
              <button
                type="button"
                className="ml-1 font-bold hover:opacity-70"
                onClick={() => router.push('/register')}
              >
                Đăng ký
              </button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
