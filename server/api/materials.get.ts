import { defineEventHandler } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  try {
    const materials = await prisma.material.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        analyses: true
      }
    })

    return materials
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error fetching materials'
    })
  }
})