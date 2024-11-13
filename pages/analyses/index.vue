<template>
  <UContainer class="py-6">
    <UPageHeader
      title="Analyses"
      description="Historique des analyses effectuées"
    >
      <template #right>
        <UButton
          to="/analyze"
          color="primary"
          icon="i-heroicons-camera"
        >
          Nouvelle analyse
        </UButton>
      </template>
    </UPageHeader>

    <!-- Filtres -->
    <div class="mt-6 space-y-4">
      <UInput
        v-model="search"
        icon="i-heroicons-magnifying-glass"
        placeholder="Rechercher une analyse..."
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
        <UTable
          :rows="filteredAnalyses"
          :columns="columns"
          :loading="pending"
        >
          <!-- Template pour le nom de la matière -->
          <template #material-data="{ row }">
            <div class="flex items-center gap-3">
              <img
                v-if="row.material?.image"
                :src="row.material.image"
                :alt="row.material.name"
                class="w-10 h-10 rounded object-cover"
              />
              <span>{{ row.material?.name || 'N/A' }}</span>
            </div>
          </template>

          <!-- Template pour la date -->
          <template #createdAt-data="{ row }">
            {{ formatDate(row.created_at) }}
          </template>

          <!-- Template pour la note -->
          <template #note-data="{ row }">
            <UBadge
              :color="getNoteColor(row.difference_grade)"
              :label="row.difference_grade?.toFixed(1) || 'N/A'"
              variant="solid"
            />
          </template>

          <!-- Template pour les actions -->
          <template #actions-data="{ row }">
            <UButton
              :to="`/analyses/${row.id}`"
              color="gray"
              variant="ghost"
              icon="i-heroicons-eye"
            />
          </template>
        </UTable>
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
  { label: 'Matière', value: 'material.name' },
  { label: 'Note', value: 'difference_grade' }
]

// Récupérer les analyses depuis l'API
const { data: analyses, pending } = await useFetch('/api/analyses', {
  default: () => [],
  onResponseError: (error) => {
    console.error('Erreur lors du chargement des analyses:', error)
    useToast().add({
      title: 'Erreur',
      description: 'Impossible de charger les analyses',
      color: 'red'
    })
  }
})

const columns = [
  {
    key: 'material',
    label: 'Matière'
  },
  {
    key: 'note',
    label: 'Note'
  },
  {
    key: 'createdAt',
    label: 'Date de création'
  },
  {
    key: 'actions',
    label: 'Actions'
  }
]

// Fonction pour formater la date
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

// Fonction pour déterminer la couleur du badge selon la note
const getNoteColor = (note: number) => {
  if (!note) return 'gray'
  if (note >= 4) return 'green'
  if (note >= 2) return 'yellow'
  return 'red'
}

// Inverser la direction du tri
function toggleSortDirection() {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
}

// Filtrage et tri des analyses
const filteredAnalyses = computed(() => {
  if (!analyses.value) return []
  
  let filtered = [...analyses.value]
  
  // Filtrage par recherche
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    filtered = filtered.filter(analysis => 
      analysis.material?.name?.toLowerCase().includes(searchLower) ||
      analysis.difference_grade?.toString().includes(searchLower)
    )
  }
  
  // Tri
  filtered.sort((a, b) => {
    let aValue = a[sortBy.value]
    let bValue = b[sortBy.value]
    
    // Gestion spéciale pour le tri par nom de matière
    if (sortBy.value === 'material.name') {
      aValue = a.material?.name || ''
      bValue = b.material?.name || ''
    }
    
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
  console.log('Analyses count:', analyses.value?.length)
  console.log('Filtered count:', filteredAnalyses.value.length)
})
</script>