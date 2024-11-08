<template>
  <div>
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

      <div v-if="error" class="mt-8">
        <UAlert 
          type="danger" 
          title="Erreur" 
          :description="error.message || 'Une erreur est survenue lors du chargement des données'"
        />
      </div>

      <div v-else-if="pending" class="flex justify-center py-8">
        <LoadingScreen />
      </div>

      <div v-else-if="!analysis || !isValidAnalysis" class="mt-8">
        <UAlert
          type="warning"
          title="Données incomplètes"
          description="L'analyse n'a pas encore été traitée ou les données sont incomplètes"
        />
      </div>

      <template v-else>
        <div class="mt-8 grid md:grid-cols-2 gap-6">
          <!-- Image 1 -->
          <UCard>
            <template #header>
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold">Image 1</h3>
                <div class="flex flex-col items-end">
                  <div class="text-sm text-gray-600">ISO Grade: {{ analysis.image1_iso_grade?.toFixed(1) }}</div>
                  <div class="text-sm text-gray-600">Niveau de gris: {{ analysis.image1_avg_gray?.toFixed(0) }}</div>
                </div>
              </div>
            </template>
            
            <img 
              :src="getImageSrc(analysis.image1_gray)"
              class="w-full h-auto rounded"
              @error="handleImageError('image1')"
              alt="Image 1"
            />

            <template #footer>
              <div class="text-sm text-gray-500">
                Résolution: {{ analysis.image1_resolution || 'Non disponible' }}
              </div>
            </template>
          </UCard>

          <!-- Image 2 -->
          <UCard>
            <template #header>
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold">Image 2</h3>
                <div class="flex flex-col items-end">
                  <div class="text-sm text-gray-600">ISO Grade: {{ analysis.image2_iso_grade?.toFixed(1) }}</div>
                  <div class="text-sm text-gray-600">Niveau de gris: {{ analysis.image2_avg_gray?.toFixed(0) }}</div>
                </div>
              </div>
            </template>
            
            <img 
              :src="getImageSrc(analysis.image2_gray)"
              class="w-full h-auto rounded"
              @error="handleImageError('image2')"
              alt="Image 2"
            />

            <template #footer>
              <div class="text-sm text-gray-500">
                Résolution: {{ analysis.image2_resolution || 'Non disponible' }}
              </div>
            </template>
          </UCard>
        </div>

        <!-- Nouvelle présentation du score de différence -->
        <UCard class="mt-6">
          <template #header>
            <h3 class="text-lg font-semibold">Résultat de la comparaison</h3>
          </template>

          <div class="p-4">
            <div class="relative pt-8 pb-4">
              <!-- Barre de progression avec gradient -->
              <div class="h-3 rounded-full relative" style="background: linear-gradient(to right, #22c55e, #84cc16, #eab308, #f97316, #ef4444)">
                <!-- Graduations ISO -->
                <div class="absolute w-full flex justify-between -top-6 px-2">
                  <span class="text-xs text-gray-600">1</span>
                  <span class="text-xs text-gray-600">2</span>
                  <span class="text-xs text-gray-600">3</span>
                  <span class="text-xs text-gray-600">4</span>
                  <span class="text-xs text-gray-600">5</span>
                </div>

                <!-- Curseur -->
                <div 
                  class="absolute w-4 h-4 bg-white border-2 border-gray-800 rounded-full -top-1 transform -translate-x-1/2"
                  :style="{ left: `${(analysis.difference_grade / 5) * 100}%` }"
                />
              </div>

              <!-- Légende -->
              <div class="flex justify-between mt-4 text-sm text-gray-600">
                <span>Images identiques</span>
                <span>Images très différentes</span>
              </div>

              <!-- Score avec nouvelle logique de couleur -->
              <div class="mt-6 text-center">
                <UBadge
                  :color="getDifferenceGradeColor"
                  size="lg"
                  class="text-lg"
                >
                  Différence: {{ analysis.difference_grade.toFixed(1) }}/5
                </UBadge>
              </div>

              <!-- Interprétation -->
              <div class="mt-4 text-center" :class="getDifferenceTextColor">
                {{ getDifferenceInterpretation }}
              </div>
            </div>
          </div>
        </UCard>
      </template>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
