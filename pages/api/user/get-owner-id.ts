import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get the first owner user (for demo purposes)
    // In production, this would come from authentication
    const owner = await prisma.user.findFirst({
      where: {
        userType: 'مالك عقار',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    })

    if (!owner) {
      return res.status(404).json({ error: 'No owner found' })
    }

    return res.status(200).json(owner)
  } catch (error) {
    console.error('Error fetching owner:', error)
    return res.status(500).json({ error: 'Failed to fetch owner' })
  }
}

