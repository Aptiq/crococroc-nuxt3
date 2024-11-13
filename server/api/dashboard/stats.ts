import { defineEventHandler, createError } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  try {
    // Récupérer les statistiques en parallèle pour de meilleures performances
    const [materialsCount, analysesCount, averageGrade] = await Promise.all([
      // Nombre total de matières
      prisma.material.count(),
      
      // Nombre total d'analyses
      prisma.analysis.count(),
      
      // Note moyenne des analyses
      prisma.analysis.aggregate({
        _avg: {
          difference_grade: true
        }
      })
    ])

    return {
      materialsCount,
      analysesCount,
      averageGrade: averageGrade._avg.difference_grade || 0
    }

  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error)
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération des statistiques'
    })
  }
}) 