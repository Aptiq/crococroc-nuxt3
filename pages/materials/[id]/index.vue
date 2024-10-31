<template>
  <UContainer>
    <UPageHeader
      :title="material?.name"
      :description="material?.description"
    >
      <template #right>
        <div class="flex gap-2">
          <UButton
            to="/materials"
            color="gray"
            variant="ghost"
            icon="i-heroicons-arrow-left"
          >
            Retour
          </UButton>
          <UButton
            :to="`/materials/${id}/analyze`"
            color="primary"
            icon="i-heroicons-camera"
          >
            Nouvelle analyse
          </UButton>
        </div>
      </template>
    </UPageHeader>

    <div v-if="pending" class="flex justify-center py-8">
      <ULoadingBar />
    </div>

    <template v-else-if="material">
      <!-- Informations principales -->
      <UCard class="mt-8">
        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <img 
              :src="material.image"
              :alt="material.name"
              class="rounded-lg w-full"
            />
          </div>
          <div class="space-y-4">
            <div>
              <h3 class="text-sm font-medium text-gray-500">Date d'ajout</h3>
              <p>{{ formatDate(material.created_at) }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500">Description</h3>
              <p class="whitespace-pre-line">{{ material.description || 'Aucune description' }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500">Nombre d'analyses</h3>
              <p>{{ material.analyses?.length || 0 }}</p>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Historique des analyses -->
      <UCard class="mt-8">
        <template #header>
          <h2 class="text-xl font-semibold">Historique des analyses</h2>
        </template>

        <div v-if="material.analyses?.length" class="space-y-4">
          <UCard
            v-for="analysis in sortedAnalyses"
            :key="analysis.id"
            class="hover:shadow-lg transition-shadow"
            :to="`/analyses/${analysis.id}`"
          >
            <div class="grid md:grid-cols-4 gap-4 items-center">
              <div>
                <img 
                  :src="analysis.test_image"
                  class="w-24 h-24 object-cover rounded"
                  alt="Photo analyse"
                />
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500">Date</h4>
                <p>{{ formatDate(analysis.created_at) }}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500">Note</h4>
                <UStat
                  size="sm"
                  :value="analysis.difference_grade.toString()"
                  :color="getGradeColor(analysis.difference_grade)"
                />
              </div>
              <div>
                <UButton
                  color="gray"
                  variant="ghost"
                  icon="i-heroicons-arrow-right"
                >
                  Voir les détails
                </UButton>
              </div>
            </div>
          </UCard>
        </div>

        <template v-else>
          <div class="text-center py-12">
            <UIcon
              name="i-heroicons-document-magnifying-glass"
              class="mx-auto h-12 w-12 text-gray-400"
            />
            <h3 class="mt-2 text-sm font-medium text-gray-900">
              Aucune analyse
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              Commencez par effectuer une nouvelle analyse.
            </p>
            <div class="mt-6">
              <UButton
                :to="`/materials/${id}/analyze`"
                color="primary"
              >
                Nouvelle analyse
              </UButton>
            </div>
          </div>
        </template>
      </UCard>
    </template>

    <UCard v-else class="mt-8 p-12">
      <div class="text-center">
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="mx-auto h-12 w-12 text-gray-400"
        />
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          Matière non trouvée
        </h3>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
const route = useRoute()
const { id } = route.params

// Charger les données de la matière
const { data: material, pending } = await useFetch(`/api/materials/${id}`)

// Trier les analyses par date
const sortedAnalyses = computed(() => {
  if (!material.value?.analyses) return []
  return [...material.value.analyses].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
})

// Formatage des dates
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Couleur selon la note
function getGradeColor(grade: number) {
  if (grade >= 4.5) return 'green'
  if (grade >= 3.5) return 'yellow'
  if (grade >= 2.5) return 'orange'
  return 'red'
}
</script>