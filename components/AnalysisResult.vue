<template>
  <div class="analysis-result">
    <!-- Note ISO -->
    <div class="grade-display">
      <div class="text-3xl font-bold">
        {{ result.grade }}/5
      </div>
      <div class="text-sm text-gray-500">
        Note ISO 105-A02
      </div>
    </div>

    <!-- Détails techniques -->
    <div class="technical-details">
      <div class="detail-item">
        <div class="label">ΔE</div>
        <div class="value">{{ result.deltaE.toFixed(2) }}</div>
      </div>
      <div class="detail-item">
        <div class="label">Luminosité</div>
        <div class="value">{{ result.calibration.ambientLux }} lx</div>
      </div>
      <div class="detail-item">
        <div class="label">Temps</div>
        <div class="value">{{ result.processingTime.toFixed(0) }}ms</div>
      </div>
    </div>
  </div>
</template> 