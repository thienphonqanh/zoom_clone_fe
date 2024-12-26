'use client'

import {
  Avatar,
  DeviceSelectorAudioInput,
  DeviceSelectorVideo,
  useCall,
  VideoPreview
} from '@stream-io/video-react-sdk'
import { useState } from 'react'
import { Button } from './ui/button'
import lobbyPreviewBackground from '../../public/lobby-preview.png'
import { LogIn, Mic, MicOff, Video, VideoOff } from 'lucide-react'
import { getAccessTokenFromLocalStorage, getDecodedToken } from '@/lib/utils'
const { user_id, user_name } = getDecodedToken(getAccessTokenFromLocalStorage() as string)

export default function Lobby({ setIsSetupComplete }: { setIsSetupComplete: (value: boolean) => void }) {
  const [isMicMuted, setIsMicMuted] = useState(false)
  const [isCamOff, setIsCamOff] = useState(false)

  const call = useCall()
  if (!call) {
    throw new Error('Call có vẻ chưa được khởi tạo!')
  }

  const toggleMicrophone = () => {
    if (isMicMuted) {
      call.microphone.enable()
    } else {
      call.microphone.disable()
    }
    setIsMicMuted(!isMicMuted)
  }

  const toggleCamera = () => {
    if (isCamOff) {
      call.camera.enable()
    } else {
      call.camera.disable()
    }
    setIsCamOff(!isCamOff)
  }

  return (
    <div
      className="flex h-screen w-full flex-col items-center justify-center text-white"
      style={{
        backgroundImage: `url(${lobbyPreviewBackground.src})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <h1 className="text-center text-2xl font-bold mb-4">Thiết lập cuộc gọi của bạn trước khi tham gia</h1>
      <div className="relative">
        <VideoPreview
          DisabledVideoPreview={DisabledVideoPreviewIcon}
          className="!w-[40vw] !h-[40vh] !border-4 !border-gray-700 !bg-[#1b232c] !bg-opacity-60"
        />
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-4 mb-1">
          <button
            className={`rounded-full bg-transparent p-2 text-white hover:bg-gray-600/45 ${
              isCamOff ? '!bg-red-500 hover:!bg-red-500/90' : ''
            }`}
            onClick={toggleCamera}
          >
            {isCamOff ? <VideoOff size={22} /> : <Video size={22} />}
          </button>
          <button
            className={`rounded-full bg-transparent p-2 text-white hover:bg-gray-600/45 ${
              isMicMuted ? '!bg-red-500 hover:!bg-red-500/90' : ''
            }`}
            onClick={toggleMicrophone}
          >
            {isMicMuted ? <MicOff size={22} /> : <Mic size={22} />}
          </button>
        </div>
      </div>
      <div className="flex w-[40vw] justify-center">
        <div className="!w-1/2">
          <DeviceSelectorVideo visualType="dropdown" />
        </div>
        <div className="!w-1/2">
          <DeviceSelectorAudioInput visualType="dropdown" />
        </div>
      </div>
      <Button
        className="rounded-full bg-blue-600 py-5 w-[30vw] mt-4 hover:bg-blue-500"
        onClick={() => {
          setIsSetupComplete(true)
          call.join().catch((err) => {
            console.error('Lỗi khi tham gia: ', err)
          })
        }}
      >
        <LogIn /> Tham gia
      </Button>
    </div>
  )
}

const DisabledVideoPreviewIcon = () => {
  return (
    <Avatar className="!w-24 !h-24" imageSrc={`https://getstream.io/random_png/?id=${user_id}&name=${user_name}`} />
  )
}
