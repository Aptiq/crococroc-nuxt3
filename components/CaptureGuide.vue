<template>
  <div class="capture-guide">
    <!-- Overlay de guidage -->
    <div class="guide-overlay" :class="{ 'is-valid': isPositionValid }">
      <div class="guide-frame" />
    </div>

    <!-- Indicateurs -->
    <div class="guide-indicators">
      <div class="indicator" :class="{ 'is-valid': lightingOk }">
        Éclairage: {{ ambientLight.value }} lx
      </div>
      <div class="indicator" :class="{ 'is-valid': distanceOk }">
        Distance
      </div>
      <div class="indicator" :class="{ 'is-valid': angleOk }">
        Angle
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { ambientLight } = useLightSensor()

// Vérifications en temps réel
const lightingOk = computed(() => {
  const lux = ambientLight.value
  return lux >= 500 && lux <= 700 // Tolérance autour de 600 lx
})
</script> 