import { defineEventHandler, createError } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  try {
    const materials = await prisma.material.findMany({
      orderBy: { created_at: 'desc' },
      take: 6,
      include: { analyses: true }
    })

    return materials.map(material => ({
      ...material,
      hasAnalysis: material.analyses.length > 0
    }))
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération des matières récentes'
    })
  }
}) 