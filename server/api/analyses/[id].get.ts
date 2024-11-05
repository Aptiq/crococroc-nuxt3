import { defineEventHandler } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = event.context.params.id
  
  try {
    const analysis = await prisma.analysis.findUnique({
      where: { id },
      include: {
        material: true
      }
    })

    if (!analysis) {
      throw createError({
        statusCode: 404,
        message: 'Analyse non trouvée'
      })
    }

    return analysis
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors de la récupération de l\'analyse'
    })
  }
})