import { defineEventHandler, readBody, createError } from 'h3'
import { Prisma } from '@prisma/client'
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

    // Vérifier si la matière existe déjà
    const existingMaterial = await prisma.material.findUnique({
      where: {
        name: body.name.trim()
      }
    })

    if (existingMaterial) {
      throw createError({
        statusCode: 409,
        message: 'Une matière avec ce nom existe déjà'
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
          take: 5
        }
      }
    })

    console.log('Material created successfully:', material.id)
    return material

  } catch (error) {
    console.error('Error in POST /api/materials:', error)
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw createError({
          statusCode: 409,
          message: 'Une matière avec ce nom existe déjà'
        })
      }
    }

    // Si c'est déjà une H3Error, on la renvoie directement
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la création de la matière'
    })
  }
})