import { defineEventHandler, createError } from 'h3'  // Ajout de createError
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  try {
    const materialsCount = await prisma.material.count()
    const analysesCount = await prisma.analysis.count()
    const averageGrade = await prisma.analysis.aggregate({
      _avg: {
        difference_grade: true  // Changé de differenceGrade à difference_grade
      }
    })

    return {
      materialsCount,
      analysesCount,
      averageGrade: averageGrade._avg.difference_grade?.toFixed(1) || '-'  // Changé ici aussi
    }
  } catch (error: any) {
    console.error('Error fetching stats:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors de la récupération des statistiques'
    })
  }
})