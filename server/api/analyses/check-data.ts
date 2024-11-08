import { defineEventHandler, createError } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  try {
    const analyses = await prisma.analysis.findMany({
      include: {
        material: true
      }
    })

    const dataStatus = analyses.map(analysis => ({
      id: analysis.id,
      material_id: analysis.material_id,
      status: {
        image1: {
          hasGray: !!analysis.image1_gray,
          hasIsoGrade: analysis.image1_iso_grade > 0,
          hasAvgGray: analysis.image1_avg_gray > 0,
          hasResolution: !!analysis.image1_resolution
        },
        image2: {
          hasGray: !!analysis.image2_gray,
          hasIsoGrade: analysis.image2_iso_grade > 0,
          hasAvgGray: analysis.image2_avg_gray > 0,
          hasResolution: !!analysis.image2_resolution
        },
        hasDifferenceGrade: analysis.difference_grade > 0
      }
    }))

    return {
      total: analyses.length,
      incomplete: dataStatus.filter(a => 
        !a.status.image1.hasGray || 
        !a.status.image1.hasIsoGrade || 
        !a.status.image2.hasGray || 
        !a.status.image2.hasIsoGrade ||
        !a.status.hasDifferenceGrade
      ),
      details: dataStatus
    }
  } catch (error) {
    console.error('Erreur:', error)
    return { error: String(error) }
  }
}) 