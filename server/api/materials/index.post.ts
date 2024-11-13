import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier ou créer l'organisation par défaut
    let defaultOrg = await prisma.organization.findFirst({
      where: { slug: 'default' }
    })

    if (!defaultOrg) {
      defaultOrg = await prisma.organization.create({
        data: {
          id: 'default',
          name: 'Default Organization',
          slug: 'default',
          plan: 'free'
        }
      })
    }

    // Lire le FormData
    const form = await readMultipartFormData(event)
    if (!form) {
      return { error: 'Aucune donnée reçue' }
    }

    // Extraire les données du formulaire
    const name = form.find(f => f.name === 'name')?.data.toString()
    const description = form.find(f => f.name === 'description')?.data.toString() || ''
    const imageData = form.find(f => f.name === 'image')?.data

    if (!name || !imageData) {
      return { error: 'Nom et image requis' }
    }

    // Vérifier si le nom existe déjà
    const existingMaterial = await prisma.material.findFirst({
      where: { name }
    })

    if (existingMaterial) {
      return { error: 'Une matière avec ce nom existe déjà. Veuillez choisir un nom différent.' }
    }

    // Créer la matière
    const material = await prisma.material.create({
      data: {
        name,
        description,
        image: imageData.toString('base64'),
        organization_id: defaultOrg.id
      }
    })

    return { success: true, material }

  } catch (error: any) {
    console.error('Error creating material:', error)
    return { error: 'Erreur lors de la création de la matière' }
  }
}) 