'use server'
import prisma from '@/lib/prisma'

export async function updateVenue(venueId: string, data: any) {
  return await prisma.venue.update({
    where: { id: venueId },
    data
  })
}