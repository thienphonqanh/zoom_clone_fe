import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getDecodedToken } from './lib/utils'
import { Role } from './types/status.enum'

const privatePaths = ['/manage', '/profile', '/home', '/room', '/schedule', '/admin']
const unAuthPaths = ['/login']
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  // pathname: /manage/dashboard
  const isAuth = Boolean(request.cookies.get('accessToken')?.value)
  if (isAuth) {
    const { role } = getDecodedToken(request.cookies.get('accessToken')?.value as string)
    console.log(role)

    if (pathname.startsWith('/admin') && role !== Role.Admin) {
      return NextResponse.redirect(new URL('/home', request.url))
    }
  }
  // Chưa đăng nhập thì không cho vào private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !isAuth) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  // Đăng nhập rồi thì sẽ không cho vào login nữa
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && isAuth) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return NextResponse.next()
}
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/manage/:path*', '/profile', '/login', '/home', '/room/:id*', '/schedule', '/admin', '/admin/:path*']
}
