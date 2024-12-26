'use client'

import {
  CallParticipantsList,
  CancelCallButton,
  ReactionsButton,
  RecordCallButton,
  SpeakerLayout,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
  useCallStateHooks
} from '@stream-io/video-react-sdk'
import { Grid2X2, LayoutGrid, MessageSquareText, PanelTop, UsersRound, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider } from './ui/sidebar'
import { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { MessageInput, MessageList } from 'stream-chat-react'
import { CustomScreenShareButton } from './share-screen'
import CustomPaginateGridLayout from './paginate-grid-custom'
import { useTrackCurrentTime } from '@/hooks/use-time'

export default function MeetingRoom() {
  const router = useRouter()
  const { useParticipants } = useCallStateHooks()
  const participants = useParticipants()
  const roomId = usePathname().split('/')[2]
  const [changeLayout, setChangeLayout] = useState<string>('PaginatedGridLayout')
  const [isParticipantsSidebarOpen, setParticipantsSidebarOpen] = useState(false)
  const [isMessagesSidebarOpen, setMessagesSidebarOpen] = useState(false)
  const { time } = useTrackCurrentTime()

  const toggleParticipantsSidebar = () => {
    if (isMessagesSidebarOpen) setMessagesSidebarOpen(false)
    setParticipantsSidebarOpen(!isParticipantsSidebarOpen)
  }

  const toggleMessagesSidebar = () => {
    if (isParticipantsSidebarOpen) setParticipantsSidebarOpen(false)
    setMessagesSidebarOpen(!isMessagesSidebarOpen)
  }

  const handleChangeLayout = (layout: string) => {
    setChangeLayout(layout)
  }

  return (
    <div className="w-screen h-screen overflow-hidden">
      <div className="right-0 p-5 absolute z-[100]">
        <DropdownMenu>
          <DropdownMenuTrigger className="bg-[#19232d] flex justify-center items-center px-3 py-2 rounded-md">
            <LayoutGrid size={16} className="mr-1" />
            View
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#19232d] mt-2 text-white border-gray-700" side="bottom" align="center">
            <DropdownMenuItem
              className="flex justify-start items-center gap-2"
              onClick={() => handleChangeLayout('PaginatedGridLayout')}
            >
              <Grid2X2 size={16} className="place-self-center" /> Thư viện
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex justify-start items-center gap-2"
              onClick={() => handleChangeLayout('SpeakerLayout')}
            >
              <PanelTop size={16} className="place-self-center" /> Tiêu điểm
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {changeLayout === 'PaginatedGridLayout' ? (
        <div className={`flex items-center justify-center w-full h-[93%]`}>
          <CustomPaginateGridLayout />
        </div>
      ) : (
        <div className={`flex items-center justify-center ${participants.length == 1 ? 'w-full h-full' : ''}  p-5`}>
          <SpeakerLayout participantsBarPosition="top" />
        </div>
      )}
      <footer className="bg-[#101213] h-16 shadow-inner fixed bottom-0 w-full">
        <div className="grid grid-cols-12 items-center h-full w-full px-28">
          <div className="col-span-2 font-bold text-sm flex items-center gap-2">
            <span>{time}</span>
            <div className="w-[2px] h-4 bg-white"></div>
            <span>{roomId}</span>
          </div>
          <div className="col-span-8 flex items-center justify-center gap-x-3">
            <ToggleAudioPublishingButton />
            <ToggleVideoPublishingButton />
            <ReactionsButton />
            <CustomScreenShareButton />
            <RecordCallButton />
            <CancelCallButton onClick={() => router.push('/home')} />
          </div>
          <div className="col-span-2 w-full">
            <button onClick={toggleParticipantsSidebar}>
              <div className="relative w-[max-content] cursor-pointer">
                <UsersRound size={40} className="bg-[#19232d] p-2 rounded-full hover:bg-[#354351]" />
                <div className="bg-gray-500 text-white w-4 h-4 absolute top-0 right-0 rounded-full text-xs text-center -translate-y-1 translate-x-1">
                  {participants.length}
                </div>
              </div>
            </button>
            <button onClick={toggleMessagesSidebar} className="mx-4">
              <div className="w-[max-content] cursor-pointer">
                <MessageSquareText size={40} className="bg-[#19232d] p-2 rounded-full hover:bg-[#354351]" />
              </div>
            </button>
          </div>
        </div>
      </footer>
      <SidebarProvider
        open={isParticipantsSidebarOpen}
        style={
          {
            '--sidebar-width': '320px',
            '--sidebar-background': '200deg 8.57% 6.86%'
          } as React.CSSProperties
        }
      >
        <Sidebar className="h-[620px] m-auto text-white border-none outline-none pr-3" side="right">
          <SidebarContent className="p-3">
            <CallParticipantsList onClose={toggleParticipantsSidebar} />
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
      <SidebarProvider
        open={isMessagesSidebarOpen}
        style={
          {
            '--sidebar-width': '340px',
            '--sidebar-background': '200deg 8.57% 6.86%'
          } as React.CSSProperties
        }
      >
        <Sidebar className="h-[620px] m-auto text-white border-none outline-none pr-3" side="right">
          <SidebarHeader className="items-center justify-between px-3 py-2 flex-row">
            <h3 className="justify-items-start">Trò chuyện</h3>
            <X
              size={30}
              className="bg-[#19232d] p-2 rounded-full hover:bg-[#374350] cursor-pointer justify-items-end"
              onClick={toggleMessagesSidebar}
            />
          </SidebarHeader>
          <SidebarContent className="px-1">
            <MessageList hideDeletedMessages={true} onlySenderCanEdit={true} disableDateSeparator={true} />
            <div className="mb-2">
              <MessageInput />
            </div>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>
  )
}
