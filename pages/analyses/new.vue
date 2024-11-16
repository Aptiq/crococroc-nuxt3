<template>
  <UContainer class="py-6">
    <UPageHeader
      title="Nouvelle analyse"
      description="Sélectionnez une matière à analyser"
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

    <UCard class="mt-6">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Sélection de la matière</h3>
          <UButton
            v-if="!selectedMaterial"
            to="/materials/new"
            color="gray"
            variant="ghost"
            icon="i-heroicons-plus"
            size="sm"
          >
            Nouvelle matière
          </UButton>
        </div>
      </template>

      <div class="space-y-4 p-4">
        <!-- Affichage de la matière sélectionnée -->
        <div v-if="selectedMaterial" class="border rounded-lg p-4">
          <div class="flex items-center gap-4">
            <img
              :src="selectedMaterial.image"
              :alt="selectedMaterial.name"
              class="w-20 h-20 object-cover rounded"
            />
            <div>
              <h4 class="font-medium">{{ selectedMaterial.name }}</h4>
              <p class="text-sm text-gray-500">{{ selectedMaterial.description }}</p>
            </div>
          </div>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark"
            class="mt-4"
            @click="selectedMaterial = null"
          >
            Changer de matière
          </UButton>
        </div>

        <!-- Boutons d'action -->
        <div v-else class="space-y-4">
          <UButton
            block
            color="primary"
            icon="i-heroicons-square-3-stack-3d"
            @click="isModalOpen = true"
          >
            Choisir une matière
          </UButton>
          <UDivider>ou</UDivider>
          <UButton
            block
            color="gray"
            variant="soft"
            icon="i-heroicons-plus"
            to="/materials/new"
          >
            Créer une nouvelle matière
          </UButton>
        </div>
      </div>
    </UCard>

    <!-- Modal de sélection de matière -->
    <UModal v-model="isModalOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold">Sélectionner une matière</h3>
            <UInput
              v-model="search"
              icon="i-heroicons-magnifying-glass"
              placeholder="Rechercher..."
              class="max-w-xs"
            />
          </div>
        </template>

        <div class="max-h-96 overflow-y-auto">
          <div v-if="!filteredMaterials.length" class="py-8 text-center text-gray-500">
            Aucune matière disponible pour analyse
          </div>

          <UCard
            v-for="material in filteredMaterials"
            :key="material.id"
            class="mb-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
            @click="selectMaterial(material)"
          >
            <div class="flex items-center gap-4">
              <img
                :src="material.image"
                :alt="material.name"
                class="w-16 h-16 object-cover rounded"
              />
              <div>
                <h4 class="font-medium">{{ material.name }}</h4>
                <p class="text-sm text-gray-500 line-clamp-1">
                  {{ material.description }}
                </p>
              </div>
            </div>
          </UCard>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="gray"
              variant="soft"
              @click="isModalOpen = false"
            >
              Annuler
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </UContainer>
</template>

<script setup lang="ts">
import type { Material } from '~/types'

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const router = useRouter()

// États avec typage
const search = ref('')
const selectedMaterial = ref<Material | null>(null)
const isModalOpen = ref(false)

const route = useRoute()
const materialId = route.query.materialId as string

// Charger la matière si un ID est fourni
const { data: preselectedMaterial } = await useFetch(`/api/materials/${materialId}`, {
  immediate: !!materialId
})

// Présélectionner la matière si elle existe
if (preselectedMaterial.value) {
  selectedMaterial.value = preselectedMaterial.value
}

// Récupérer les matières non analysées
const { data: materials } = await useFetch('/api/materials', {
  transform: (materials) => 
    materials.filter((m: any) => !m.hasAnalysis)
})

// Filtrer les matières selon la recherche
const filteredMaterials = computed(() => {
  if (!materials.value) return []
  if (!search.value) return materials.value

  const searchLower = search.value.toLowerCase()
  return materials.value.filter((material: any) =>
    material.name.toLowerCase().includes(searchLower) ||
    material.description?.toLowerCase().includes(searchLower)
  )
})

// Sélectionner une matière
function selectMaterial(material: Material) {
  selectedMaterial.value = material
  isModalOpen.value = false
}

// Redirection avec typage
watch(selectedMaterial, (newMaterial: Material | null) => {
  if (newMaterial?.id) {
    router.push(`/materials/${newMaterial.id}/analyze`)
  }
})
</script>