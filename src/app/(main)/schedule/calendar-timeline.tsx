'use client'

import { Calendar, momentLocalizer, View } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  AlertCircle,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  MapPin,
  Plus,
  RotateCw,
  Search,
  Trash2
} from 'lucide-react'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ScheduleBody } from '@/types/inputBodys/schedule.body'
import { CreateScheduleReqBody } from '@/types/requests/schedule.requests'
import { Button } from '@/components/ui/button'
import { useCreateNewScheduleMutation, useDeleteScheduleMutation, useGetAllScheduleQuery } from '@/queries/useSchedule'
import { toast } from '@/hooks/use-toast'
import { formatDateTime, handleErrorApi, isCurrentDateTimeInRange } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { GetAllScheduleResponse } from '@/types/responses/getAllSchedule.responses'
import { useCreateRoomMutation } from '@/queries/useRoom'
import Link from 'next/link'
import envConfig from '@/config'
import { Separator } from '@/components/ui/separator'
import { useGetMe } from '@/queries/useUser'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import EditSchedule from './edit-schedule'

const localizer = momentLocalizer(moment)
const views = [
  { id: 'month', name: 'Tháng' },
  { id: 'week', name: 'Tuần' },
  { id: 'day', name: 'Ngày' },
  { id: 'agenda', name: 'Lịch biểu' }
]

