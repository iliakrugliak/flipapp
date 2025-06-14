import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('venue_session')?.value
  const path = request.nextUrl.pathname

  // 1. Проверяем маршруты кабинета
  if (path.startsWith('/venue/dashboard')) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // 2. Проверяем сессию в БД
    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: { venue: true }
    })

    if (!session) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('venue_session')
      return response
    }

    // 3. Проверяем доступ к конкретному кабинету
    const venueId = path.split('/')[3]
    if (session.venueId !== venueId) {
      return NextResponse.redirect(new URL(`/venue/dashboard/${session.venueId}`, request.url))
    }
  }

  return NextResponse.next()
}