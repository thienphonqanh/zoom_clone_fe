'use client'

import { useCallback } from 'react'
import { toast } from '@/hooks/use-toast'

export const useCopyToClipboard = () => {
  const copyToClipboard = useCallback((text: string) => {
    if (!text) {
      toast({
        title: 'Lỗi',
        description: 'Không có nội dung để sao chép',
        variant: 'destructive'
      })
      return
    }

    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: 'Thành công',
          description: 'Đã sao chép thành công',
          className: 'bg-green-500 text-white'
        })
      },
      (error) => {
        toast({
          title: 'Lỗi',
          description: error?.message || 'Sao chép thất bại',
          variant: 'destructive'
        })
      }
    )
  }, [])

  return { copyToClipboard }
}
