import http from '@/lib/http'
import { CheckRoomReqBody } from '@/types/requests/user.requests'
import { ResponseDataType } from '@/types/responses/responseDataType'

const roomApiRequest = {
  createRoom: () => http.get<ResponseDataType>('/rooms/room'),
  checkRoom: (body: CheckRoomReqBody) => http.post<ResponseDataType>('/rooms/room', body),
  getStreamToken: () => http.get<ResponseDataType>('/rooms/stream-token')
}

export default roomApiRequest
