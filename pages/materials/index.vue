<template>
  <div class="py-6">
    <div class="container mx-auto px-4">
      <!-- En-tête avec bouton -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold">Matières</h1>
          <p class="text-gray-600">Catalogue des matières disponibles</p>
        </div>
        <UButton
          to="/materials/new"
          color="primary"
          icon="i-heroicons-plus"
        >
          Nouvelle matière
        </UButton>
      </div>

      <!-- Filtres et recherche -->
      <div class="mb-6 space-y-4">
        <div class="flex gap-4 flex-wrap">
          <UInput
            v-model="search"
            icon="i-heroicons-magnifying-glass"
            placeholder="Rechercher une matière..."
            size="lg"
            class="flex-1 min-w-[200px]"
          />
          <USelect
            v-model="filter"
            :options="filterOptions"
            placeholder="Filtrer par"
            size="lg"
            class="w-48"
          />
          <USelect
            v-model="sort"
            :options="sortOptions"
            placeholder="Trier par"
            size="lg"
            class="w-48"
          />
        </div>
      </div>

      <!-- Liste des matières -->
      <div v-if="!filteredMaterials.length" class="text-center py-12">
        <UIcon name="i-heroicons-square-3-stack-3d" class="w-12 h-12 mx-auto text-gray-400" />
        <h3 class="mt-2 text-sm font-semibold text-gray-900">Aucune matière trouvée</h3>
        <p class="mt-1 text-sm text-gray-500">Commencez par créer une nouvelle matière.</p>
      </div>

      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <UCard
          v-for="material in filteredMaterials"
          :key="material.id"
          :to="`/materials/${material.id}`"
          class="hover:shadow-lg transition-shadow"
        >
          <div class="aspect-w-16 aspect-h-9 mb-4">
            <img
              :src="material.image"
              :alt="material.name"
              class="object-cover rounded-lg w-full h-full"
            />
            <UBadge
              :color="material.hasAnalysis ? 'green' : 'yellow'"
              class="absolute top-2 right-2"
            >
              {{ material.hasAnalysis ? 'Analysé' : 'Non analysé' }}
            </UBadge>
          </div>
          <h3 class="font-medium">{{ material.name }}</h3>
          <p class="text-sm text-gray-500 line-clamp-2">{{ material.description }}</p>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const search = ref('')
const filter = ref('')
const sort = ref('recent')

// Options de filtrage
const filterOptions = [
  { label: 'Toutes', value: '' },
  { label: 'Analysées', value: 'analyzed' },
  { label: 'Non analysées', value: 'not_analyzed' }
]

// Options de tri
const sortOptions = [
  { label: 'Plus récentes', value: 'recent' },
  { label: 'Plus anciennes', value: 'old' },
  { label: 'Nom A-Z', value: 'name_asc' },
  { label: 'Nom Z-A', value: 'name_desc' }
]

// Récupérer les matières
const { data: materials } = await useFetch('/api/materials')

// Filtrer et trier les matières
const filteredMaterials = computed(() => {
  if (!materials.value) return []
  
  let filtered = [...materials.value]

  // Appliquer le filtre de recherche
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    filtered = filtered.filter(material =>
      material.name.toLowerCase().includes(searchLower) ||
      material.description?.toLowerCase().includes(searchLower)
    )
  }

  // Appliquer le filtre d'analyse
  if (filter.value === 'analyzed') {
    filtered = filtered.filter(m => m.hasAnalysis)
  } else if (filter.value === 'not_analyzed') {
    filtered = filtered.filter(m => !m.hasAnalysis)
  }

  // Appliquer le tri
  switch (sort.value) {
    case 'old':
      filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      break
    case 'name_asc':
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name_desc':
      filtered.sort((a, b) => b.name.localeCompare(a.name))
      break
    default: // 'recent'
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  return filtered
})
</script>