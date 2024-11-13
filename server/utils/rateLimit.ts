import { H3Event } from 'h3'

const RATE_LIMIT = 100 // requêtes par minute
const requests = new Map<string, { count: number; timestamp: number }>()

export async function rateLimit(event: H3Event) {
  const ip = event.node.req.socket.remoteAddress || ''
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  
  const current = requests.get(ip) || { count: 0, timestamp: now }
  
  if (now - current.timestamp > windowMs) {
    requests.set(ip, { count: 1, timestamp: now })
  } else if (current.count > RATE_LIMIT) {
    throw createError({
      statusCode: 429,
      message: 'Trop de requêtes'
    })
  } else {
    requests.set(ip, { 
      count: current.count + 1, 
      timestamp: current.timestamp 
    })
  }
} 