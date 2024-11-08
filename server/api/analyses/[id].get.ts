import { prisma } from '~/server/database'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id
    console.log('ID recherché:', id) 

    // Vérifions si prisma est bien initialisé
    console.log('Prisma client:', !!prisma)

    const analysis = await prisma.analysis.findUnique({
      where: { id },
      include: {
        user: true,
        comments: {
          include: {
            user: true
          }
        }
      }
    })

    console.log('Analyse trouvée:', analysis)

    if (!analysis) {
      throw createError({
        statusCode: 404,
        message: 'Analyse non trouvée'
      })
    }

    return analysis
  } catch (error: any) {
    // Log plus détaillé de l'erreur
    console.error('Type d\'erreur:', error.constructor.name)
    console.error('Message d\'erreur:', error.message)
    console.error('Stack trace:', error.stack)
    
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur serveur interne'
    })
  }
})