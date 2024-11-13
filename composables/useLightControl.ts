export function useLightControl() {
  const lightLevel = ref<number>(0)
  const isLightValid = ref(false)
  const lightStatus = ref<'too-dark' | 'optimal' | 'too-bright' | null>(null)

  // Vérification selon la norme ISO (600 lux ±10%)
  function checkLightLevel(lux: number) {
    const minLux = 540  // 600 - 10%
    const maxLux = 660  // 600 + 10%
    
    lightLevel.value = lux
    isLightValid.value = lux >= minLux && lux <= maxLux
    
    if (lux < minLux) lightStatus.value = 'too-dark'
    else if (lux > maxLux) lightStatus.value = 'too-bright'
    else lightStatus.value = 'optimal'
  }

  return {
    lightLevel,
    isLightValid,
    lightStatus,
    checkLightLevel
  }
} 