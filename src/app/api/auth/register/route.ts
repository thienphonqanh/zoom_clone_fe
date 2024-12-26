import authApiRequest from '@/apiRequests/auth'
import { HttpError } from '@/lib/http'
import { RegisterReqBody } from '@/types/requests/user.requests'

export async function POST(request: Request) {
  const body = (await request.json()) as Omit<RegisterReqBody, 'confirmPassword'>
  try {
    const { payload } = await authApiRequest.sRegister(body)
    return Response.json(payload)
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status
      })
    } else {
      return Response.json(
        {
          message: 'Có lỗi xảy ra'
        },
        {
          status: 500
        }
      )
    }
  }
}
