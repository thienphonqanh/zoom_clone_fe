import { JwtPayload } from 'jwt-decode'

export interface MyJwtPayload extends JwtPayload {
  user_id: string
  user_name: string
  token_type: number
  role: string
  verify: number
  iat: number
  exp: number
}
