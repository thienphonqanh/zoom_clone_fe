import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import DarkModeToggle from '@/components/dark-mode-toggle'
import NavItems from '@/app/(main)/nav-items'
import DropdownAvatar from '../../components/dropdown-avatar'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 w-full flex pt-1 items-center gap-4 border-b bg-gray-200 px-4 md:px-6">
        <div className="font-bold">Workplace</div>
        <div className="group flex w-[12%] items-center bg-gray-300 hover:bg-gray-400 hover:bg-opacity-50 px-3 py-1 rounded-2xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.0}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm"
            readOnly
            className="cursor-default placeholder:text-black/80 font-light bg-transparent border-none outline-none pl-1 w-full text-sm"
          />
          <span className="text-xs text-black/80 flex-shrink-0">Ctrl + F</span>
        </div>
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-1 mx-auto">
          <NavItems className="text-muted-foreground transition-colors hover:text-foreground flex-shrink-0 text-xs font-light" />
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                <div className="font-bold">Workplace</div>
                <span className="sr-only">Zoom</span>
              </Link>
              <NavItems className="text-muted-foreground transition-colors hover:text-foreground" />
            </nav>
          </SheetContent>
        </Sheet>
        <div className="ml-auto">
          <DarkModeToggle />
        </div>
        <DropdownAvatar />
      </header>
      <main className="flex-grow">{children}</main>
    </div>
  )
}
