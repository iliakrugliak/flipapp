import { NextResponse } from 'next/server'

export async function GET() {
  const data = {
    name: 'Vid Coffee',
    address: 'ул. Примерная, 123',
    phone: '+7 999 123-45-67',
    coordinates: [55.751244, 37.618423],
    menuItems: [
      { id: 1, name: 'Капучино', price: 250, quantity: 10 },
      { id: 2, name: 'Латте', price: 280, quantity: 8 }
    ],
    offers: [
      {
        id: 1,
        title: 'Утренний кофе',
        description: 'Скидка 20% на все напитки до 11:00',
        discount: '20%',
        validUntil: '2023-12-31',
        isActive: true
      }
    ]
  }

  return NextResponse.json(data)
}
