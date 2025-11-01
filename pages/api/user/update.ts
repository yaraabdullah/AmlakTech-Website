import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      userId,
      firstName,
      lastName,
      email,
      nationalId,
      phone,
      address,
      newPassword,
      currentPassword,
    } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' })
    }

    // Get current user
    const userIdBigInt = BigInt(userId)
    const user = await prisma.users.findUnique({
      where: { id: userIdBigInt },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // If updating password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to change password' })
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash)
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' })
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' })
      }
    }

    // Update user data
    const updateData: any = {}

    if (firstName !== undefined) updateData.first_name = firstName
    if (lastName !== undefined) updateData.last_name = lastName
    if (email !== undefined) {
      // Check if email is already taken by another user
      const emailExists = await prisma.users.findFirst({
        where: {
          email,
          id: { not: userIdBigInt },
        },
      })

      if (emailExists) {
        return res.status(400).json({ error: 'Email already in use' })
      }
      updateData.email = email
    }
    if (nationalId !== undefined) {
      // Check if national ID is already taken by another user
      if (nationalId) {
        const nationalIdExists = await prisma.users.findFirst({
          where: {
            national_id: nationalId,
            id: { not: userIdBigInt },
          },
        })

        if (nationalIdExists) {
          return res.status(400).json({ error: 'National ID already in use' })
        }
      }
      updateData.national_id = nationalId || null
    }
    if (phone !== undefined) {
      // Check if phone is already taken by another user
      if (phone) {
        const phoneExists = await prisma.users.findFirst({
          where: {
            phone_number: phone,
            id: { not: userIdBigInt },
          },
        })

        if (phoneExists) {
          return res.status(400).json({ error: 'Phone number already in use' })
        }
      }
      updateData.phone_number = phone || null
    }
    if (newPassword) {
      updateData.password_hash = await bcrypt.hash(newPassword, 10)
    }

    const updatedUser = await prisma.users.update({
      where: { id: userIdBigInt },
      data: updateData,
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        national_id: true,
        phone_number: true,
        user_type: true,
        updated_at: true,
      },
    })

    // Map to camelCase for frontend
    return res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: updatedUser.id.toString(),
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        nationalId: updatedUser.national_id,
        phone: updatedUser.phone_number,
        userType: updatedUser.user_type,
        updatedAt: updatedUser.updated_at,
      },
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return res.status(500).json({ error: 'Failed to update user' })
  }
}

