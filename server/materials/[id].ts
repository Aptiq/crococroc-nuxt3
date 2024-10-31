import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  
  try {
    // TODO: Remplacer par votre logique de récupération depuis la BDD
    const material = null // Temporaire, à remplacer par vos données

    if (!material) {
      throw createError({
        statusCode: 404,
        message: 'Material not found'
      })
    }

    return material
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error fetching material'
    })
  }
})