import { defineEventHandler, createError } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  try {
    console.log('Fetching all materials...')

    const materials = await prisma.material.findMany({
      orderBy: {
        created_at: 'desc'
      },
      include: {
        analyses: true
      }
    })

    console.log(`Fetched ${materials.length} materials`)

    const transformedMaterials = materials.map(material => ({
      ...material,
      hasAnalysis: material.analyses.length > 0,
      analyses: undefined
    }))

    return transformedMaterials

  } catch (error: any) {
    console.error('Error fetching materials:', error)
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération des matières'
    })
  }
}) 