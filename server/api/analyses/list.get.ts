import { defineEventHandler, createError } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  try {
    const analyses = await prisma.analysis.findMany({
      include: {
        material: true
      },
      orderBy: {
        created_at: 'desc'
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