export default function MainCalendar() {
  const [currentView, setCurrentView] = useState<View>('month')
  const [currentDate, setCurrentDate] = useState(new Date()) // Ngày hiện tại
  const [events, setEvents] = useState<GetAllScheduleResponse[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false) // Quản lý trạng thái dialog
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false) // Quản lý trạng thái dialog
  const [selectedEvent, setSelectedEvent] = useState<GetAllScheduleResponse | undefined>(undefined)
  const createNewScheduleMutation = useCreateNewScheduleMutation()
  const createRoomMutation = useCreateRoomMutation()
  const deleteScheduleMutation = useDeleteScheduleMutation()
  const getAllScheduleMutation = useGetAllScheduleQuery()
  const { data: user } = useGetMe()

  useEffect(() => {
    if (getAllScheduleMutation.data) {
      const formattedEvents = getAllScheduleMutation.data?.payload?.data?.map((event) => ({
        title: event.name,
        start: new Date(event.startTime || ''),
        end: new Date(event.endTime || ''),
        ...event
      }))
      if (formattedEvents) {
        setEvents(formattedEvents)
      }
    }
  }, [getAllScheduleMutation.data])

  const form = useForm<CreateScheduleReqBody>({
    resolver: zodResolver(ScheduleBody),
    defaultValues: {
      name: '',
      roomId: '',
      start_time: '',
      end_time: '',
      description: '',
      gen_room: true
    }
  })

  const handleNavigate = (direction: 'prev' | 'next') => {
    const durationMap: Record<View, moment.unitOfTime.DurationConstructor> = {
      day: 'days',
      week: 'weeks',
      month: 'months',
      agenda: 'days',
      work_week: 'weeks'
    }
    const duration = durationMap[currentView] || 'months'
    const newDate =
      direction === 'prev'
        ? moment(currentDate).subtract(1, duration).toDate()
        : moment(currentDate).add(1, duration).toDate()
    setCurrentDate(newDate)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const currentMonthDisplay = moment(currentDate).format('MM/YYYY')

  const onSubmit = async (data: CreateScheduleReqBody) => {
    if (createNewScheduleMutation.isPending) return
    try {
      if ((data.gen_room && !data.roomId) || (!data.gen_room && !data.roomId)) {
        const result = await createRoomMutation.mutateAsync()
        data = { ...data, roomId: result.payload.data as string }
      }
      const status = isCurrentDateTimeInRange(new Date(data.start_time), new Date(data.end_time))
      data = { ...data, status }
      const result = await createNewScheduleMutation.mutateAsync(data)
      await getAllScheduleMutation.refetch()
      toast({
        title: 'Thành công',
        description: result.payload.message ?? 'Tạo sự kiện thành công',
        className: 'bg-green-500 text-white'
      })
      handleCloseDialog()
    } catch (error) {
      handleErrorApi({ error, setError: form.setError })
    }
  }

  const handleDeleteSchedule = async (id: string) => {
    if (deleteScheduleMutation.isPending) return
    try {
      const result = await deleteScheduleMutation.mutateAsync(id)
      await getAllScheduleMutation.refetch()
      toast({
        title: 'Thành công',
        description: result.payload.message ?? 'Xoá sự kiện thành công',
        className: 'bg-green-500 text-white'
      })
      handleCloseEventDialog()
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(!isDialogOpen)
    form.reset()
  }

  const handleSelectEvent = (event: GetAllScheduleResponse) => {
    setSelectedEvent(event)
    setIsEventDialogOpen(true)
  }

  const handleCloseEventDialog = () => {
    setIsEventDialogOpen(!isEventDialogOpen)
    setSelectedEvent(undefined)
  }

  const handleUpdateSchedule = async () => {
    handleCloseEventDialog()
  }
  return (
    <div className="grid grid-cols-12 items-center w-full h-full">
      <div className="col-span-2 h-full">
        <div className="h-16 w-full border-b-[1px] border-gray-200"></div>
        <div>
          <CalendarComponent
            mode="single"
            selected={currentDate} // Đồng bộ ngày
            onSelect={(date) => setCurrentDate(date as Date)} // Cập nhật ngày hiện tại
            month={currentDate} // Đồng bộ tháng hiển thị với currentDate
            className="shadow-sm"
            onMonthChange={(date) => setCurrentDate(date as Date)}
          />
        </div>
      </div>
      <div className="col-span-10 h-full">
        <div className="flex items-center justify-start h-16 w-full border-b-[1px] border-x-[1px] border-gray-200">
          <div className="w-full h-full flex items-center justify-start gap-2 px-3">
            <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
              <DialogTrigger>
                <Plus size={32} className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tạo lịch trình</DialogTitle>
                  <DialogDescription>Thêm mới một lịch trình cuộc họp cho kế hoạch của bạn</DialogDescription>
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
                        Mặc định tự chọn tạo phòng tự động nếu bạn không nhập mã phòng (mã phòng có thể tạo ở trang
                        chủ).
                      </AlertDescription>
                    </Alert>
                    <div className="flex justify-start gap-2 items-start mt-4">
                      <FormField
                        control={form.control}
                        name="start_time"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormControl>
                              <div className="relative w-[160px]">
                                <DatePicker
                                  {...field}
                                  id="start_time"
                                  selected={field.value ? new Date(field.value) : new Date()}
                                  onChange={(date: Date | null) =>
                                    date && field.onChange(moment(date).format('YYYY-MM-DD HH:mm'))
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
                        name="end_time"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormControl>
                              <div className="relative w-[160px]">
                                <DatePicker
                                  {...field}
                                  id="end_time"
                                  selected={field.value ? new Date(field.value) : new Date()}
                                  onChange={(date: Date | null) =>
                                    date && field.onChange(moment(date).format('YYYY-MM-DD HH:mm'))
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
                        Lưu
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <ChevronLeft
              size={24}
              className="p-1 border border-gray-200 rounded-md hover:bg-gray-100"
              onClick={() => handleNavigate('prev')}
            />
            <CalendarIcon
              size={24}
              className="p-1 border border-gray-200 rounded-md hover:bg-gray-100"
              onClick={handleToday}
            />
            <ChevronRight
              size={24}
              className="p-1 border border-gray-200 rounded-md hover:bg-gray-100"
              onClick={() => handleNavigate('next')}
            />
            <h1 className="text-2xl font-bold">Tháng {currentMonthDisplay}</h1>
          </div>
          <div className="w-full h-full flex items-center justify-end gap-2 px-3">
            <RotateCw size={26} className="p-1 hover:bg-gray-100 rounded-md" />
            <Search size={26} className="p-1 hover:bg-gray-100 rounded-md" />
            <Select defaultValue="all">
              <SelectTrigger className="w-[max-content] border-none outline-none shadow-none gap-1 focus:ring-0">
                <ListFilter size={18} />
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="my-host">Do bạn tổ chức</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="month" onValueChange={(value) => setCurrentView(value as View)}>
              <SelectTrigger className="w-[max-content] border-none outline-none shadow-none gap-1 focus:ring-0">
                <SelectValue placeholder="Agenda" />
              </SelectTrigger>
              <SelectContent>
                {views.map((view) => (
                  <SelectItem key={view.id} value={view.id}>
                    {view.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-auto">
          <div className="h-[82vh] w-full">
            <Calendar
              localizer={localizer}
              events={events}
              onSelectEvent={handleSelectEvent}
              startAccessor={(event) => new Date(event.startTime || '')}
              endAccessor={(event) => new Date(event.endTime || '')}
              defaultView="week"
              view={currentView}
              onView={(view) => setCurrentView(view)}
              date={currentDate} // Ngày hiện tại
              onNavigate={(date) => setCurrentDate(date)}
              style={{ height: '100%' }}
              toolbar={false}
              eventPropGetter={() => {
                return {
                  style: {
                    borderLeft: '4px solid #3182ce',
                    backgroundColor: '#dbeafe',
                    padding: '6px 4px',
                    color: 'black',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    lineHeight: '1rem',
                    borderRadius: '4px'
                  }
                }
              }}
            />
          </div>
        </div>
        <Dialog open={isEventDialogOpen} onOpenChange={handleCloseEventDialog}>
          <DialogContent className="max-w-[425px] h-[max-content]">
            <DialogHeader>
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div>
              <p className="font-semibold mb-1">{selectedEvent?.name}</p>
              <p className="text-[15px]">
                {'Ngày ' + formatDateTime(selectedEvent?.startTime).date}{' '}
                {formatDateTime(selectedEvent?.startTime).time}
              </p>
              <div className="flex justify-start items-center gap-1">
                <MapPin size={18} />
                <Link href={`${envConfig.NEXT_PUBLIC_URL}/room/${selectedEvent?.room?.name}`}>
                  {selectedEvent?.room && (
                    <span className="text-cyan-600 text-sm">
                      {`${envConfig.NEXT_PUBLIC_URL}/room/${selectedEvent.room['name']}`}{' '}
                    </span>
                  )}
                </Link>
              </div>
              <Link href={`${envConfig.NEXT_PUBLIC_URL}/room/${selectedEvent?.room?.name}`}>
                <Button
                  type="button"
                  className="mt-2 bg-blue-500 hover:bg-blue-600 border-none outline-none focus-visible:ring-0"
                >
                  Bắt đầu
                </Button>
              </Link>
              <Accordion type="single" collapsible className="no-underline text-cyan-600 mx-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Thông tin cuộc họp</AccordionTrigger>
                  <AccordionContent className="text-black/70 flex flex-col">
                    <span>ID: {selectedEvent?.id}</span>
                    <span>Phòng họp: {selectedEvent?.room?.name}</span>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="my-3 flex gap-2 items-center justify-start mx-1">
                <Avatar>
                  {/* <AvatarImage src={profile?.avatar ?? undefined} alt={profile?.name} /> */}
                  <AvatarFallback>{user?.payload?.data?.name.slice(0, 1).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-[15px]">{user?.payload?.data?.name}</span>
                  <span className="text-xs">Người tạo</span>
                </div>
              </div>
              <Separator className="mt-2" />
              <div className="mb-2">
                <p className="text-cyan-600 font-semibold text-sm mt-4 mb-2 mx-1">Mô tả cuộc họp</p>
                <Textarea
                  className="w-full h-32 bg-gray-100 focus-visible:ring-0 text-gray-700"
                  value={selectedEvent?.description}
                  readOnly
                />
              </div>
            </div>
            <DialogFooter>
              <EditSchedule id={selectedEvent?.id} onUpdate={handleUpdateSchedule} />
              <AlertDialog>
                <AlertDialogTrigger>
                  <Trash2 size={25} className="p-1 hover:bg-gray-100 rounded-lg" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Bạn có chắc chắn xoá?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Hành động này sẽ xoá vĩnh viễn cuộc họp này khỏi lịch trình của bạn, không thể hoàn tác sau khi
                      đồng ý. Hãy cân nhắc trước khi lựa chọn.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Huỷ</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-blue-500 hover:bg-blue-600"
                      onClick={() => handleDeleteSchedule(String(selectedEvent?.id))}
                    >
                      Xoá
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
