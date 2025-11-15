import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const {
        propertyId,
        contractId,
        tenantUserId,
        stayPeriodFrom,
        stayPeriodTo,
        overallPropertyRating,
        propertyRatings,
        ownerRatings,
        satisfactionLevel,
        positives,
        negatives,
        photos,
        improveComment,
        correctGrammar,
        privacyOption,
      } = req.body

      if (!propertyId || !overallPropertyRating) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const tenantUserIdBigInt = tenantUserId ? BigInt(tenantUserId) : null

      // Check if user has already rated this property
      if (tenantUserIdBigInt) {
        const existingRating = await prisma.propertyRating.findFirst({
          where: {
            propertyId: propertyId,
            tenantUserId: tenantUserIdBigInt,
          },
        })

        if (existingRating) {
          return res.status(400).json({ error: 'لقد قمت بتقييم هذا العقار مسبقاً' })
        }
      }

      try {
        const rating = await prisma.propertyRating.create({
          data: {
            propertyId,
            contractId: contractId || null,
            tenantUserId: tenantUserIdBigInt,
            stayPeriodFrom: stayPeriodFrom ? new Date(stayPeriodFrom) : null,
            stayPeriodTo: stayPeriodTo ? new Date(stayPeriodTo) : null,
            overallPropertyRating: parseFloat(overallPropertyRating),
            propertyRatings: propertyRatings ? JSON.stringify(propertyRatings) : null,
            ownerRatings: ownerRatings ? JSON.stringify(ownerRatings) : null,
            satisfactionLevel: satisfactionLevel || null,
            positives: positives || null,
            negatives: negatives || null,
            photos: photos ? JSON.stringify(photos) : null,
            improveComment: improveComment === true || improveComment === 'true',
            correctGrammar: correctGrammar === true || correctGrammar === 'true',
            privacyOption: privacyOption || 'public',
          },
          include: {
            property: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        })

        // Convert BigInt values to strings for JSON serialization
        const ratingWithStrings = {
          ...rating,
          tenantUserId: rating.tenantUserId?.toString() || null,
        }

        return res.status(201).json(ratingWithStrings)
      } catch (dbError: any) {
        if (dbError.code === 'P2021') {
          console.error('Property ratings table does not exist. Please create the table first.')
          return res.status(503).json({
            error: 'Property ratings table does not exist. Please run the migration to create the table.',
          })
        }
        throw dbError
      }
    } catch (error) {
      console.error('Error creating property rating:', error)
      return res.status(500).json({ error: 'Failed to create property rating' })
    }
  }

  if (req.method === 'GET') {
    try {
      const { propertyId, tenantUserId } = req.query

      const where: any = {}
      if (propertyId) {
        where.propertyId = propertyId as string
      }
      if (tenantUserId) {
        where.tenantUserId = BigInt(tenantUserId as string)
      }

      try {
        const ratings = await prisma.propertyRating.findMany({
          where,
          include: {
            property: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        // Convert BigInt values to strings for JSON serialization
        const ratingsWithStrings = ratings.map((rating) => ({
          ...rating,
          tenantUserId: rating.tenantUserId?.toString() || null,
          propertyRatings: rating.propertyRatings ? JSON.parse(rating.propertyRatings) : null,
          ownerRatings: rating.ownerRatings ? JSON.parse(rating.ownerRatings) : null,
          photos: rating.photos ? JSON.parse(rating.photos) : null,
        }))

        return res.status(200).json(ratingsWithStrings)
      } catch (dbError: any) {
        if (dbError.code === 'P2021') {
          return res.status(200).json([])
        }
        throw dbError
      }
    } catch (error) {
      console.error('Error fetching property ratings:', error)
      return res.status(500).json({ error: 'Failed to fetch property ratings' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

