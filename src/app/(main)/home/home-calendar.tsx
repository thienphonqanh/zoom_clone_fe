'use client'

import { useTrackCurrentTime } from '@/hooks/use-time'
import { useDeleteScheduleMutation, useGetAllScheduleQuery } from '@/queries/useSchedule'
import { useGetMe } from '@/queries/useUser'
import { CalendarPlus2, MapPin, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { formatDateTime, handleErrorApi, isCurrentDateTimeInRange } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import envConfig from '@/config'
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
import { toast } from '@/hooks/use-toast'
import EditSchedule from '../schedule/edit-schedule'

export default function HomeCalendar() {
  const { time, date } = useTrackCurrentTime()
  const getAllScheduleMutation = useGetAllScheduleQuery()
  const { data, isLoading } = getAllScheduleMutation
  const { data: user } = useGetMe()
  const deleteScheduleMutation = useDeleteScheduleMutation()
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
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  const renderSchedules = () => {
    if (!data?.payload?.data?.length) {
      return (
        <div className="flex flex-col justify-center items-center text-sm mt-8">
          <Image src="/notschedule.png" alt="notschedule" width={200} height={200} quality={50} />
          <h2 className="text-gray-500 font-light">Không có cuộc họp nào được lên lịch.</h2>
          <h2 className="text-gray-500 font-light">Hãy tận hưởng ngày hôm nay!</h2>
          <Link href="/schedule" className="flex items-center justify-center mt-2 text-blue-500 hover:text-blue-600">
            <CalendarPlus2 size={18} className="mx-1" /> Lên lịch một cuộc họp
          </Link>
        </div>
      )
    }
    return data.payload.data.map((schedule) => {
      const { date: startDate, time: startTime } = formatDateTime(schedule.startTime)
      const { time: endTime } = formatDateTime(schedule.endTime)
      return (
        <Popover key={schedule.id}>
          <PopoverTrigger className="w-full text-start">
            <div
              className={`${
                isCurrentDateTimeInRange(schedule.startTime, schedule.endTime) === 'Ongoing'
                  ? 'bg-blue-100/70 hover:border-blue-500'
                  : 'bg-white'
              } w-full h-[max-content] p-3 rounded-xl border border-gray-300 mb-2 hover:border-gray-700`}
            >
              <p className="text-sm font-semibold text-gray-600">{schedule.name}</p>
              {isCurrentDateTimeInRange(schedule.startTime, schedule.endTime) === 'Ongoing' ? (
                <p className="text-xs text-red-800 font-semibold mt-1">Now</p>
              ) : (
                <p className="text-xs text-gray-600 mt-1">{startDate}</p>
              )}
              <p className="text-xs text-gray-600">{startTime + ' - ' + endTime}</p>
              <p className="text-xs text-gray-600">Người tạo: {user?.payload?.data?.name}</p>
              {isCurrentDateTimeInRange(schedule.startTime, schedule.endTime) !== 'Ongoing' ? (
                <div></div>
              ) : (
                <div className="text-xs mt-2 p-2 w-[max-content] text-white rounded-md font-semibold bg-blue-500 hover:bg-blue-600 border-none outline-none focus-visible:ring-0">
                  <Link href={`${envConfig.NEXT_PUBLIC_URL}/room/${schedule.room?.name}`}>Bắt đầu</Link>
                </div>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="max-w-[400px] w-[380px] h-[max-content] mb-20" side="left" align="start">
            <div>
              <p className="font-semibold mb-1">{schedule.name}</p>
              <p className="text-[15px]">
                {'Ngày ' + formatDateTime(schedule.startTime).date} {formatDateTime(schedule.startTime).time}
              </p>
              <div className="flex justify-start items-center gap-1">
                <MapPin size={18} />
                <Link href={`${envConfig.NEXT_PUBLIC_URL}/room/${schedule.room?.name}`}>
                  {schedule?.room && (
                    <span className="text-cyan-600 text-sm">
                      {`${envConfig.NEXT_PUBLIC_URL}/room/${schedule.room['name']}`}{' '}
                    </span>
                  )}
                </Link>
              </div>
              <Link href={`${envConfig.NEXT_PUBLIC_URL}/room/${schedule.room?.name}`}>
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
                    <span>ID: {schedule.id}</span>
                    <span>Phòng họp: {schedule.room?.name}</span>
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
                  value={schedule.description}
                  readOnly
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <EditSchedule id={schedule.id} onUpdate={() => {}} />
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
                      onClick={() => handleDeleteSchedule(String(schedule.id))}
                    >
                      Xoá
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </PopoverContent>
        </Popover>
      )
    })
  }
  return (
    <div>
      <div
        className="w-[98%] mx-auto rounded-lg mt-1 h-28 object-contain bg-no-repeat flex flex-col justify-center items-center"
        style={{ backgroundImage: 'url("/timebg.jpg")' }}
      >
        <h1 className="font-bold text-3xl text-gray-600">{time}</h1>
        <h2 className="font-semibold text-lg text-gray-600">{date}</h2>
      </div>
      <div className="w-full h-[max-content] bg-gray-50 bg-opacity-50 text-sm p-3 text-gray-500">
        <h2>
          Phản hồi các sự kiện, xem tình trạng rảnh rỗi của người khác và nhiều hơn nữa bằng các kết nối{' '}
          <Link href="/schedule" className="text-blue-500 hover:text-blue-600">
            Lịch của bạn
          </Link>
        </h2>
      </div>
      {isLoading ? (
        <div className="w-full h-full flex items-center space-x-4 p-4">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
        <div className="pl-4 py-3">
          <ScrollArea className="h-[350px] w-full pr-4 hover:cursor-default">{renderSchedules()}</ScrollArea>
        </div>
      )}
    </div>
  )
}
