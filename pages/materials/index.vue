<template>
  <UContainer>
    <UPageHeader
      title="Mes matières"
      description="Liste des matières à analyser"
    >
      <template #right>
        <UButton
          to="/materials/new"
          color="primary"
          icon="i-heroicons-plus"
        >
          Nouvelle matière
        </UButton>
      </template>
    </UPageHeader>

    <div v-if="loading" class="flex justify-center py-8">
      <ULoadingBar />
    </div>

    <div v-else class="grid md:grid-cols-3 gap-4 mt-8">
      <UCard
        v-for="material in materials"
        :key="material.id"
        class="hover:shadow-lg transition-shadow"
        :to="`/materials/${material.id}`"
      >
        <img
          :src="material.image"
          class="w-full h-48 object-cover rounded-t-lg"
          :alt="material.name"
        />
        <template #footer>
          <div>
            <h3 class="font-semibold">{{ material.name }}</h3>
            <p class="text-sm text-gray-500">
              {{ formatDate(material.created_at) }}
            </p>
          </div>
        </template>
      </UCard>
    </div>

    <UCard v-if="!loading && !materials?.length" class="mt-8">
      <div class="text-center py-12">
        <UIcon
          name="i-heroicons-square-3-stack-3d"
          class="mx-auto h-12 w-12 text-gray-400"
        />
        <h3 class="mt-2 text-sm font-semibold text-gray-900">
          Aucune matière
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          Commencez par ajouter une nouvelle matière à analyser.
        </p>
        <div class="mt-6">
          <UButton
            to="/materials/new"
            color="primary"
          >
            Nouvelle matière
          </UButton>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { useMaterialsStore } from '~/stores/materials'

const store = useMaterialsStore()

// Charger les matières au montage du composant
onMounted(async () => {
  await store.fetchMaterials()
})

// Utiliser les données du store
const materials = computed(() => store.sortedMaterials)
const loading = computed(() => store.loading)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}
</script>