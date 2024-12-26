import { useEffect, useState } from 'react'

interface DateTime {
  time: string
  date: string
}

export function useTrackCurrentTime(): DateTime {
  const [dateTime, setDateTime] = useState<DateTime>(() => {
    const now = new Date()
    return {
      time: now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h12' // Cố định định dạng 12-hour
      }),
      date: formatDate(now)
    }
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setDateTime({
        time: now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hourCycle: 'h12' // Cố định định dạng 12-hour
        }),
        date: formatDate(now)
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return dateTime
}

function formatDate(date: Date): string {
  const formatter = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
  return formatter.format(date)
}
