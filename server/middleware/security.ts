import { defineEventHandler } from 'h3'
import { rateLimit } from '~/server/utils/rateLimit'
import { sanitizeInput } from '~/server/utils/sanitize'

export default defineEventHandler(async (event) => {
  // Rate limiting
  await rateLimit(event)
  
  // Sanitization des entrées
  if (event.method === 'POST') {
    event.body = sanitizeInput(event.body)
  }
}) 