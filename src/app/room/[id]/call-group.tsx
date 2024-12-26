'use client'

import { useStreamContext } from '@/components/stream-provider'
import { Call, StreamCall, StreamTheme, StreamVideo } from '@stream-io/video-react-sdk'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import '@stream-io/video-react-sdk/dist/css/styles.css'
import 'stream-chat-react/dist/css/v2/index.css'
import LobbyPreview from '@/components/lobby-preview'
import MeetingRoom from '@/components/meeting-room'
import { Channel, Chat } from 'stream-chat-react'
import { Channel as ChannelChat, DefaultGenerics } from 'stream-chat'

export default function VideoCallGroup() {
  const { client, chatClient } = useStreamContext()
  const [call, setCall] = useState<Call | null>(null)
  const [channel, setChannel] = useState<ChannelChat<DefaultGenerics> | null>(null)
  const callId = usePathname().split('/')[2]
  const [isSetupComplete, setIsSetupComplete] = useState(false)

  useEffect(() => {
    if (!client) return

    const myCall = client.call('default', callId as string)
    myCall
      .getOrCreate()
      .then(() => {
        myCall.camera.enable()
        myCall.microphone.enable()
      })
      .catch((err) => console.error('Lỗi khi tạo call:', err))

    setCall(myCall)

    return () => {
      myCall.leave().catch((err) => console.error('Lỗi khi rời khỏi call:', err))
      setCall(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, callId])

  useEffect(() => {
    if (!call || !chatClient) return

    const myChannel = chatClient.channel('messaging', callId)
    myChannel
      .create()
      .then(() => myChannel.watch())
      .catch((err) => console.error('Lỗi khi tạo channel:', err))

    setChannel(myChannel)

    return () => setChannel(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatClient, callId])

  if (!client || !chatClient || !call || !channel) return null

  return (
    <StreamTheme>
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <Chat client={chatClient} theme="str-chat__theme-dark">
            <Channel channel={channel}>
              {!isSetupComplete ? <LobbyPreview setIsSetupComplete={setIsSetupComplete} /> : <MeetingRoom />}
            </Channel>
          </Chat>
        </StreamCall>
      </StreamVideo>
    </StreamTheme>
  )
}
