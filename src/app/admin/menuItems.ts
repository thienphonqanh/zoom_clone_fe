import { Home, User, ScrollText } from 'lucide-react'

const menuItems = [
  {
    title: 'Dashboard',
    Icon: Home,
    href: '/admin/dashboard'
  },
  {
    title: 'Người dùng',
    Icon: User,
    href: '/admin/accounts'
  },
  {
    title: 'Phòng họp',
    Icon: ScrollText,
    href: '/admin/rooms'
  }
]

export default menuItems
