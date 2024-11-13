import sharp from 'sharp'

export async function processImage(imageBuffer: Buffer) {
  // Conversion en niveaux de gris
  const grayImage = await sharp(imageBuffer)
    .grayscale()
    .toBuffer()

  // Calcul du niveau de gris moyen
  const stats = await sharp(grayImage)
    .stats()

  // Comparaison avec l'échelle ISO
  const grade = calculateISOGrade(stats.channels[0].mean)

  return {
    processedImage: grayImage,
    grade,
    metadata: {
      brightness: stats.channels[0].mean,
      contrast: stats.channels[0].stdev
    }
  }
} 