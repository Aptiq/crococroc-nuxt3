import { defineEventHandler, createError } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Debug: vérifier la connexion à la base de données
    console.log('Tentative de connexion à la base de données...')
    
    const formData = await readMultipartFormData(event)
    if (!formData) {
      throw createError({
        statusCode: 400,
        message: 'Données du formulaire manquantes'
      })
    }

    // Debug: afficher les données reçues
    console.log('FormData reçu:', formData.map(f => ({ name: f.name, size: f.data?.length })))

    // Extraire les fichiers et l'ID du matériau
    const file1 = formData.find(f => f.name === 'file1')
    const file2 = formData.find(f => f.name === 'file2')
    const materialId = formData.find(f => f.name === 'materialId')?.data?.toString()

    if (!file1 || !file2 || !materialId) {
      throw createError({
        statusCode: 400,
        message: 'Images ou ID du matériau manquants'
      })
    }

    // Vérifier que le matériau existe
    const material = await prisma.material.findUnique({
      where: { id: materialId }
    })

    if (!material) {
      throw createError({
        statusCode: 404,
        message: 'Matériau non trouvé'
      })
    }

    // Créer l'analyse
    const analysis = await prisma.analysis.create({
      data: {
        material_id: materialId,
        
        // Image 1
        image1_gray: file1.data.toString('base64'),
        image1_iso_grade: 0,
        image1_avg_gray: 0,
        image1_resolution: '0x0',
        
        // Image 2
        image2_gray: file2.data.toString('base64'),
        image2_iso_grade: 0,
        image2_avg_gray: 0,
        image2_resolution: '0x0',
        
        // Différence
        difference_grade: 0
      },
      // Inclure les données du matériau dans la réponse
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