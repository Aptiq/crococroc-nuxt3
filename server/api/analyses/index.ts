import { defineEventHandler, createError } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  try {
    // Récupérer TOUTES les analyses sans limite
    const analyses = await prisma.analysis.findMany({
      orderBy: {
        created_at: 'desc'
      },
      include: {
        material: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    // Log pour debug
    console.log(`Fetched ${analyses.length} analyses`)

    return analyses

  } catch (error: any) {
    console.error('Error fetching analyses:', error)
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération des analyses'
    })
  }
}) 