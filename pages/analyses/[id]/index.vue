<template>
  <UContainer>
    <UPageHeader
      title="Détails de l'analyse"
      :description="analysisDate"
    >
      <template #right>
        <UButton
          to="/materials"
          color="gray"
          variant="ghost"
          icon="i-heroicons-arrow-left"
        >
          Retour
        </UButton>
      </template>
    </UPageHeader>

    <div v-if="pending" class="flex justify-center py-8">
      <ULoadingBar />
    </div>

    <template v-else-if="analysis">
      <div class="grid md:grid-cols-2 gap-8 mt-8">
        <!-- Image initiale -->
        <UCard>
          <template #header>
            <h3 class="text-xl font-semibold">État initial</h3>
          </template>
          
          <img 
            :src="analysis.image1_gray"
            class="w-full rounded-lg mb-4"
            alt="État initial"
          />
          
          <div class="space-y-2">
            <UStat 
              label="Note ISO"
              :value="analysis.image1_iso_grade.toFixed(1)"
              :color="getGradeColor(analysis.image1_iso_grade)"
            />
            <UStat 
              label="Valeur moyenne"
              :value="analysis.image1_avg_gray.toFixed(2)"
            />
          </div>
        </UCard>

        <!-- Image après test -->
        <UCard>
          <template #header>
            <h3 class="text-xl font-semibold">État après test</h3>
          </template>
          
          <img 
            :src="analysis.image2_gray"
            class="w-full rounded-lg mb-4"
            alt="État après test"
          />
          
          <div class="space-y-2">
            <UStat 
              label="Note ISO"
              :value="analysis.image2_iso_grade.toFixed(1)"
              :color="getGradeColor(analysis.image2_iso_grade)"
            />
            <UStat 
              label="Valeur moyenne"
              :value="analysis.image2_avg_gray.toFixed(2)"
            />
          </div>
        </UCard>
      </div>

      <!-- Résultat final -->
      <UCard class="mt-8">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold">Résultat de l'analyse</h3>
            <UButton
              icon="i-heroicons-document-arrow-down"
              @click="downloadReport"
              color="gray"
              variant="ghost"
            >
              Télécharger le rapport
            </UButton>
          </div>
        </template>

        <div class="grid md:grid-cols-3 gap-4">
          <UStat
            label="Différence globale"
            :value="analysis.difference_grade.toFixed(1)"
            :color="getGradeColor(analysis.difference_grade)"
          />
          <UStat
            label="Date de l'analyse"
            :value="analysisDate"
          />
          <UStat
            label="Résolution"
            :value="analysis.image1_resolution"
          />
        </div>
      </UCard>
    </template>

    <UCard v-else class="mt-8 p-12">
      <div class="text-center">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-gray-400 mx-auto" />
        <h3 class="mt-2 text-sm font-semibold text-gray-900">Analyse non trouvée</h3>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
const route = useRoute()
const { id } = route.params

// Récupération des données depuis l'API
const { data: analysis, pending } = await useFetch(`/api/analyses/${id}`)

// Formatage de la date
const analysisDate = computed(() => {
  if (!analysis.value) return ''
  return new Date(analysis.value.created_at).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Couleur en fonction de la note
function getGradeColor(grade: number) {
  if (grade >= 4.5) return 'green'
  if (grade >= 3.5) return 'yellow'
  if (grade >= 2.5) return 'orange'
  return 'red'
}

// Téléchargement du rapport (à implémenter)
function downloadReport() {
  useToast().add({
    title: 'Bientôt disponible',
    description: 'Le téléchargement du rapport sera disponible prochainement',
    color: 'info'
  })
}
</script>