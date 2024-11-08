import { defineEventHandler, createError, readMultipartFormData } from 'h3'
import prisma from '~/server/utils/prisma'
import sharp from 'sharp'

// Échelle ISO (comme dans votre app.py)
const ISO_GRAY_SCALE = {
  5: 255,    // Pas de changement
  4.5: 238,  // 4-5
  4: 221,    // 4
  3.5: 204,  // 3-4
  3: 187,    // 3
  2.5: 170,  // 2-3
  2: 153,    // 2
  1.5: 136,  // 1-2
  1: 119     // 1 (changement le plus important)
}

async function processImage(imageBuffer: Buffer) {
  try {
    // Convertir en niveaux de gris
    const grayImage = await sharp(imageBuffer)
      .grayscale()
      .toBuffer()

    // Obtenir les métadonnées
    const metadata = await sharp(imageBuffer).metadata()
    const resolution = `${metadata.width}x${metadata.height}`

    // Calculer la moyenne des niveaux de gris
    const stats = await sharp(grayImage)
      .stats()
    
    const avgGray = stats.channels[0].mean

    // Calculer le grade ISO
    const differences = Object.entries(ISO_GRAY_SCALE).map(([grade, value]) => ({
      grade: parseFloat(grade),
      diff: Math.abs(avgGray - value)
    }))

    const isoGrade = differences.reduce((prev, curr) => 
      curr.diff < prev.diff ? curr : prev
    ).grade

    return {
      grayImage: grayImage.toString('base64'),
      isoGrade,
      avgGray,
      resolution
    }
  } catch (error) {
    console.error('Erreur traitement image:', error)
    throw error
  }
}

export default defineEventHandler(async (event) => {
  try {
    console.log('Tentative de connexion à la base de données...')
    
    const formData = await readMultipartFormData(event)
    if (!formData) {
      throw createError({
        statusCode: 400,
        message: 'Données du formulaire manquantes'
      })
    }

    console.log('FormData reçu:', formData.map(f => ({ name: f.name, size: f.data?.length })))

    const file1 = formData.find(f => f.name === 'file1')
    const file2 = formData.find(f => f.name === 'file2')
    const materialId = formData.find(f => f.name === 'materialId')?.data?.toString()

    if (!file1?.data || !file2?.data || !materialId) {
      throw createError({
        statusCode: 400,
        message: 'Images ou ID du matériau manquants'
      })
    }

    // Traiter les images
    const image1Data = await processImage(file1.data)
    const image2Data = await processImage(file2.data)

    // Calculer la différence de grade
    const differenceGrade = Math.abs(image1Data.isoGrade - image2Data.isoGrade)

    // Créer l'analyse avec les valeurs calculées
    const analysis = await prisma.analysis.create({
      data: {
        material_id: materialId,
        
        // Image 1
        image1_gray: image1Data.grayImage,
        image1_iso_grade: image1Data.isoGrade,
        image1_avg_gray: image1Data.avgGray,
        image1_resolution: image1Data.resolution,
        
        // Image 2
        image2_gray: image2Data.grayImage,
        image2_iso_grade: image2Data.isoGrade,
        image2_avg_gray: image2Data.avgGray,
        image2_resolution: image2Data.resolution,
        
        // Différence
        difference_grade: differenceGrade
      },
      include: {
        material: true
      }
    })

    console.log('Analyse créée avec succès:', analysis.id)

    return {
      success: true,
      data: analysis,
      redirectTo: `/analyses/${analysis.id}`
    }

  } catch (error: any) {
    console.error('Erreur lors de l\'analyse:', error)
    return {
      success: false,
      error: error.message || 'Une erreur est survenue lors de l\'analyse'
    }
  }
})