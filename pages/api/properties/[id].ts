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
        include: {
          units: true,
          contracts: {
            include: {
              payments: true,
            },
          },
          maintenanceRequests: {
            orderBy: {
              createdAt: 'desc',
            },
          },
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      })

      if (!property) {
        return res.status(404).json({ error: 'Property not found' })
      }

      return res.status(200).json(property)
    } catch (error) {
      console.error('Error fetching property:', error)
      return res.status(500).json({ error: 'Failed to fetch property' })
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
      } = req.body

      const property = await prisma.property.update({
        where: {
          id: id as string,
        },
        data: {
          ...(name && { name }),
          ...(type && { type }),
          ...(address && { address }),
          ...(city && { city }),
          ...(area !== undefined && { area: parseFloat(area) }),
          ...(rooms && { rooms }),
          ...(bathrooms && { bathrooms }),
          ...(constructionYear && { constructionYear }),
          ...(description && { description }),
          ...(images && { images: JSON.stringify(images) }),
          ...(status && { status }),
        },
        include: {
          units: true,
          contracts: true,
        },
      })

      return res.status(200).json(property)
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

