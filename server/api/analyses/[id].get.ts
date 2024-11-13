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
        material: {
          select: {
            id: true,
            name: true,
            image: true,
            description: true
          }
        }
      }
    })

    if (!analysis) {
      throw createError({
        statusCode: 404,
        message: 'Analyse non trouvée'
      })
    }

    console.log('Found analysis:', {
      ...analysis,
      image2: analysis.image2 || analysis.image2_gray
    })

    return analysis

  } catch (error) {
    console.error('Error fetching analysis:', error)
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération de l\'analyse'
    })
  }
})