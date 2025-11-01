import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const property = await prisma.property.findUnique({
        where: {
          id: id as string,
        },
        select: {
          id: true,
          ownerId: true,
          name: true,
          type: true,
          address: true,
          city: true,
          area: true,
          rooms: true,
          bathrooms: true,
          constructionYear: true,
          status: true,
          unitNumber: true,
          postalCode: true,
          country: true,
          propertySubType: true,
          features: true,
          monthlyRent: true,
          insurance: true,
          availableFrom: true,
          minRentalPeriod: true,
          publicDisplay: true,
          paymentEmail: true,
          supportPhone: true,
          paymentAccount: true,
          description: true,
          images: true,
          createdAt: true,
          updatedAt: true,
          owner: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
            },
          },
        },
      })

      if (!property) {
        return res.status(404).json({ error: 'Property not found' })
      }

      // Convert BigInt values to strings for JSON serialization
      const propertyWithStrings = {
        ...property,
        ownerId: property.ownerId.toString(),
        owner: property.owner ? {
          ...property.owner,
          id: property.owner.id.toString(),
        } : null,
      }

      return res.status(200).json(propertyWithStrings)
    } catch (error: any) {
      console.error('Error fetching property:', error)
      return res.status(500).json({ error: 'Failed to fetch property', details: error.message })
    }
  }

  if (req.method === 'PUT') {
    try {
      const {
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
        status,
        postalCode,
        country,
        propertySubType,
        features,
        monthlyRent,
        insurance,
        availableFrom,
        minRentalPeriod,
        publicDisplay,
        paymentEmail,
        supportPhone,
        paymentAccount,
      } = req.body

      const updateData: any = {}
      
      if (name !== undefined) updateData.name = name
      if (type !== undefined) updateData.type = type
      if (address !== undefined) updateData.address = address
      if (city !== undefined) updateData.city = city
      if (area !== undefined) updateData.area = area ? parseFloat(area) : null
      if (rooms !== undefined) updateData.rooms = rooms
      if (bathrooms !== undefined) updateData.bathrooms = bathrooms
      if (constructionYear !== undefined) updateData.constructionYear = constructionYear
      if (description !== undefined) updateData.description = description
      if (images !== undefined) updateData.images = images ? (typeof images === 'string' ? images : JSON.stringify(images)) : null
      if (status !== undefined) updateData.status = status
      if (postalCode !== undefined) updateData.postalCode = postalCode
      if (country !== undefined) updateData.country = country
      if (propertySubType !== undefined) updateData.propertySubType = propertySubType
      if (features !== undefined) updateData.features = features ? (typeof features === 'string' ? features : JSON.stringify(features)) : null
      if (monthlyRent !== undefined) updateData.monthlyRent = monthlyRent ? parseFloat(monthlyRent) : null
      if (insurance !== undefined) updateData.insurance = insurance ? parseFloat(insurance) : null
      if (availableFrom !== undefined) updateData.availableFrom = availableFrom ? new Date(availableFrom) : null
      if (minRentalPeriod !== undefined) updateData.minRentalPeriod = minRentalPeriod
      if (publicDisplay !== undefined) updateData.publicDisplay = publicDisplay === true || publicDisplay === 'true'
      if (paymentEmail !== undefined) updateData.paymentEmail = paymentEmail
      if (supportPhone !== undefined) updateData.supportPhone = supportPhone
      if (paymentAccount !== undefined) updateData.paymentAccount = paymentAccount

      const property = await prisma.property.update({
        where: {
          id: id as string,
        },
        data: updateData,
        select: {
          id: true,
          ownerId: true,
          name: true,
          type: true,
          address: true,
          city: true,
          area: true,
          rooms: true,
          bathrooms: true,
          constructionYear: true,
          status: true,
          unitNumber: true,
          postalCode: true,
          country: true,
          propertySubType: true,
          features: true,
          monthlyRent: true,
          insurance: true,
          availableFrom: true,
          minRentalPeriod: true,
          publicDisplay: true,
          paymentEmail: true,
          supportPhone: true,
          paymentAccount: true,
          description: true,
          images: true,
          createdAt: true,
          updatedAt: true,
          owner: {
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
      const propertyWithStrings = {
        ...property,
        ownerId: property.ownerId.toString(),
        owner: property.owner ? {
          ...property.owner,
          id: property.owner.id.toString(),
        } : null,
      }

      return res.status(200).json(propertyWithStrings)
    } catch (error) {
      console.error('Error updating property:', error)
      return res.status(500).json({ error: 'Failed to update property' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.property.delete({
        where: {
          id: id as string,
        },
      })

      return res.status(200).json({ message: 'Property deleted successfully' })
    } catch (error) {
      console.error('Error deleting property:', error)
      return res.status(500).json({ error: 'Failed to delete property' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

