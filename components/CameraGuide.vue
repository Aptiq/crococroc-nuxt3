<template>
  <div class="camera-guide relative">
    <!-- Overlay de guidage -->
    <div class="guide-overlay absolute inset-0">
      <!-- Zone cible -->
      <div 
        class="target-area"
        :class="{ 
          'border-green-500': isPositionValid,
          'border-red-500': !isPositionValid 
        }"
      >
        <!-- Indicateurs -->
        <div class="indicators absolute bottom-0 left-0 right-0 p-4">
          <div class="flex justify-around text-sm">
            <div :class="{ 'text-green-500': isLightValid }">
              {{ lightStatus }}
            </div>
            <div :class="{ 'text-green-500': isDistanceValid }">
              {{ distanceStatus }}
            </div>
            <div :class="{ 'text-green-500': isAngleValid }">
              {{ angleStatus }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message d'aide -->
    <div v-if="!allConditionsValid" class="help-message">
      {{ helpMessage }}
    </div>
  </div>
</template> 