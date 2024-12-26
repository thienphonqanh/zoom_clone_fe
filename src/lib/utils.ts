/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { clsx, type ClassValue } from 'clsx'
import { UseFormSetError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { EntityError } from './http'
import { toast } from '@/hooks/use-toast'
import { jwtDecode } from 'jwt-decode'
import { MyJwtPayload } from '@/types/jwt.type'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

export const handleErrorApi = ({
  error,
  setError,
  duration
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message
      })
    })
  } else {
    toast({
      title: 'Lỗi',
      description: error?.payload?.message ?? 'Lỗi không xác định',
      variant: 'destructive',
      duration: duration ?? 5000
    })
  }
}

const isBrowser = typeof window !== 'undefined'

export const getAccessTokenFromLocalStorage = () => (isBrowser ? localStorage.getItem('accessToken') : null)

export const getRefreshTokenFromLocalStorage = () => (isBrowser ? localStorage.getItem('refreshToken') : null)

export const setAccessTokenToLocalStorage = (value: string) => isBrowser && localStorage.setItem('accessToken', value)

export const setRefreshTokenToLocalStorage = (value: string) => isBrowser && localStorage.setItem('refreshToken', value)

export const removeTokensFromLocalStorage = () => {
  isBrowser && localStorage.removeItem('accessToken')
  isBrowser && localStorage.removeItem('refreshToken')
}

export function getDecodedToken(token: string): MyJwtPayload {
  return jwtDecode<MyJwtPayload>(token)
}

export function formatDateTime(time: Date | string | undefined) {
  if (!time) return { date: '', time: '' }
  const dateObj = typeof time === 'string' ? new Date(time) : time
  // UTC + 7
  dateObj.setHours(dateObj.getHours() + 7)
  const day = dateObj.getUTCDate()
  const month = dateObj.getUTCMonth() + 1 // Tháng bắt đầu từ 0
  const year = dateObj.getUTCFullYear()
  const hour = dateObj.getUTCHours()
  const minute = dateObj.getUTCMinutes().toString().padStart(2, '0') // Đảm bảo phút luôn 2 chữ số
  return {
    date: `${day}/${month}/${year}`,
    time: `${hour}:${minute}`
  }
}

export function isCurrentDateTimeInRange(
  startTime: Date | undefined,
  endTime: Date | undefined,
  currentTime: Date = new Date()
): string {
  if (!startTime || !endTime) {
    throw new Error('Không tìm thấy ngày giờ hiện tại')
  }
  const startDateTime = new Date(startTime.toString())
  const endDateTime = new Date(endTime.toString())
  if (currentTime.getTime() >= startDateTime.getTime() && currentTime.getTime() <= endDateTime.getTime()) {
    return 'Ongoing'
  } else if (currentTime.getTime() < startDateTime.getTime()) {
    return 'Scheduled'
  } else if (currentTime.getTime() > endDateTime.getTime()) {
    return 'Completed'
  }
  return ''
}
