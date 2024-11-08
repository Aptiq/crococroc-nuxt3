import { defineEventHandler, createError } from 'h3'  // Ajout de createError
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  try {
    const analyses = await prisma.analysis.findMany({  // Changé pour retourner les analyses
      orderBy: {
        created_at: 'desc'
      },
      take: 10,
      include: {
        material: true
      }
    })

    return analyses
  } catch (error: any) {
    console.error('Error fetching analyses:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors de la récupération des analyses'
    })
  }
})