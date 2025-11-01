import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { ownerId } = req.query

      if (!ownerId) {
        return res.status(400).json({ error: 'ownerId is required' })
      }

      const ownerIdBigInt = BigInt(ownerId as string)
      const properties = await prisma.property.findMany({
        where: {
          ownerId: ownerIdBigInt,
        },
        include: {
          owner: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              phone_number: true,
            },
          },
          units: true,
          contracts: {
            where: {
              status: 'نشط',
            },
          },
          _count: {
            select: {
              units: true,
              maintenanceRequests: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return res.status(200).json(properties)
    } catch (error) {
      console.error('Error fetching properties:', error)
      return res.status(500).json({ error: 'Failed to fetch properties' })
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        ownerId,
        name,
        type,
        address,
        city,
        area,
        rooms,
        bathrooms,
        constructionYear,
        description,
        images,
        // Location details
        unitNumber,
        postalCode,
        country,
        // Property subtype
        propertySubType,
        // Features
        features,
        // Pricing
        monthlyRent,
        insurance,
        availableFrom,
        minRentalPeriod,
        publicDisplay,
        // Payment system
        paymentEmail,
        supportPhone,
        paymentAccount,
      } = req.body

      if (!ownerId || !name || !type || !address || !city) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      // Convert ownerId string to BigInt
      const ownerIdBigInt = BigInt(ownerId)

      const property = await prisma.property.create({
        data: {
          ownerId: ownerIdBigInt,
          name,
          type,
          address,
          city,
          area: area ? parseFloat(area) : null,
          rooms,
          bathrooms,
          constructionYear,
          // Location details
          unitNumber: unitNumber || null,
          postalCode: postalCode || null,
          country: country || 'المملكة العربية السعودية',
          // Property subtype
          propertySubType: propertySubType || null,
          // Features (convert object to JSON string)
          features: features ? JSON.stringify(features) : null,
          // Pricing
          monthlyRent: monthlyRent ? parseFloat(monthlyRent) : null,
          insurance: insurance ? parseFloat(insurance) : null,
          availableFrom: availableFrom ? new Date(availableFrom) : null,
          minRentalPeriod: minRentalPeriod || null,
          publicDisplay: publicDisplay === true || publicDisplay === 'true',
          // Payment system
          paymentEmail: paymentEmail || null,
          supportPhone: supportPhone || null,
          paymentAccount: paymentAccount || null,
          // Additional details
          description: description || null,
          images: images ? (typeof images === 'string' ? images : JSON.stringify(images)) : null,
          status: 'متاح',
        },
        include: {
          owner: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              phone_number: true,
            },
          },
          units: true,
        },
      })

      return res.status(201).json(property)
    } catch (error) {
      console.error('Error creating property:', error)
      return res.status(500).json({ error: 'Failed to create property' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

