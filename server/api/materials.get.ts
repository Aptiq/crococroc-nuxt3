import { defineEventHandler, createError } from 'h3'  // Ajout de createError
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  try {
    const materials = await prisma.material.findMany({
      orderBy: {
        created_at: 'desc'  // Changé de createdAt à created_at
      },
      take: 6,  // Limite aux 6 dernières matières
      include: {
        analyses: true
      }
    })

    return materials
  } catch (error: any) {
    console.error('Error fetching materials:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error fetching materials'
    })
  }
})