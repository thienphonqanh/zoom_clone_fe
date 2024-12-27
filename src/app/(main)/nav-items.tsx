'use client'

import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

const menuItems = [
  {
    title: 'Trang chủ',
    href: '/home',
    img: '/home.png'
  },
  {
    title: 'Lịch trình',
    href: '/schedule',
    img: '/calendar.png'
  }
]

export default function NavItems({ className }: { className?: string }) {
  const pathName = usePathname()
  return menuItems.map((item) => {
    return (
      <div
        key={item.href}
        className={`flex flex-col items-center justify-center min-w-[70px] min-h-[50px] rounded-t-lg cursor-pointer ${
          pathName === item.href ? 'bg-white' : 'bg-transparent hover:bg-gray-300'
        } `}
      >
        <Image src={item.img} alt={item.title} width={17} height={17} />
        <Link href={item.href} className={className}>
          {item.title}
        </Link>
      </div>
    )
  })
}
