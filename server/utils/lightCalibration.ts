export interface LightCalibration {
  ambientLux: number;
  referenceValue: number;
  calibrationFactor: number;
}

export function calibrateLighting(ambientLux: number = 600): LightCalibration {
  const referenceValue = 600; // Valeur de référence ISO
  const calibrationFactor = Math.sqrt(referenceValue / ambientLux);

  return {
    ambientLux,
    referenceValue,
    calibrationFactor
  };
} 