'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useCopyToClipboard } from '@/hooks/use-copy'
import { toast } from '@/hooks/use-toast'
import { handleErrorApi } from '@/lib/utils'
import { useCreateRoomMutation } from '@/queries/useRoom'
import { Copy } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const CREATE_AND_JOIN_CALL = 'CreateAndJoinCall'
const CREATE_CALL = 'CreateCall'

export default function CreateRoom() {
  const createRoomMutation = useCreateRoomMutation()
  const [roomId, setRoomId] = useState<string | undefined>('')
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { copyToClipboard } = useCopyToClipboard()

  const handleSelectOption = async (option: string) => {
    if (createRoomMutation.isPending) return

    try {
      const result = await createRoomMutation.mutateAsync()
      toast({
        title: 'Thành công',
        description:
          result.payload.message ??
          (option === CREATE_AND_JOIN_CALL ? 'Tạo phòng và tham gia thành công' : 'Tạo phòng thành công'),
        className: 'bg-green-500 text-white'
      })
      if (option === CREATE_AND_JOIN_CALL) {
        router.push('/room/' + result.payload.data)
      } else {
        setRoomId(result.payload.data as string)
        setOpen(true)
      }
    } catch (error) {
      handleErrorApi({ error })
    }
  }
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex flex-col items-center">
            <button className="bg-orange-500 p-6 rounded-3xl hover:bg-orange-600 transition duration-150" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF" className="w-10 h-10">
                <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
              </svg>
            </button>
            <span className="text-sm mt-3 mb-12 cursor-pointer">Tạo cuộc họp</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="-translate-y-1/2" side="bottom" align="center">
          <DropdownMenuItem className="px-3 cursor-pointer" onClick={() => handleSelectOption(CREATE_AND_JOIN_CALL)}>
            Tạo cuộc họp tức thì
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="px-3 cursor-pointer" onClick={() => handleSelectOption(CREATE_CALL)}>
            Tạo mã để dùng sau
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mã tham gia</DialogTitle>
            <DialogDescription>
              Hãy gửi mã phòng này tới những người mà bạn muốn họp cùng Bạn hãy nhớ lưu lại mã để có thể sử dụng sau.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Input value={roomId} tabIndex={-1} readOnly />
            <Button
              type="button"
              size="sm"
              tabIndex={-1}
              className="px-3 bg-gray-50 text-black border-gray-300 hover:bg-gray-200"
              onClick={() => copyToClipboard(roomId || '')}
            >
              <span className="sr-only">Copy</span>
              <Copy />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
