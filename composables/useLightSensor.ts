import { ref, onMounted } from 'vue'

export function useLightSensor() {
  const lightLevel = ref<number>(0)
  const isLightValid = ref(false)
  const error = ref<string | null>(null)
  const status = ref<'too-dark' | 'optimal' | 'too-bright' | null>(null)

  // Vérification selon la norme ISO (600 lux ±10%)
  function checkLightLevel(lux: number) {
    const minLux = 540  // 600 - 10%
    const maxLux = 660  // 600 + 10%
    
    lightLevel.value = lux
    isLightValid.value = lux >= minLux && lux <= maxLux
    
    if (lux < minLux) {
      status.value = 'too-dark'
    } else if (lux > maxLux) {
      status.value = 'too-bright'
    } else {
      status.value = 'optimal'
    }
  }

  async function startSensor() {
    try {
      if ('AmbientLightSensor' in window) {
        const sensor = new AmbientLightSensor()
        sensor.onreading = () => {
          checkLightLevel(sensor.illuminance)
        }
        await sensor.start()
      } else {
        error.value = "Capteur de lumière non disponible"
      }
    } catch (e) {
      error.value = "Erreur d'accès au capteur"
      console.warn('Erreur capteur:', e)
    }
  }

  return {
    lightLevel,
    isLightValid,
    status,
    error,
    startSensor
  }
} 