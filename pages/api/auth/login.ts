import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['email', 'password']
      })
    }

    // Find user by email
    const user = await prisma.users.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' })
    }

    // Update last login time
    await prisma.users.update({
      where: { id: user.id },
      data: { last_login: new Date() },
    })

    // Map to camelCase for frontend
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

    return res.status(200).json({
      message: 'تم تسجيل الدخول بنجاح',
      user: userResponse,
    })
  } catch (error) {
    console.error('Error logging in:', error)
    return res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الدخول' })
  }
}

