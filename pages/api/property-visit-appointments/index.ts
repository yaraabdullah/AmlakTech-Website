import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const {
        propertyId,
        ownerId,
        requesterId,
        requesterName,
        requesterEmail,
        requesterPhone,
        visitType,
        scheduledDate,
        timeSlot,
        notes,
      } = req.body

      if (!propertyId || !ownerId || !requesterName || !visitType || !scheduledDate || !timeSlot) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const appointment = await prisma.propertyVisitAppointment.create({
        data: {
          propertyId,
          ownerId: BigInt(ownerId),
          requesterId: requesterId ? BigInt(requesterId) : null,
          requesterName,
          requesterEmail: requesterEmail || null,
          requesterPhone: requesterPhone || null,
          visitType,
          scheduledDate: new Date(scheduledDate),
          timeSlot,
          notes: notes || null,
        },
        include: {
          property: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      return res.status(201).json({
        ...appointment,
        ownerId: appointment.ownerId.toString(),
        requesterId: appointment.requesterId ? appointment.requesterId.toString() : null,
      })
    } catch (error) {
      console.error('Error creating property visit appointment:', error)
      return res.status(500).json({ error: 'Failed to create appointment' })
    }
  }

  if (req.method === 'GET') {
    try {
      const { ownerId, propertyId } = req.query

      const filters: any = {}
      if (ownerId) {
        filters.ownerId = BigInt(ownerId as string)
      }
      if (propertyId) {
        filters.propertyId = propertyId as string
      }

      const appointments = await prisma.propertyVisitAppointment.findMany({
        where: filters,
        orderBy: {
          scheduledDate: 'asc',
        },
      })

      const response = appointments.map((appointment) => ({
        ...appointment,
        ownerId: appointment.ownerId.toString(),
        requesterId: appointment.requesterId ? appointment.requesterId.toString() : null,
      }))

      return res.status(200).json(response)
    } catch (error) {
      console.error('Error fetching property visit appointments:', error)
      return res.status(500).json({ error: 'Failed to fetch appointments' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: 'Method not allowed' })
}
