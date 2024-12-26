export interface LoginReqBody {
  email: string
  password: string
}

export interface RegisterReqBody {
  email: string
  password: string
  confirmPassword: string
  name: string
}

export interface UpdateMeReqBody {
  name: string
  country: string
  dob: Date
  phone: string
}

export interface LogoutReqBody {
  refreshToken: string
}

export interface CheckRoomReqBody {
  roomId: string
}
