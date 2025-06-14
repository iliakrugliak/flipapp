import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'venues.json')

export async function GET() {
  try {
    const file = await fs.readFile(filePath, 'utf-8')
    const venues = JSON.parse(file)
    return NextResponse.json(venues)
  } catch (error) {
    console.error('Ошибка чтения venues.json:', error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const updatedVenue = await req.json()

    // Читаем текущие данные
    const file = await fs.readFile(filePath, 'utf-8')
    let venues = JSON.parse(file)

    // Обновляем или добавляем заведение
    const index = venues.findIndex((v: any) => v.id === updatedVenue.id)
    if (index !== -1) {
      venues[index] = updatedVenue
    } else {
      venues.push(updatedVenue)
    }

    // Сохраняем обратно
    await fs.writeFile(filePath, JSON.stringify(venues, null, 2), 'utf-8')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Ошибка сохранения venues.json:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
