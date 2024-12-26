'use client'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { UpdateScheduleBody } from '@/types/inputBodys/schedule.body'
import { UpdateScheduleReqBody } from '@/types/requests/schedule.requests'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, ChevronDown, Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
// import moment from 'moment'
import { useGetAllScheduleQuery, useGetOneScheduleQuery, useUpdateScheduleMutation } from '@/queries/useSchedule'
import { GetAllScheduleResponse } from '@/types/responses/getAllSchedule.responses'
import { useCreateRoomMutation } from '@/queries/useRoom'
import { handleErrorApi, isCurrentDateTimeInRange } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import moment from 'moment-timezone'
interface EditScheduleProps {
  id: number | undefined
  onUpdate: () => void
}

export default function EditSchedule({ id, onUpdate }: EditScheduleProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false) // Quản lý trạng thái dialog
  const getOneScheduleQuery = useGetOneScheduleQuery({ enabled: Boolean(id), id: id as number })
  const { data } = getOneScheduleQuery
  const updateScheduleMutation = useUpdateScheduleMutation()
  const createRoomMutation = useCreateRoomMutation()
  const getAllScheduleMutation = useGetAllScheduleQuery()
  const form = useForm<UpdateScheduleReqBody>({
    resolver: zodResolver(UpdateScheduleBody),
    defaultValues: {
      name: '',
      roomId: '',
      startTime: '',
      endTime: '',
      description: '',
      gen_room: true
    }
  })

  useEffect(() => {
    if (data) {
      const { name, startTime, endTime, room, description } = data.payload.data as GetAllScheduleResponse
      const startTimeToLocale = moment(startTime).tz('Asia/Ho_Chi_Minh')
      const endTimeToLocale = moment(endTime).tz('Asia/Ho_Chi_Minh')
      form.reset({
        name,
        roomId: room?.name ?? '',
        startTime: startTime
          ? moment(startTime)
              .tz('Asia/Ho_Chi_Minh')
              .format(`YYYY-MM-DD ${startTimeToLocale.hours() - 7}:mm`)
          : '',
        endTime: endTime
          ? moment(endTime)
              .tz('Asia/Ho_Chi_Minh')
              .format(`YYYY-MM-DD ${endTimeToLocale.hours() - 7}:mm`)
          : '',
        description
      })
    }
  }, [data, form])

  const onSubmit = async (data: UpdateScheduleReqBody) => {
    if (updateScheduleMutation.isPending) return
    try {
      if ((data.gen_room && !data.roomId) || (!data.gen_room && !data.roomId)) {
        const result = await createRoomMutation.mutateAsync()
        data = { ...data, roomId: result.payload.data as string }
      }
      const status = isCurrentDateTimeInRange(new Date(data.startTime), new Date(data.endTime))
      const scheduleId = String(id)
      data = { ...data, id: scheduleId, status }
      const result = await updateScheduleMutation.mutateAsync(data)
      await getAllScheduleMutation.refetch()
      toast({
        title: 'Thành công',
        description: result.payload.message ?? 'Tạo sự kiện thành công',
        className: 'bg-green-500 text-white'
      })
      handleCloseDialog()
      onUpdate()
    } catch (error) {
      handleErrorApi({ error, setError: form.setError })
    }
  }

  const handleCloseDialog = async () => {
    await getOneScheduleQuery.refetch()
    setIsDialogOpen(!isDialogOpen)
    form.reset()
  }
  return (
    <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
      <DialogTrigger>
        <Pencil size={25} className="p-1 hover:bg-gray-100 rounded-lg" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sửa lịch trình</DialogTitle>
          <DialogDescription>Sửa thông tin lịch trình cuộc họp trong kế hoạch của bạn</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form noValidate autoComplete="off" onSubmit={form.handleSubmit(onSubmit, console.log)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full mb-4">
                  <Input
                    {...field}
                    id="name"
                    placeholder="Tên sự kiện"
                    tabIndex={-1}
                    required
                    autoFocus={true}
                    className="placeholder:font-semibold font-bold h-11 border-none outline-none bg-gray-100 shadow-md"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem className="w-[240px]">
                  <Input
                    {...field}
                    id="roomId"
                    placeholder="Mã phòng"
                    tabIndex={-1}
                    className="placeholder:font-semibold font-bold h-11 border-none outline-none bg-gray-100 shadow-md"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gen_room"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4 mb-1 mx-1">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Tạo phòng tự động</FormLabel>
                    <FormDescription>
                      Chọn nếu bạn cần tạo ngay một phòng họp mới bất kỳ để sử dụng cho lịch trình
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Alert className="mt-3 text-sm border-[#36be88]">
              <AlertCircle className="h-4 w-4 !text-[#36be88]" />
              <AlertTitle className="text-[#36be88]">Lưu ý</AlertTitle>
              <AlertDescription className="text-[#36be88] text-[13px]">
                Mặc định tự chọn tạo phòng tự động nếu bạn không nhập mã phòng (mã phòng có thể tạo ở trang chủ).
              </AlertDescription>
            </Alert>
            <div className="flex justify-start gap-2 items-start mt-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormControl>
                      <div className="relative w-[160px]">
                        <DatePicker
                          {...field}
                          id="startTime"
                          selected={field.value ? new Date(field.value) : new Date()}
                          onChange={(date: Date | null) =>
                            date && field.onChange(moment(date).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm'))
                          }
                          showTimeSelect
                          placeholderText="Bắt đầu"
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="dd/MM/yyyy HH:mm"
                          className="w-full border-2 rounded-md p-2 h-10 text-sm"
                          preventOpenOnFocus
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <span className="text-sm mt-3">đến</span>
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormControl>
                      <div className="relative w-[160px]">
                        <DatePicker
                          {...field}
                          id="endTime"
                          selected={field.value ? new Date(field.value) : new Date()}
                          onChange={(date: Date | null) =>
                            date && field.onChange(moment(date).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm'))
                          }
                          showTimeSelect
                          placeholderText="Kết thúc"
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="dd/MM/yyyy HH:mm"
                          className="w-full border-2 rounded-md p-2 h-10 text-sm"
                          preventOpenOnFocus
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormControl>
                    <Textarea
                      id="description"
                      placeholder="Thêm mô tả (nếu có)..."
                      className="resize-none h-36 rounded-xl placeholder:italic"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button type="submit" className="py-3 px-5 font-bold bg-blue-500 hover:bg-blue-600">
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