// Définition du type attendu
interface Analysis {
  id: string
  material_id: string
  material: {
    id: string
    name: string
    description?: string
    image: string
  }
  image1_gray: string
  image1_iso_grade: number
  image1_avg_gray: number
  image1_resolution: string
  image2_gray: string
  image2_iso_grade: number
  image2_avg_gray: number
  image2_resolution: string
  difference_grade: number
  created_at: string
  updated_at: string
}

const route = useRoute()
const { id } = route.params

// Vérification de la validité de l'analyse
const isValidAnalysis = computed(() => {
  if (!analysis.value) return false
  return analysis.value.image1_iso_grade > 0 || 
         analysis.value.image2_iso_grade > 0 || 
         analysis.value.difference_grade > 0
})

// Formatage des notes
function formatGrade(grade: number): string {
  if (!grade) return 'N/A'
  return `${grade.toFixed(1)}/5`
}

// Récupération des données
const { data: analysis, pending, error } = await useFetch(`/api/analyses/${id}`, {
  key: `analysis-${id}`,
  onResponse({ response }) {
    console.log('Données reçues:', response._data)
  },
  onResponseError({ response }) {
    console.error('Erreur API:', response)
    useToast().add({
      title: 'Erreur',
      description: 'Impossible de charger les détails de l\'analyse',
      color: 'red'
    })
  }
})

// Formatage de la date
const analysisDate = computed(() => {
  if (!analysis.value?.created_at) return ''
  return new Date(analysis.value.created_at).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Nouvelle logique de couleur (inversée)
const getDifferenceGradeColor = computed(() => {
  const grade = analysis.value?.difference_grade || 0
  if (grade <= 1) return 'green'     // Excellent (très similaire)
  if (grade <= 2) return 'lime'      // Bon
  if (grade <= 3) return 'yellow'    // Moyen
  if (grade <= 4) return 'orange'    // Mauvais
  return 'red'                       // Très mauvais (très différent)
})

// Nouvelle interprétation
const getDifferenceInterpretation = computed(() => {
  const grade = analysis.value?.difference_grade || 0
  if (grade <= 1) return "Excellente correspondance : Les images sont presque identiques"
  if (grade <= 2) return "Bonne correspondance : Différences mineures"
  if (grade <= 3) return "Correspondance moyenne : Différences notables"
  if (grade <= 4) return "Faible correspondance : Différences importantes"
  return "Mauvaise correspondance : Images très différentes"
})

// Couleur du texte d'interprétation
const getDifferenceTextColor = computed(() => {
  const grade = analysis.value?.difference_grade || 0
  if (grade <= 1) return 'text-green-600'
  if (grade <= 2) return 'text-lime-600'
  if (grade <= 3) return 'text-yellow-600'
  if (grade <= 4) return 'text-orange-600'
  return 'text-red-600'
})

// Téléchargement du rapport
function downloadReport() {
  useToast().add({
    title: 'Bientôt disponible',
    description: 'Le téléchargement du rapport sera disponible prochainement',
    color: 'info'
  })
}

// Gestion des erreurs d'images
function handleImageError(imageType: 'image1' | 'image2') {
  useToast().add({
    title: 'Erreur d\'image',
    description: `L'${imageType} n'a pas pu être chargée`,
    color: 'warning'
  })
}

// Modification de la fonction getImageSrc pour gérer différents formats
function getImageSrc(base64String: string): string {
  if (!base64String) return ''
  if (base64String.startsWith('data:image/')) return base64String
  
  // Essayer de détecter le type d'image (vous pouvez ajuster selon vos besoins)
  const imageType = 'jpeg' // ou détectez dynamiquement
  return `data:image/${imageType};base64,${base64String}`
}

// Ajoutons des logs pour déboguer
watch(analysis, (newValue) => {
  if (newValue) {
    console.log('Analyse mise à jour:', {
      id: newValue.id,
      image1_iso_grade: newValue.image1_iso_grade,
      image2_iso_grade: newValue.image2_iso_grade,
      difference_grade: newValue.difference_grade,
      image1_resolution: newValue.image1_resolution,
      image2_resolution: newValue.image2_resolution
    })
  }
}, { immediate: true })
</script>

<style scoped>
.progress-marker {
  @apply absolute w-2 h-2 rounded-full bg-gray-400 -mt-2;
  transform: translateX(-50%);
}

/* Ajout d'une animation pour le curseur */
.transform {
  transition: left 0.3s ease-out;
}
</style>