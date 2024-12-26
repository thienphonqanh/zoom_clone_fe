export interface CreateUserReqBody {
  name: string
  email: string
  password: string
}

export interface UpdateUserReqBody {
  id: number
  name: string
  email: string
  password: string
}
