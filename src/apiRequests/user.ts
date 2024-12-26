import http from '@/lib/http'
import { ResponseDataType } from '@/types/responses/responseDataType'
import { GetMeResponse } from '@/types/responses/user.responses'

const userApiRequest = {
  me: () => http.get<ResponseDataType<GetMeResponse>>('/users/me')
}

export default userApiRequest
