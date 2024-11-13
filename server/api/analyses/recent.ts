import { defineEventHandler, createError } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  try {
    const analyses = await prisma.analysis.findMany({
      take: 5,
      orderBy: { 
        created_at: 'desc' 
      },
      select: {
        id: true,
        difference_grade: true,
        created_at: true,
        image2_gray: true,
        material: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    console.log('Recent analyses:', analyses)

    return analyses

  } catch (error: any) {
    console.error('Error fetching recent analyses:', error)
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération des analyses récentes'
    })
  }
}) 