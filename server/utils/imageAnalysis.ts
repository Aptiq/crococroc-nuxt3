import { Lab, RGB, rgb2lab } from './colorSpace'
import sharp from 'sharp'
import { calibrateLighting } from './lightCalibration'

// Échelle de gris ISO 105-A02 avec valeurs Lab
const ISO_GRAY_SCALE = {
  5: { L: 100, a: 0, b: 0 },    // Pas de changement
  4.5: { L: 93.3, a: 0, b: 0 }, // 4-5
  4: { L: 86.7, a: 0, b: 0 },   // 4
  3.5: { L: 80.0, a: 0, b: 0 }, // 3-4
  3: { L: 73.3, a: 0, b: 0 },   // 3
  2.5: { L: 66.7, a: 0, b: 0 }, // 2-3
  2: { L: 60.0, a: 0, b: 0 },   // 2
  1.5: { L: 53.3, a: 0, b: 0 }, // 1-2
  1: { L: 46.7, a: 0, b: 0 }    // 1 (changement important)
}

// Fonction pour calculer deltaE (différence entre deux couleurs Lab)
function calculateDeltaE(lab1: Lab, lab2: Lab): number {
  const deltaL = lab1.L - lab2.L
  const deltaA = lab1.a - lab2.a
  const deltaB = lab1.b - lab2.b
  return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB)
}

interface AnalysisResult {
  grade: number
  deltaE: number
  calibration: ReturnType<typeof calibrateLighting>
  processingTime: number
  metadata: {
    grayValue: number
    calibratedValue: number
    labValues: Lab
  }
}

export async function analyzeImage(
  imageBuffer: Buffer,
  ambientLux: number = 600
): Promise<AnalysisResult> {
  const startTime = performance.now();

  try {
    // 1. Calibration lumineuse
    const calibration = calibrateLighting(ambientLux);

    // 2. Conversion en niveaux de gris
    const grayValue = await convertToGrayscale(imageBuffer);

    // 3. Application de la calibration
    const calibratedValue = grayValue * calibration.calibrationFactor;

    // 4. Conversion en Lab
    const labValues = rgb2lab({
      r: calibratedValue,
      g: calibratedValue,
      b: calibratedValue
    });

    // 5. Comparaison avec l'échelle ISO
    const { grade, deltaE } = compareToIsoScale(labValues);

    // 6. Vérification du temps de traitement
    const processingTime = performance.now() - startTime;
    if (processingTime > 3000) {
      console.warn('Traitement trop long (> 3s)');
    }

    return {
      grade,
      deltaE,
      calibration,
      processingTime,
      metadata: {
        grayValue,
        calibratedValue,
        labValues
      }
    };

  } catch (error) {
    console.error('Erreur lors de l\'analyse:', error);
    throw error;
  }
}

async function calculateAverageRGB(imageBuffer: Buffer): Promise<RGB> {
  // Utiliser sharp pour obtenir les statistiques de l'image
  const stats = await sharp(imageBuffer)
    .stats()
  
  return {
    r: stats.channels[0].mean,
    g: stats.channels[1].mean,
    b: stats.channels[2].mean
  }
}

function compareToIsoScale(labValues: Lab): { grade: number; deltaE: number } {
  let closestGrade = 1
  let minDeltaE = Infinity

  // Calcul des différences avec chaque niveau de l'échelle
  for (const [grade, reference] of Object.entries(ISO_GRAY_SCALE)) {
    const diff = calculateDeltaE(labValues, reference)
    
    if (diff < minDeltaE) {
      minDeltaE = diff
      closestGrade = parseFloat(grade)
    }
  }

  return { grade: closestGrade, deltaE: minDeltaE }
}

async function convertToGrayscale(imageBuffer: Buffer): Promise<number> {
  const { data, info } = await sharp(imageBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true });

  let sum = 0;
  for (let i = 0; i < data.length; i += 3) {
    // Formule ISO : 0.299R + 0.587G + 0.114B
    sum += (
      0.299 * data[i] +     // R
      0.587 * data[i+1] +   // G
      0.114 * data[i+2]     // B
    );
  }

  return sum / (info.width * info.height);
}