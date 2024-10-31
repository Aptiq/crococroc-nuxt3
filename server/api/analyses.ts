import { defineEventHandler } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  try {
    const materialsCount = await prisma.material.count()
    const analysesCount = await prisma.analysis.count()
    const averageGrade = await prisma.analysis.aggregate({
      _avg: {
        differenceGrade: true
      }
    })

    return {
      materialsCount,
      analysesCount,
      averageGrade: averageGrade._avg.differenceGrade?.toFixed(1) || '-'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors de la récupération des statistiques'
    })
  }
})