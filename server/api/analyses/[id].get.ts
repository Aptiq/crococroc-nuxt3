import { defineEventHandler, createError } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID manquant'
    })
  }

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

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'analyse:', error)
    throw createError({
      statusCode: 500,
      message: 'Erreur serveur'
    })
  }
})