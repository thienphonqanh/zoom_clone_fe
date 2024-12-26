import http from '@/lib/http'
import { LoginReqBody, LogoutReqBody, RegisterReqBody } from '@/types/requests/user.requests'
import { LoginResponse } from '@/types/responses/login.responses'
import { ResponseDataType } from '@/types/responses/responseDataType'

const authApiRequest = {
  sLogin: (body: LoginReqBody) => http.post<ResponseDataType<LoginResponse>>('/auth/login', body),
  login: (body: LoginReqBody) =>
    http.post<ResponseDataType<LoginResponse>>('/api/auth/login', body, {
      baseUrl: ''
    }),
  sRegister: (body: Omit<RegisterReqBody, 'confirmPassword'>) => http.post<ResponseDataType>('/auth/register', body),
  register: (body: Omit<RegisterReqBody, 'confirmPassword'>) =>
    http.post<ResponseDataType>('/api/auth/register', body, {
      baseUrl: ''
    }),
  sLogout: (body: LogoutReqBody) => http.post<ResponseDataType>('/auth/logout', body),
  // Client gọi đến route handler, không cần truyền RT vào body vì RT tự động gửi thông qua cookie rồi
  logout: () => http.post<ResponseDataType>('/api/auth/logout', null, { baseUrl: '' })
}

export default authApiRequest
