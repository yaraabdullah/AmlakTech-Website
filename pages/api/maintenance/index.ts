import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { ownerId, status, propertyId } = req.query

      if (!ownerId) {
        return res.status(400).json({ error: 'ownerId is required' })
      }

      const maintenance = await prisma.maintenanceRequest.findMany({
        where: {
          ownerId: ownerId as string,
          ...(status && { status: status as string }),
          ...(propertyId && { propertyId: propertyId as string }),
        },
        include: {
          property: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return res.status(200).json(maintenance)
    } catch (error) {
      console.error('Error fetching maintenance requests:', error)
      return res.status(500).json({ error: 'Failed to fetch maintenance requests' })
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        propertyId,
        ownerId,
        unit,
        type,
        priority,
        problemDescription,
        contactName,
        contactPhone,
        scheduledDate,
        notifyTenant,
      } = req.body

      if (!propertyId || !ownerId || !type || !problemDescription) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const maintenance = await prisma.maintenanceRequest.create({
        data: {
          propertyId,
          ownerId,
          unit,
          type,
          priority: priority || 'medium',
          problemDescription,
          contactName,
          contactPhone,
          scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
          status: scheduledDate ? 'مجدولة' : 'قيد الانتظار',
        },
        include: {
          property: true,
        },
      })

      return res.status(201).json(maintenance)
    } catch (error) {
      console.error('Error creating maintenance request:', error)
      return res.status(500).json({ error: 'Failed to create maintenance request' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

