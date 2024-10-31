<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold">Résultats de l'analyse</h2>
        <UButton
          icon="i-heroicons-document-arrow-down"
          @click="downloadReport"
        >
          Télécharger le rapport
        </UButton>
      </div>
    </template>

    <div class="grid md:grid-cols-2 gap-8">
      <UCard v-for="(image, index) in ['image1', 'image2']" :key="index">
        <template #header>
          <h3 class="text-lg font-semibold">
            Image {{ index + 1 }}
          </h3>
        </template>

        <img 
          :src="'data:image/jpeg;base64,' + results[image].gray_image_str"
          :alt="`Image ${index + 1} en niveaux de gris`"
          class="w-full rounded-lg mb-4"
        />

        <div class="space-y-4">
          <UStat
            :label="'Note ISO'"
            :value="results[image].iso_grade.toString()"
            :color="getIsoGradeColor(results[image].iso_grade)"
          />
          <UStat
            :label="'Valeur moyenne de gris'"
            :value="results[image].average_gray.toFixed(2)"
            color="gray"
          />
          <UStat
            :label="'Résolution'"
            :value="results[image].resolution"
            color="blue"
          />
        </div>
      </UCard>
    </div>

    <template #footer>
      <UCard class="bg-gray-50">
        <template #header>
          <h3 class="text-lg font-semibold">Différence globale</h3>
        </template>

        <UStat
          label="Note de différence"
          :value="results.difference_grade.toString()"
          :color="getIsoGradeColor(results.difference_grade)"
        />
      </UCard>
    </template>
  </UCard>
</template>

<script setup lang="ts">
const props = defineProps<{
  results: any // À typer selon votre structure de données
}>()

function getIsoGradeColor(grade: number) {
  if (grade >= 4.5) return 'green'
  if (grade >= 3.5) return 'yellow'
  if (grade >= 2.5) return 'orange'
  return 'red'
}

function downloadReport() {
  // À implémenter : génération et téléchargement du rapport
  useToast().add({
    title: 'Bientôt disponible',
    description: 'La génération de rapport sera disponible prochainement',
    color: 'blue'
  })
}
</script>