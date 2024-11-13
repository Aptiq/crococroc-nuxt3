export function useISOAnalysis() {
  const analyzing = ref(false)
  const results = ref<ISOResults | null>(null)

  async function analyzeImages(original: Blob, test: Blob) {
    analyzing.value = true
    try {
      // Convertir les images en niveaux de gris
      const [grayOriginal, grayTest] = await Promise.all([
        convertToGrayscale(original),
        convertToGrayscale(test)
      ])

      // Calculer les moyennes de gris
      const avgOriginal = await calculateAverageGray(grayOriginal)
      const avgTest = await calculateAverageGray(grayTest)

      // Calculer la différence selon ISO 105-A02
      const difference = Math.abs(avgOriginal - avgTest)
      
      // Attribution de la note selon l'échelle ISO
      const grade = calculateISOGrade(difference)

      results.value = {
        originalAvg: avgOriginal,
        testAvg: avgTest,
        difference,
        grade,
        confidence: calculateConfidence(difference)
      }

      return results.value

    } catch (error) {
      console.error('Erreur analyse ISO:', error)
      throw new Error("Erreur lors de l'analyse ISO")
    } finally {
      analyzing.value = false
    }
  }

  return {
    analyzing,
    results,
    analyzeImages
  }
}

// Fonctions utilitaires
async function convertToGrayscale(image: Blob): Promise<ImageData> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas non supporté')

  const img = await createImageBitmap(image)
  canvas.width = img.width
  canvas.height = img.height
  
  ctx.filter = 'grayscale(100%)'
  ctx.drawImage(img, 0, 0)
  
  return ctx.getImageData(0, 0, canvas.width, canvas.height)
}

function calculateAverageGray(imageData: ImageData): number {
  const data = imageData.data
  let sum = 0
  
  for (let i = 0; i < data.length; i += 4) {
    sum += data[i] // R = G = B en niveaux de gris
  }
  
  return sum / (data.length / 4)
}

function calculateISOGrade(difference: number): number {
  // Échelle ISO 105-A02
  const isoScale = [
    { max: 0.5, grade: 5.0 },
    { max: 2.0, grade: 4.5 },
    { max: 4.0, grade: 4.0 },
    { max: 8.0, grade: 3.5 },
    { max: 16.0, grade: 3.0 },
    { max: 32.0, grade: 2.5 },
    { max: 64.0, grade: 2.0 },
    { max: 96.0, grade: 1.5 },
    { max: Infinity, grade: 1.0 }
  ]

  return isoScale.find(s => difference <= s.max)?.grade || 1.0
}

function calculateConfidence(difference: number): number {
  // Plus la différence est proche d'un point de l'échelle, plus la confiance est élevée
  const confidence = 100 - (difference % 1) * 100
  return Math.max(0, Math.min(100, confidence))
} 