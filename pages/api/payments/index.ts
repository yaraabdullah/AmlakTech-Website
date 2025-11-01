import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { ownerId, status, contractId } = req.query

      if (!ownerId) {
        return res.status(400).json({ error: 'ownerId is required' })
      }

      const ownerIdBigInt = BigInt(ownerId as string)
      const payments = await prisma.payment.findMany({
        where: {
          ownerId: ownerIdBigInt,
          ...(status && { status: status as string }),
          ...(contractId && { contractId: contractId as string }),
        },
        include: {
          contract: {
            select: {
              id: true,
              tenantName: true,
              property: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          dueDate: 'desc',
        },
      })

      return res.status(200).json(payments)
    } catch (error) {
      console.error('Error fetching payments:', error)
      return res.status(500).json({ error: 'Failed to fetch payments' })
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        contractId,
        ownerId,
        type,
        amount,
        dueDate,
        paymentMethod,
        notes,
      } = req.body

      if (!ownerId || !type || !amount || !dueDate) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const ownerIdBigInt = BigInt(ownerId)
      const payment = await prisma.payment.create({
        data: {
          contractId: contractId || null,
          ownerId: ownerIdBigInt,
          type,
          amount: parseFloat(amount),
          dueDate: new Date(dueDate),
          paymentMethod,
          notes,
          status: 'مستحقة',
        },
        include: {
          contract: true,
        },
      })

      return res.status(201).json(payment)
    } catch (error) {
      console.error('Error creating payment:', error)
      return res.status(500).json({ error: 'Failed to create payment' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

