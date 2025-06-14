import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  const { login, password } = await request.json()

  try {
    // 1. Находим заведение по логину
    const venue = await prisma.venue.findUnique({
      where: { login }
    })

    // 2. Проверяем пароль
    if (!venue || !(await bcrypt.compare(password, venue.password))) {
      return NextResponse.json(
        { success: false, message: 'Неверные учетные данные' },
        { status: 401 }
      )
    }

    // 3. Создаем сессию
    const sessionToken = crypto.randomUUID()
    
    await prisma.session.create({
      data: {
        token: sessionToken,
        venueId: venue.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 неделя
      }
    })

    // 4. Устанавливаем cookie
    ;(await
      // 4. Устанавливаем cookie
      cookies()).set('venue_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return NextResponse.json({ 
      success: true,
      redirectUrl: `/venue/dashboard/${venue.id}`
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}