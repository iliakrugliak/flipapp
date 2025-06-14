import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const sessionToken = (await cookies()).get('auth_token')?.value

  if (!sessionToken) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    )
  }

  // Здесь можно проверить токен в базе данных
  // const session = await prisma.session.findUnique(...)

  return NextResponse.json({ 
    authenticated: true,
    user: { login: 'admin' } // Замените на данные из БД
  })
}