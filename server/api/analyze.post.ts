import { defineEventHandler, createError, readMultipartFormData } from 'h3'
import prisma from '~/server/utils/prisma'
import { analyzeImage } from '../utils/imageAnalysis'
import sharp from 'sharp'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    if (!formData) throw new Error('Aucune donnée reçue')

    console.log('FormData reçu:', formData.map(f => ({ 
      name: f.name, 
      size: f.data.length 
    })))

    // Récupérer les fichiers
    const materialId = formData.find(f => f.name === 'materialId')?.data.toString()
    const file1 = formData.find(f => f.name === 'file1')
    const file2 = formData.find(f => f.name === 'file2')

    if (!file1?.data || !file2?.data || !materialId) {
      throw new Error('Données manquantes')
    }

    // Prétraitement des images avec Sharp
    const processedImage1 = await sharp(file1.data)
      .grayscale()
      .toBuffer()

    const processedImage2 = await sharp(file2.data)
      .grayscale()
      .toBuffer()

    // Analyser les images
    const result1 = await analyzeImage(processedImage1)
    const result2 = await analyzeImage(processedImage2)

    // Calculer la différence
    const analysis = {
      materialId,
      originalImage: {
        labValues: result1.labValues,
        luminance: result1.luminance
      },
      testImage: {
        labValues: result2.labValues,
        luminance: result2.luminance
      },
      grade: result2.grade,
      deltaE: result2.deltaE,
      processingTime: result1.processingTime + result2.processingTime
    }

    // Sauvegarder l'analyse
    const savedAnalysis = await prisma.analysis.create({
      data: {
        materialId,
        originalImageUrl: '', // À implémenter
        testImageUrl: '',
        grade: analysis.grade,
        deltaE: analysis.deltaE,
        metadata: analysis as any
      }
    })

    return {
      success: true,
      redirectTo: `/analysis/${savedAnalysis.id}`,
      analysis
    }

  } catch (error: any) {
    console.error('Erreur traitement image:', error)
    return {
      success: false,
      error: error.message
    }
  }
})