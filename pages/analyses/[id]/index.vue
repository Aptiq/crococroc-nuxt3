<template>
  <UContainer class="py-6">
    <UPageHeader
      title="Détail de l'analyse"
      :description="`Analyse de ${material?.name || 'la matière'}`"
    >
      <template #right>
        <UButton
          to="/analyses"
          color="gray"
          variant="ghost"
          icon="i-heroicons-arrow-left"
        >
          Retour aux analyses
        </UButton>
      </template>
    </UPageHeader>

    <div v-if="pending" class="mt-6">
      <USkeleton class="h-32" />
    </div>

    <div v-else-if="!analysis" class="mt-6 text-center">
      <UCard>
        <div class="py-12">
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="w-12 h-12 text-gray-400 mx-auto"
          />
          <h3 class="mt-2 text-sm font-semibold text-gray-900">
            Analyse non trouvée
          </h3>
        </div>
      </UCard>
    </div>

    <div v-else class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Matière d'origine -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Matière d'origine</h3>
        </template>

        <div class="p-4 space-y-6">
          <!-- Informations de la matière -->
          <div class="flex items-start gap-4">
            <img
              :src="material?.image"
              :alt="material?.name"
              class="w-24 h-24 object-cover rounded-lg"
            />
            <div>
              <h4 class="font-medium text-lg">{{ material?.name }}</h4>
              <p class="text-sm text-gray-500 mt-1">
                {{ material?.description }}
              </p>
            </div>
          </div>

          <!-- Image originale -->
          <div>
            <div class="text-sm text-gray-500 mb-2">Image de référence</div>
            <img
              :src="material?.image"
              class="w-full aspect-video object-cover rounded-lg"
              alt="Image originale"
            />
          </div>

          <!-- Détails techniques image 1 -->
          <div class="space-y-4">
            <div>
              <div class="text-sm text-gray-500">Note ISO</div>
              <div class="font-medium text-lg">{{ analysis.image1_iso_grade.toFixed(1) }}/5</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">Résolution</div>
              <div class="font-medium">{{ analysis.image1_resolution }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">Niveau de gris moyen</div>
              <div class="font-medium">{{ analysis.image1_avg_gray.toFixed(1) }}</div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Matière après test -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Après test</h3>
        </template>

        <div class="p-4 space-y-6">
          <!-- Note globale -->
          <div>
            <div class="text-sm text-gray-500 mb-2">Note globale</div>
            <!-- Barre de progression avec dégradé -->
            <div class="relative h-4 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full">
              <div
                class="absolute -top-1 w-3 h-6 bg-white border-2 border-gray-300 rounded-full transform -translate-x-1/2 shadow-md"
                :style="`left: ${(analysis.difference_grade / 5) * 100}%`"
              />
            </div>
            <div class="mt-2 flex justify-between text-xs text-gray-500">
              <span>1</span>
              <span>2.5</span>
              <span>5</span>
            </div>
            <UBadge
              :color="getGradeColor(analysis.difference_grade)"
              class="mt-3 text-lg"
            >
              {{ analysis.difference_grade.toFixed(1) }}/5
            </UBadge>
          </div>

          <!-- Image après test -->
          <div>
            <div class="text-sm text-gray-500 mb-2">Image après test</div>
            <img
              :src="analysis.image2 || analysis.image2_gray"
              class="w-full aspect-video object-cover rounded-lg"
              alt="Image après test"
            />
          </div>

          <!-- Détails techniques image 2 -->
          <div class="space-y-4">
            <div>
              <div class="text-sm text-gray-500">Note ISO</div>
              <div class="font-medium text-lg">{{ analysis.image2_iso_grade.toFixed(1) }}/5</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">Résolution</div>
              <div class="font-medium">{{ analysis.image2_resolution }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">Niveau de gris moyen</div>
              <div class="font-medium">{{ analysis.image2_avg_gray.toFixed(1) }}</div>
            </div>
          </div>

          <!-- Date de l'analyse -->
          <div class="pt-4 border-t">
            <div class="text-sm text-gray-500">Analysé le</div>
            <div class="font-medium">{{ formatDate(analysis.created_at) }}</div>
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

interface Analysis {
  id: string
  material_id: string
  material: {
    id: string
    name: string
    image: string
  }
  image1_gray: string
  image1_iso_grade: number
  image1_avg_gray: number
  image1_resolution: string
  image2_gray: string
  image2: string
  image2_iso_grade: number
  image2_avg_gray: number
  image2_resolution: string
  difference_grade: number
  created_at: string
  updated_at: string
}

const route = useRoute()
const { id } = route.params

// Récupérer les détails de l'analyse avec le bon typage
const { data: analysis, pending } = await useFetch<Analysis>(`/api/analyses/${id}`)

// Récupérer les détails de la matière associée
const material = computed(() => analysis.value?.material)

// Fonction pour formater la date
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Fonction pour déterminer la couleur selon la note
function getGradeColor(grade: number) {
  if (!grade) return 'gray'
  if (grade >= 4) return 'green'
  if (grade >= 2.5) return 'yellow'
  return 'red'
}
</script>

<style scoped>
.gradient-bar {
  background: linear-gradient(to right, 
    #ef4444 0%,    /* red-500 */
    #eab308 50%,   /* yellow-500 */
    #22c55e 100%   /* green-500 */
  );
}
</style>