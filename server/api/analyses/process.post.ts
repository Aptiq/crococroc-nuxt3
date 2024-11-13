import { defineEventHandler } from 'h3'
import { processImage } from '~/server/utils/imageProcessing'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const imageBuffer = Buffer.from(body.image, 'base64')

    // Traitement de l'image
    const result = await processImage(imageBuffer)

    // Sauvegarde en base de données
    const analysis = await prisma.analysis.create({
      data: {
        materialId: body.materialId,
        grade: result.grade,
        metadata: result.metadata,
        imageUrl: await saveImage(result.processedImage)
      }
    })

    return analysis
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Erreur lors de l'analyse"
    })
  }
}) 