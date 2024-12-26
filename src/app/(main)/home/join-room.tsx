import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import JoinRoomform from './join-form'

export default function JoinRoom() {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex flex-col items-center">
            <button className="bg-blue-500 p-6 rounded-3xl hover:bg-blue-600 transition duration-150">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#3b82f6"
                className="w-10 h-10 bg-white rounded-md p-1"
              >
                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
              </svg>
            </button>
            <span className="text-sm mt-3 mb-12 cursor-pointer">Tham gia</span>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tham gia phòng</DialogTitle>
            <DialogDescription>
              Hãy nhập mã phòng mà bạn muốn tham gia vào ô phía dưới để tham gia phòng họp.
            </DialogDescription>
          </DialogHeader>
          <JoinRoomform />
        </DialogContent>
      </Dialog>
    </div>
  )
}
