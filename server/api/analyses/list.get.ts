import { defineEventHandler } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  try {
    const analyses = await prisma.analysis.findMany({
      include: {
        material: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return analyses
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors de la récupération des analyses'
    })
  }
})