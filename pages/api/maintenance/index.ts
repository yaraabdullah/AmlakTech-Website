import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { ownerId, status, propertyId } = req.query

      if (!ownerId) {
        return res.status(400).json({ error: 'ownerId is required' })
      }

      const ownerIdBigInt = BigInt(ownerId as string)
      
      try {
        const maintenance = await prisma.maintenanceRequest.findMany({
          where: {
            ownerId: ownerIdBigInt,
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

        // Convert BigInt values to strings for JSON serialization
        const maintenanceWithStrings = maintenance.map(item => ({
          ...item,
          ownerId: item.ownerId.toString(),
          property: item.property ? item.property : null,
        }))

        return res.status(200).json(maintenanceWithStrings)
      } catch (dbError: any) {
        // If table doesn't exist, return empty array
        if (dbError.code === 'P2021') {
          console.warn('Maintenance requests table does not exist yet. Returning empty array.')
          return res.status(200).json([])
        }
        throw dbError
      }
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

      const ownerIdBigInt = BigInt(ownerId)
      
      try {
        const maintenance = await prisma.maintenanceRequest.create({
          data: {
            propertyId,
            ownerId: ownerIdBigInt,
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

        // Convert BigInt values to strings for JSON serialization
        const maintenanceWithStrings = {
          ...maintenance,
          ownerId: maintenance.ownerId.toString(),
        }

        return res.status(201).json(maintenanceWithStrings)
      } catch (dbError: any) {
        // If table doesn't exist, return error message
        if (dbError.code === 'P2021') {
          console.error('Maintenance requests table does not exist. Please create the table first.')
          return res.status(503).json({ 
            error: 'Maintenance requests table does not exist. Please run CREATE_ALL_TABLES.sql in Supabase.' 
          })
        }
        throw dbError
      }
    } catch (error) {
      console.error('Error creating maintenance request:', error)
      return res.status(500).json({ error: 'Failed to create maintenance request' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

