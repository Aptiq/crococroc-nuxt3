// Échelle de gris ISO 105-A02
const ISO_GRAY_SCALE = {
    5: 255,    // Pas de changement
    4.5: 238,  // 4-5
    4: 221,    // 4
    3.5: 204,  // 3-4
    3: 187,    // 3
    2.5: 170,  // 2-3
    2: 153,    // 2
    1.5: 136,  // 1-2
    1: 119     // 1 (changement le plus important)
  }
  
  export function convertToGrayscale(imageData: Buffer) {
    // Conversion en niveaux de gris en utilisant la formule standard
    const gray = imageData.map((pixel, i) => {
      if ((i + 1) % 4 === 0) return pixel // Alpha channel
      const r = imageData[i - 3]
      const g = imageData[i - 2]
      const b = imageData[i - 1]
      return 0.299 * r + 0.587 * g + 0.114 * b
    })
    return Buffer.from(gray)
  }
  
  export function compareToIsoScale(grayValue: number) {
    const differences = Object.entries(ISO_GRAY_SCALE).map(([grade, value]) => ({
      grade: parseFloat(grade),
      diff: Math.abs(grayValue - value)
    }))
    return differences.reduce((prev, curr) => 
      curr.diff < prev.diff ? curr : prev
    ).grade
  }
  
  export function analyzeImage(imageBuffer: Buffer) {
    const grayImage = convertToGrayscale(imageBuffer)
    const averageGray = Array.from(grayImage).reduce((sum, val) => sum + val, 0) / grayImage.length
    const isoGrade = compareToIsoScale(averageGray)
  
    return {
      gray_image_str: grayImage.toString('base64'),
      iso_grade: isoGrade,
      average_gray: averageGray,
      resolution: `${imageBuffer.length/4}px`
    }
  }
  
  export function compareImages(image1Data: any, image2Data: any) {
    const diff = Math.abs(image1Data.average_gray - image2Data.average_gray)
    return compareToIsoScale(diff)
  }