import { ref, onMounted, onUnmounted } from 'vue'

export function useDeviceOrientation() {
  const angle = ref({ alpha: 0, beta: 0, gamma: 0 })
  const isAngleValid = ref(false)

  // L'angle doit être perpendiculaire (90° ±5°)
  function checkAngle(orientation: DeviceOrientationEvent) {
    if (orientation.beta) {
      angle.value.beta = orientation.beta
      isAngleValid.value = Math.abs(orientation.beta - 90) <= 5
    }
  }

  onMounted(() => {
    window.addEventListener('deviceorientation', checkAngle)
  })

  onUnmounted(() => {
    window.removeEventListener('deviceorientation', checkAngle)
  })

  return {
    angle,
    isAngleValid
  }
} 