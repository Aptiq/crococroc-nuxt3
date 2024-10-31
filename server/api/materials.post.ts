import { defineEventHandler, readBody } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
 try {
   const body = await readBody(event)
   
   if (!body || typeof body !== 'object') {
     console.error('Invalid request body:', body)
     throw createError({
       statusCode: 400,
       message: 'Corps de requête invalide'
     })
   }

   if (!body.name?.trim()) {
     console.error('Name validation failed:', { body })
     throw createError({
       statusCode: 400,
       message: 'Le nom est requis'
     })
   }

   const material = await prisma.material.create({
     data: {
       name: body.name.trim(),
       description: body.description?.trim() || '',
       image: body.image || '',
       // Suppression de userId puisqu'il n'y a plus d'auth
     },
     include: {
       analyses: true
       // Suppression de user dans l'include
     }
   })

   return material

 } catch (error: any) {
   console.error('Error in POST /api/materials:', error)
   throw createError({
     statusCode: error.statusCode || 500,
     message: error.message || 'Erreur lors de la création de la matière'
   })
 }
})