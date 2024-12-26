'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { UpdateUserAccountBody, UpdateUserAccountBodyType } from '@/types/inputBodys/admin.body'
import { useGetOneUserQuery, useUpdateUserMutation } from '@/queries/useAdmin'
import { toast } from '@/hooks/use-toast'
import { handleErrorApi } from '@/lib/utils'
import { useEffect } from 'react'
import { Switch } from '@/components/ui/switch'

export default function EditUser({
  id,
  setId,
  onSubmitSuccess
}: {
  id?: number | undefined
  setId: (value: number | undefined) => void
  onSubmitSuccess: () => void
}) {
  const { data } = useGetOneUserQuery({
    id: id as number,
    enabled: Boolean(id)
  })
  const updateUserMutation = useUpdateUserMutation()
  const form = useForm<UpdateUserAccountBodyType>({
    resolver: zodResolver(UpdateUserAccountBody),
    defaultValues: {
      name: '',
      email: '',
      password: undefined,
      confirmPassword: undefined,
      changePassword: false
    }
  })

  const changePassword = form.watch('changePassword')
  useEffect(() => {
    if (data) {
      const { name, email } = data.payload.data as UpdateUserAccountBodyType
      form.reset({
        name,
        email,
        changePassword: form.getValues('changePassword'),
        password: form.getValues('password'),
        confirmPassword: form.getValues('confirmPassword')
      })
    }
  }, [data, form])

  const onSubmit = async (data: UpdateUserAccountBodyType) => {
    if (updateUserMutation.isPending) return
    try {
      const body: UpdateUserAccountBodyType & { id: number } = {
        ...data,
        id: id as number
      }
      const result = await updateUserMutation.mutateAsync(body)
      toast({
        title: 'Thành công',
        description: result.payload.message ?? 'Sửa người dùng thành công',
        className: 'bg-green-500 text-white'
      })
      form.reset()
      onSubmitSuccess()
      setId(undefined)
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          setId(undefined)
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật tài khoản</DialogTitle>
          <DialogDescription>Các trường tên, email, mật khẩu là bắt buộc</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-employee-form"
            onSubmit={form.handleSubmit(onSubmit, console.log)}
            onReset={() => {
              form.reset()
            }}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="name">Tên</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="name" className="w-full" {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="email">Email</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="email" className="w-full" {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="changePassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="email">Đổi mật khẩu</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              {changePassword && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="password">Mật khẩu mới</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input id="password" className="w-full" type="password" {...field} />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              )}
              {changePassword && (
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input id="confirmPassword" className="w-full" type="password" {...field} />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              )}
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="edit-employee-form">
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
