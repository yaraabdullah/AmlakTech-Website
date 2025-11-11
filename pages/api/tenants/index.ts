import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { phoneNumber, email, nationalId, userId } = req.query

      const tenantInclude = {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        contracts: {
          include: {
            property: {
              select: {
                id: true,
                name: true,
                address: true,
                city: true,
                neighborhood: true,
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
        },
      }

      let tenant = null

      if (userId) {
        try {
          tenant = await prisma.tenant.findUnique({
            where: {
              userId: BigInt(userId as string),
            },
            include: tenantInclude,
          })
        } catch (error) {
          console.error('Error fetching tenant by userId:', error)
          return res.status(500).json({ error: 'Failed to fetch tenant' })
        }
      } else if (phoneNumber) {
        tenant = await prisma.tenant.findUnique({
          where: {
            phoneNumber: phoneNumber as string,
          },
          include: tenantInclude,
        })
      } else if (email) {
        tenant = await prisma.tenant.findUnique({
          where: {
            email: email as string,
          },
          include: tenantInclude,
        })
      } else if (nationalId) {
        tenant = await prisma.tenant.findUnique({
          where: {
            nationalId: nationalId as string,
          },
          include: tenantInclude,
        })
      }

      if (!tenant) {
        return res.status(404).json(null)
      }

      // Convert BigInt values to strings for JSON serialization
      const tenantWithStrings = {
        ...tenant,
        userId: tenant.userId?.toString() || null,
        user: tenant.user
          ? {
              ...tenant.user,
              id: tenant.user.id.toString(),
            }
          : null,
        contracts: tenant.contracts
          ? tenant.contracts.map((contract) => ({
              ...contract,
              ownerId: contract.ownerId.toString(),
              payments: contract.payments
                ? contract.payments.map((payment) => ({
                    ...payment,
                    ownerId: payment.ownerId.toString(),
                    contractId: payment.contractId || null,
                  }))
                : [],
            }))
          : [],
      }

      return res.status(200).json(tenantWithStrings)
    } catch (error) {
      console.error('Error fetching tenant:', error)
      return res.status(500).json({ error: 'Failed to fetch tenant' })
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        nationalId,
        city,
        address,
        emergencyContact,
        emergencyPhone,
        userId,
        notes,
      } = req.body

      if (!firstName || !lastName || !phoneNumber) {
        return res.status(400).json({ error: 'Missing required fields: firstName, lastName, phoneNumber' })
      }

      // Check if tenant already exists by phone number
      const existingTenant = await prisma.tenant.findUnique({
        where: {
          phoneNumber: phoneNumber,
        },
      })

      if (existingTenant) {
        // Update existing tenant
        const updatedTenant = await prisma.tenant.update({
          where: {
            id: existingTenant.id,
          },
          data: {
            firstName,
            lastName,
            email: email || existingTenant.email,
            nationalId: nationalId || existingTenant.nationalId,
            city: city || existingTenant.city,
            address: address || existingTenant.address,
            emergencyContact: emergencyContact || existingTenant.emergencyContact,
            emergencyPhone: emergencyPhone || existingTenant.emergencyPhone,
            userId: userId ? BigInt(userId) : existingTenant.userId,
            notes: notes || existingTenant.notes,
          },
          include: {
            user: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
              },
            },
          },
        })

        const tenantWithStrings = {
          ...updatedTenant,
          userId: updatedTenant.userId?.toString() || null,
          user: updatedTenant.user ? {
            ...updatedTenant.user,
            id: updatedTenant.user.id.toString(),
          } : null,
        }

        return res.status(200).json(tenantWithStrings)
      }

      // Create new tenant
      const tenant = await prisma.tenant.create({
        data: {
          firstName,
          lastName,
          email: email || null,
          phoneNumber,
          nationalId: nationalId || null,
          city: city || null,
          address: address || null,
          emergencyContact: emergencyContact || null,
          emergencyPhone: emergencyPhone || null,
          userId: userId ? BigInt(userId) : null,
          notes: notes || null,
          status: 'نشط',
        },
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
            },
          },
        },
      })

      // Convert BigInt values to strings for JSON serialization
      const tenantWithStrings = {
        ...tenant,
        userId: tenant.userId?.toString() || null,
        user: tenant.user ? {
          ...tenant.user,
          id: tenant.user.id.toString(),
        } : null,
      }

      return res.status(201).json(tenantWithStrings)
    } catch (error: any) {
      console.error('Error creating/updating tenant:', error)
      return res.status(500).json({ error: 'Failed to create/update tenant', details: error.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
