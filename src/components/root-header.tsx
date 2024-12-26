'use client'

import Image from 'next/image'
import { Button } from './ui/button'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAccessTokenFromLocalStorage } from '@/lib/utils'
import { useEffect, useState } from 'react'

export default function RootHeader() {
  const router = useRouter()
  const pathName = usePathname()
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAuth(Boolean(getAccessTokenFromLocalStorage()))
    }
  }, [])
  return (
    <header className="fixed top-0 w-full shadow-2xl z-[100]">
      {pathName === '/' && (
        <div className="grid grid-cols-2 items-center py-4 px-24">
          <div className="col-span-1">
            <Link href={'/'}>
              <Image className="w-28 h-auto" src="/logolight.svg" alt="logo" width={0} height={0} />
            </Link>
          </div>
          <div className="col-span-1 place-self-end">
            {isAuth ? (
              <Button
                onClick={() => router.push('/home')}
                className="bg-transparent border-[2px] border-blue-700 text-blue-700 mx-2 rounded-full hover:bg-blue-200"
              >
                Trở về trang chủ
              </Button>
            ) : (
              <div>
                <Button
                  onClick={() => router.push('/register')}
                  className="bg-transparent border-[2px] border-blue-700 text-blue-700 mx-2 rounded-full hover:bg-blue-200"
                >
                  Đăng ký
                </Button>
                <Button onClick={() => router.push('/login')} className="bg-blue-700 rounded-full hover:bg-blue-800">
                  Đăng nhập
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
