<template>
  <div v-if="showTutorial" class="tutorial-overlay">
    <div class="tutorial-step">
      <h3>{{ currentStep.title }}</h3>
      <p>{{ currentStep.description }}</p>
      <div class="tutorial-navigation">
        <UButton @click="previousStep">Précédent</UButton>
        <UButton @click="nextStep">
          {{ isLastStep ? 'Terminer' : 'Suivant' }}
        </UButton>
      </div>
    </div>
  </div>
</template> 