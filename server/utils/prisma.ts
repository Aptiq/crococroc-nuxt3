import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL_NON_POOLING
    }
  },
  log: process.env.DEBUG_PRISMA === 'info' 
    ? ['info', 'query', 'error', 'warn']
    : process.env.NODE_ENV === 'development' 
      ? ['error', 'warn']
      : ['error']
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Gestion des erreurs de connexion
prisma.$connect()
  .then(() => {
    console.log('✅ Connexion à la base de données établie')
  })
  .catch((error) => {
    console.error('❌ Erreur de connexion à la base de données:', error)
  })

export default prisma