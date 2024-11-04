import { defineEventHandler, readBody } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validation du body
    if (!body || typeof body !== 'object') {
      console.error('Invalid request body:', body)
      throw createError({
        statusCode: 400,
        message: 'Corps de requête invalide'
      })
    }

    // Validation du nom
    if (!body.name?.trim()) {
      console.error('Name validation failed:', { body })
      throw createError({
        statusCode: 400,
        message: 'Le nom est requis'
      })
    }

    // Validation de l'image (optionnelle)
    let imageData = body.image || ''
    if (body.image && !body.image.startsWith('data:image/')) {
      console.error('Invalid image format')
      throw createError({
        statusCode: 400,
        message: 'Format d\'image invalide'
      })
    }

    // Création de la matière
    const material = await prisma.material.create({
      data: {
        name: body.name.trim(),
        description: body.description?.trim() || '',
        image: imageData,
      },
      include: {
        analyses: {
          orderBy: {
            created_at: 'desc'
          },
          take: 5 // Limite les 5 dernières analyses
        }
      }
    })

    console.log('Material created successfully:', material.id)
    return material

  } catch (error: any) {
    console.error('Error in POST /api/materials:', error)
    
    // Gestion spécifique des erreurs Prisma
    if (error.code === 'P2002') {
      throw createError({
        statusCode: 409,
        message: 'Une matière avec ce nom existe déjà'
      })
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors de la création de la matière'
    })
  }
})