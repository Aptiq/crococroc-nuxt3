import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Créer quelques matières
  const material1 = await prisma.material.create({
    data: {
      name: 'Matière test 1',
      description: 'Description de la matière test 1',
      image: 'https://picsum.photos/400/300'
    }
  })

  const material2 = await prisma.material.create({
    data: {
      name: 'Matière test 2',
      description: 'Description de la matière test 2',
      image: 'https://picsum.photos/400/300'
    }
  })

  // Créer quelques analyses
  await prisma.analysis.create({
    data: {
      material_id: material1.id,
      image1_gray: 'https://picsum.photos/400/300?grayscale',
      image1_iso_grade: 4.5,
      image1_avg_gray: 128,
      image1_resolution: '1920x1080',
      image2_gray: 'https://picsum.photos/400/300?grayscale',
      image2_iso_grade: 3.8,
      image2_avg_gray: 120,
      image2_resolution: '1920x1080',
      difference_grade: 4.2
    }
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 