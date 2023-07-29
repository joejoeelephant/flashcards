import { NextResponse } from 'next/server'
import type { NextRequest} from 'next/server'
import { authCheck } from './components/auth/authCheck';
// This function can be marked `async` if using `await` inside

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token');
    if(!token) {
      return NextResponse.rewrite(new URL('/login', request.nextUrl ))
    }
}
 
// See "Matching Paths" below to learn more
export const config = {
    matcher: [
      /*
       * Match all request paths starting with:
       * - api (API routes)
       * and does not match the ones starting with:
       * - api/login (login route)
       * and does not match /login
       * and does not match _next/static|_next/image|favicon.ico)
       */
      // '/((?!login$).*)',
      '/api/((?!login).*)',
      '/((?!api|login|auth|_next/static|_next/image|favicon.ico).*)'
    ],
}