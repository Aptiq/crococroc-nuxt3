<template>
  <UContainer class="py-6">
    <UPageHeader
      title="Matières"
      description="Catalogue des matières disponibles"
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

    <!-- Filtres -->
    <div class="mt-6 space-y-4">
      <UInput
        v-model="search"
        icon="i-heroicons-magnifying-glass"
        placeholder="Rechercher une matière..."
        class="max-w-md"
      />
      
      <div class="flex gap-4">
        <USelect
          v-model="sortBy"
          :options="sortOptions"
          placeholder="Trier par"
          class="w-48"
        />
        <UButton
          :icon="sortDirection === 'asc' ? 'i-heroicons-arrow-up' : 'i-heroicons-arrow-down'"
          color="gray"
          variant="ghost"
          @click="toggleSortDirection"
        />
      </div>
    </div>

    <div class="mt-6">
      <UCard>
        <!-- Gestion du chargement -->
        <div v-if="pending" class="p-4">
          <USkeleton class="h-32" />
        </div>
        
        <!-- Message si aucune matière -->
        <div v-else-if="!filteredMaterials.length" class="p-8 text-center text-gray-500">
          Aucune matière ne correspond à votre recherche
        </div>
        
        <!-- Liste des matières -->
        <div v-else class="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
          <UCard
            v-for="material in filteredMaterials"
            :key="material.id"
            :to="`/materials/${material.id}`"
            class="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <!-- Image de la matière -->
            <div class="relative w-full pb-[100%]">
              <img
                :src="material.image"
                :alt="material.name"
                class="absolute inset-0 w-full h-full object-cover rounded-t-lg"
              />
              <UBadge
                :color="material.hasAnalysis ? 'green' : 'gray'"
                class="absolute top-2 right-2"
              >
                {{ material.hasAnalysis ? 'Analysé' : 'Non analysé' }}
              </UBadge>
            </div>

            <!-- Informations de la matière -->
            <div class="p-4">
              <h3 class="font-semibold">{{ material.name }}</h3>
              <p class="text-sm text-gray-500 mt-1 line-clamp-2">
                {{ material.description }}
              </p>
              <p class="text-xs text-gray-400 mt-2">
                Créée le {{ formatDate(material.created_at) }}
              </p>
            </div>
          </UCard>
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

// États
const search = ref('')
const sortBy = ref('created_at')
const sortDirection = ref<'asc' | 'desc'>('desc')

// Options de tri
const sortOptions = [
  { label: 'Date de création', value: 'created_at' },
  { label: 'Nom', value: 'name' },
]

// Récupération des matières
const { data: materials, pending } = await useFetch('/api/materials', {
  transform: (response: any) => {
    console.log('Raw materials response:', response)
    return response
  }
})

// Formatage de la date
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Inverser la direction du tri
function toggleSortDirection() {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
}

// Filtrage et tri des matières
const filteredMaterials = computed(() => {
  if (!materials.value) return []
  
  let filtered = [...materials.value]
  
  // Filtrage par recherche
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    filtered = filtered.filter(material => 
      material.name.toLowerCase().includes(searchLower) ||
      (material.description?.toLowerCase() || '').includes(searchLower)
    )
  }
  
  // Tri
  filtered.sort((a, b) => {
    const aValue = a[sortBy.value]
    const bValue = b[sortBy.value]
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection.value === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    
    return sortDirection.value === 'asc' 
      ? Number(aValue) - Number(bValue)
      : Number(bValue) - Number(aValue)
  })
  
  return filtered
})

// Debug logs
watchEffect(() => {
  console.log('Materials count:', materials.value?.length)
  console.log('Filtered count:', filteredMaterials.value.length)
})
</script>