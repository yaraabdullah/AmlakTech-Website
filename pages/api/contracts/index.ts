import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { ownerId, status } = req.query

      if (!ownerId) {
        return res.status(400).json({ error: 'ownerId is required' })
      }

      const ownerIdBigInt = BigInt(ownerId as string)
      const contracts = await prisma.contract.findMany({
        where: {
          ownerId: ownerIdBigInt,
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
          tenant: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
              userId: true,
              user: {
                select: {
                  id: true,
                  first_name: true,
                  last_name: true,
                  email: true,
                },
              },
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

      // Convert BigInt values to strings for JSON serialization
      const contractsWithStrings = contracts.map(contract => ({
        ...contract,
        ownerId: contract.ownerId.toString(),
        tenant: contract.tenant ? {
          ...contract.tenant,
          userId: contract.tenant.userId?.toString() || null,
          user: contract.tenant.user ? {
            ...contract.tenant.user,
            id: contract.tenant.user.id.toString(),
          } : null,
        } : null,
      }))

      return res.status(200).json(contractsWithStrings)
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
        tenantId,
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

      if (!propertyId || !ownerId || !type || !startDate || !endDate || !monthlyRent) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      // At least tenantId or tenantName should be provided
      if (!tenantId && !tenantName) {
        return res.status(400).json({ error: 'Either tenantId or tenantName is required' })
      }

      const ownerIdBigInt = BigInt(ownerId)
      
      // Prepare contract data
      const contractData: any = {
        propertyId,
        unitId: unitId || null,
        ownerId: ownerIdBigInt,
        tenantId: tenantId || null,
        tenantName: tenantId ? null : (tenantName || null),
        tenantEmail: tenantId ? null : (tenantEmail || null),
        tenantPhone: tenantId ? null : (tenantPhone || null),
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        monthlyRent: parseFloat(monthlyRent),
        deposit: deposit ? parseFloat(deposit) : null,
        notes: notes || null,
        status: 'نشط',
      }

      const contract = await prisma.contract.create({
        data: contractData,
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
          tenant: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      })

      // Convert BigInt values to strings for JSON serialization
      const contractWithStrings = {
        ...contract,
        ownerId: contract.ownerId.toString(),
        tenant: contract.tenant ? contract.tenant : null,
      }

      return res.status(201).json(contractWithStrings)
    } catch (error: any) {
      console.error('Error creating contract:', error)
      return res.status(500).json({ error: 'Failed to create contract', details: error.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

