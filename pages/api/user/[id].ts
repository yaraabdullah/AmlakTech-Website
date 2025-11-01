import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const userId = BigInt(id as string)
      const user = await prisma.users.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          national_id: true,
          phone_number: true,
          user_type: true,
          profile_image: true,
          is_verified: true,
          created_at: true,
          updated_at: true,
          // Don't return password_hash
        },
      })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      // Map to camelCase for frontend
      return res.status(200).json({
        id: user.id.toString(),
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        nationalId: user.national_id,
        phone: user.phone_number,
        userType: user.user_type,
        profileImage: user.profile_image,
        isVerified: user.is_verified,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      })
    } catch (error) {
      console.error('Error fetching user:', error)
      return res.status(500).json({ error: 'Failed to fetch user' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

