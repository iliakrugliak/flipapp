import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  const { name, login, password, address, phone } = await request.json()

  const hashedPassword = await bcrypt.hash(password, 12)
  
  try {
    const venue = await prisma.venue.create({
      data: {
        name,
        login,
        password: hashedPassword,
        address,
        phone,
        coordinates: [0, 0] // Дефолтные координаты
      }
    })

    return NextResponse.json({ success: true, venueId: venue.id })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Логин уже занят' },
      { status: 400 }
    )
  }
}