import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      email,
      firstName,
      lastName,
      nationalId,
      phone,
      password,
      userType,
      city,
      neighborhood,
      postalCode,
    } = req.body

    // Validate required fields
    if (!email || !firstName || !lastName || !password || !userType || !nationalId || !phone) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['email', 'firstName', 'lastName', 'password', 'userType', 'nationalId', 'phone']
      })
    }

    // Map Arabic user types to database values
    const userTypeMap: { [key: string]: string } = {
      'مالك عقار': 'owner',
      'مستأجر': 'tenant',
      'مزود خدمة': 'service_provider',
      'مدير عقارات': 'property_manager'
    }

    const dbUserType = userTypeMap[userType]
    if (!dbUserType) {
      return res.status(400).json({ error: 'Invalid user type' })
    }

    // Check if user already exists by email
    const existingUserByEmail = await prisma.users.findUnique({
      where: { email },
    })

    if (existingUserByEmail) {
      return res.status(400).json({ error: 'User with this email already exists' })
    }

    // Check if user already exists by phone
    const existingUserByPhone = await prisma.users.findUnique({
      where: { phone_number: phone },
    })

    if (existingUserByPhone) {
      return res.status(400).json({ error: 'User with this phone number already exists' })
    }

    // Check if user already exists by national ID
    const existingUserByNationalId = await prisma.users.findUnique({
      where: { national_id: nationalId },
    })

    if (existingUserByNationalId) {
      return res.status(400).json({ error: 'User with this national ID already exists' })
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.users.create({
      data: {
        email,
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        password_hash: passwordHash,
        national_id: nationalId,
        user_type: dbUserType,
        city: city || null,
        neighborhood: neighborhood || null,
        postal_code: postalCode || null,
        is_verified: false,
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        phone_number: true,
        national_id: true,
        user_type: true,
        city: true,
        neighborhood: true,
        postal_code: true,
        is_verified: true,
        created_at: true,
      },
    })

    // Map back to camelCase for frontend
    const userResponse = {
      id: user.id.toString(),
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone_number,
      nationalId: user.national_id,
      userType: user.user_type,
      city: user.city,
      neighborhood: user.neighborhood,
      postalCode: user.postal_code,
      isVerified: user.is_verified,
      createdAt: user.created_at,
    }

    return res.status(201).json({
      message: 'Account created successfully',
      user: userResponse,
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return res.status(500).json({ error: 'Failed to create user' })
  }
}

