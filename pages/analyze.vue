<template>
  <UContainer>
    <UPageHeader
      title="Nouvelle analyse"
      description="Comparez deux images pour évaluer la solidité des couleurs"
    />

    <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Colonne de gauche : Image originale -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Image originale</h3>
        </template>

        <div v-if="!file1 && !selectedMaterial" class="space-y-4">
          <!-- Option 1: Sélectionner une matière existante -->
          <UButton
            icon="i-heroicons-square-3-stack-3d"
            class="w-full"
            @click="isSelectMaterialModalOpen = true"
          >
            Sélectionner une matière existante
          </UButton>

          <div class="text-center text-sm text-gray-500">ou</div>

          <!-- Option 2: Créer une nouvelle matière -->
          <UButton
            icon="i-heroicons-plus-circle"
            class="w-full"
            to="/materials/new"
          >
            Créer une nouvelle matière
          </UButton>
        </div>

        <!-- Prévisualisation de la matière sélectionnée -->
        <div v-else class="space-y-4">
          <img 
            :src="selectedMaterial?.image || file1Preview" 
            class="w-full h-48 object-cover rounded-lg" 
          />
          <div class="text-sm font-medium text-gray-900 dark:text-white">
            {{ selectedMaterial?.name }}
          </div>
          <UButton
            color="gray"
            icon="i-heroicons-arrow-path"
            class="w-full"
            @click="resetImage1"
          >
            Changer de matière
          </UButton>
        </div>
      </UCard>

      <!-- Colonne de droite : Image après test -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Image après test</h3>
        </template>

        <div v-if="!file2 && (file1 || selectedMaterial)" class="space-y-4">
          <CameraCapture
            v-model="file2"
            @photo-taken="onPhotoTaken"
          />
        </div>

        <div v-else-if="file2" class="space-y-4">
          <img 
            :src="file2Preview" 
            class="w-full h-48 object-cover rounded-lg" 
          />
          <UButton
            color="gray"
            icon="i-heroicons-arrow-path"
            class="w-full"
            @click="resetImage2"
          >
            Reprendre la photo
          </UButton>
        </div>

        <div v-else class="text-center text-gray-500 py-4">
          Sélectionnez d'abord une matière
        </div>
      </UCard>
    </div>

    <!-- Modal de sélection de matière -->
    <UModal v-model="isSelectMaterialModalOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold">Sélectionner une matière</h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark"
              @click="isSelectMaterialModalOpen = false"
            />
          </div>
        </template>

        <!-- Barre de recherche -->
        <div class="mb-4">
          <UInput
            v-model="searchQuery"
            icon="i-heroicons-magnifying-glass"
            placeholder="Rechercher une matière..."
          />
        </div>

        <!-- Liste des matières -->
        <div class="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          <div
            v-for="material in filteredMaterials"
            :key="material.id"
            class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg"
            @click="selectMaterial(material)"
          >
            <img
              :src="material.image"
              :alt="material.name"
              class="w-full h-32 object-cover rounded-lg mb-2"
            />
            <div class="text-sm font-medium">{{ material.name }}</div>
          </div>
        </div>
      </UCard>
    </UModal>

    <!-- Bouton d'analyse -->
    <UButton
      v-if="canAnalyze"
      class="mt-8 w-full"
      size="lg"
      :loading="isAnalyzing"
      @click="analyzeImages"
    >
      {{ analyzeButtonText }}
    </UButton>

    <!-- Results -->
    <TestResults
      v-if="results"
      :results="results"
      class="mt-8"
    />
  </UContainer>
</template>

<script setup lang="ts">
import { useMaterialsStore } from '~/stores/materials'

const materialsStore = useMaterialsStore()
const selectedMaterial = ref(null)
const file1 = ref<File | null>(null)
const file2 = ref<File | null>(null)
const file2Preview = ref('')
const results = ref(null)
const isAnalyzing = ref(false)
const isSelectMaterialModalOpen = ref(false)
const searchQuery = ref('')

// Charger les matières au montage
onMounted(async () => {
  await materialsStore.fetchMaterials()
})

// Filtrer les matières selon la recherche
const filteredMaterials = computed(() => {
  if (!searchQuery.value) return materialsStore.materials
  const query = searchQuery.value.toLowerCase()
  return materialsStore.materials.filter(material => 
    material.name.toLowerCase().includes(query)
  )
})

// Computed
const canAnalyze = computed(() => {
  const hasFirstImage = selectedMaterial.value
  return hasFirstImage && file2.value && !isAnalyzing.value
})

const analyzeButtonText = computed(() => {
  if (isAnalyzing.value) return 'Analyse en cours...'
  return 'Analyser et Comparer'
})

// Methods
function resetImage1() {
  selectedMaterial.value = null
}

function resetImage2() {
  file2.value = null
  file2Preview.value = ''
}

function selectMaterial(material) {
  selectedMaterial.value = material
  isSelectMaterialModalOpen.value = false
}

function onPhotoTaken(imageData: string) {
  file2Preview.value = imageData
  // Convertir le base64 en File
  const byteString = atob(imageData.split(',')[1])
  const mimeString = imageData.split(',')[0].split(':')[1].split(';')[0]
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  file2.value = new File([ab], 'photo.jpg', { type: mimeString })
}

async function analyzeImages() {
  if (!canAnalyze.value) return

  try {
    isAnalyzing.value = true
    const formData = new FormData()
    
    // Ajouter l'ID du matériau et les images
    formData.append('materialId', selectedMaterial.value.id)
    formData.append('file1', selectedMaterial.value.image)
    formData.append('file2', file2.value!)

    const response = await $fetch('/api/analyze', {
      method: 'POST',
      body: formData
    })

    if (response.success) {
      // Rediriger vers la page des résultats
      navigateTo(response.redirectTo)
    } else {
      throw new Error(response.error)
    }

    useToast().add({
      title: 'Analyse terminée',
      description: 'Les résultats sont disponibles',
      color: 'green'
    })
  } catch (error: any) {
    useToast().add({
      title: 'Erreur',
      description: error.message || 'Une erreur est survenue',
      color: 'red'
    })
  } finally {
    isAnalyzing.value = false
  }
}
</script>