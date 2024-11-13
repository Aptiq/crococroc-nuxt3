import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Créer une organisation par défaut
  const defaultOrg = await prisma.organization.create({
    data: {
      id: 'default',
      name: 'Default Organization',
      slug: 'default'
    }
  })

  console.log('Created default organization:', defaultOrg)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 