import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get the first owner (for demo purposes)
    // In production, this would come from authentication/session
    const user = await prisma.users.findFirst({
      where: {
        user_type: 'owner',
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'No owner found' })
    }

    // Map to camelCase for frontend
    return res.status(200).json({
      id: user.id.toString(),
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
    })
  } catch (error) {
    console.error('Error fetching owner:', error)
    return res.status(500).json({ error: 'Failed to fetch owner' })
  }
}

