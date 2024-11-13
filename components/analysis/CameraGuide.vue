<template>
  <div class="camera-guide relative">
    <!-- Overlay de guidage -->
    <div class="guide-overlay absolute inset-0">
      <!-- Zone cible -->
      <div 
        class="target-area border-2 rounded-lg"
        :class="{ 
          'border-green-500': allConditionsValid,
          'border-red-500': !allConditionsValid 
        }"
      >
        <!-- Indicateurs -->
        <div class="indicators absolute bottom-0 left-0 right-0 p-4 bg-black/50">
          <div class="flex justify-around text-sm text-white">
            <div :class="{ 'text-green-500': isLightValid }">
              <UIcon name="i-heroicons-sun" class="w-5 h-5 inline-block mr-1" />
              {{ lightStatus }}
            </div>
            <div :class="{ 'text-green-500': isDistanceValid }">
              <UIcon name="i-heroicons-arrows-right-left" class="w-5 h-5 inline-block mr-1" />
              {{ distanceStatus }}
            </div>
            <div :class="{ 'text-green-500': isAngleValid }">
              <UIcon name="i-heroicons-square-3-stack-3d" class="w-5 h-5 inline-block mr-1" />
              {{ angleStatus }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message d'aide -->
    <div 
      v-if="!allConditionsValid" 
      class="help-message absolute bottom-20 left-0 right-0 text-center bg-black/70 text-white p-4"
    >
      {{ helpMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLightSensor } from '~/composables/useLightSensor'
import { useDeviceOrientation } from '~/composables/useDeviceOrientation'

const { lightLevel, isLightValid } = useLightSensor()
const { angle, isAngleValid } = useDeviceOrientation()

// État de la distance (à implémenter avec un capteur ou une estimation)
const isDistanceValid = ref(false)
const distanceStatus = computed(() => 
  isDistanceValid.value ? 'Distance OK' : 'Ajustez la distance'
)

// Messages de statut
const lightStatus = computed(() => {
  if (!lightLevel.value) return 'Vérification...'
  return isLightValid.value ? `${lightLevel.value} lx OK` : 'Éclairage incorrect'
})

const angleStatus = computed(() => 
  isAngleValid.value ? 'Angle OK' : 'Alignez l\'appareil'
)

// Validation globale
const allConditionsValid = computed(() => 
  isLightValid.value && isDistanceValid.value && isAngleValid.value
)

// Message d'aide contextuel
const helpMessage = computed(() => {
  if (!isLightValid.value) return 'Ajustez l\'éclairage (idéal: 600 lux)'
  if (!isDistanceValid.value) return 'Placez-vous à 30cm de la surface'
  if (!isAngleValid.value) return 'Tenez l\'appareil perpendiculaire à la surface'
  return ''
})
</script>

<style scoped>
.target-area {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  transition: border-color 0.3s ease;
}

.guide-overlay {
  background: rgba(0, 0, 0, 0.3);
}

.help-message {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style> 