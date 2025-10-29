import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { ownerId, status } = req.query

      if (!ownerId) {
        return res.status(400).json({ error: 'ownerId is required' })
      }

      const contracts = await prisma.contract.findMany({
        where: {
          ownerId: ownerId as string,
          ...(status && { status: status as string }),
        },
        include: {
          property: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
          unit: {
            select: {
              id: true,
              unitNumber: true,
            },
          },
          payments: {
            orderBy: {
              dueDate: 'desc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return res.status(200).json(contracts)
    } catch (error) {
      console.error('Error fetching contracts:', error)
      return res.status(500).json({ error: 'Failed to fetch contracts' })
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        propertyId,
        unitId,
        ownerId,
        tenantName,
        tenantEmail,
        tenantPhone,
        type,
        startDate,
        endDate,
        monthlyRent,
        deposit,
        notes,
      } = req.body

      if (!propertyId || !ownerId || !tenantName || !type || !startDate || !endDate || !monthlyRent) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const contract = await prisma.contract.create({
        data: {
          propertyId,
          unitId: unitId || null,
          ownerId,
          tenantName,
          tenantEmail,
          tenantPhone,
          type,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          monthlyRent: parseFloat(monthlyRent),
          deposit: deposit ? parseFloat(deposit) : null,
          notes,
          status: 'نشط',
        },
        include: {
          property: true,
          unit: true,
        },
      })

      return res.status(201).json(contract)
    } catch (error) {
      console.error('Error creating contract:', error)
      return res.status(500).json({ error: 'Failed to create contract' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

