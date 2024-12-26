import http from '@/lib/http'
import { AccountListResType, RoomListResType, UpdateUserAccountBodyType } from '@/types/inputBodys/admin.body'
import { CreateUserReqBody } from '@/types/requests/admin.requests'
import { GetAllUserResponse } from '@/types/responses/admin.responses'
import { ResponseDataType } from '@/types/responses/responseDataType'

const adminApiRequest = {
  getAllUser: () => http.get<AccountListResType>('/admins/user'),
  getOneUser: (id: string) => http.get<ResponseDataType<GetAllUserResponse>>(`/admins/user/${id}`),
  createUser: (data: CreateUserReqBody) => http.post<ResponseDataType>('/admins/user', data),
  updateUser: (data: UpdateUserAccountBodyType) => http.put<ResponseDataType>('/admins/user', data),
  deleteUser: (id: string) => http.delete<ResponseDataType>(`/admins/user/${id}`),
  deleteRoom: (id: string) => http.delete<ResponseDataType>(`/admins/room/${id}`),
  getAllRoom: () => http.get<RoomListResType>('/admins/room')
}

export default adminApiRequest
