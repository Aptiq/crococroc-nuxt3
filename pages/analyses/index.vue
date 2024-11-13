<template>
  <div class="py-6">
    <div class="container mx-auto px-4">
      <!-- En-tête avec bouton -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold">Analyses</h1>
          <p class="text-gray-600">Historique des analyses effectuées</p>
        </div>
        <UButton
          to="/analyses/new"
          color="primary"
          icon="i-heroicons-plus"
        >
          Nouvelle analyse
        </UButton>
      </div>

      <!-- Filtres et recherche -->
      <div class="mb-6 space-y-4">
        <div class="flex gap-4 flex-wrap">
          <UInput
            v-model="search"
            icon="i-heroicons-magnifying-glass"
            placeholder="Rechercher une analyse..."
            size="lg"
            class="flex-1 min-w-[200px]"
          />
          <USelect
            v-model="gradeFilter"
            :options="gradeOptions"
            placeholder="Note"
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

      <!-- Liste des analyses -->
      <UCard>
        <div v-if="!filteredAnalyses.length" class="text-center py-12">
          <UIcon name="i-heroicons-chart-bar" class="w-12 h-12 mx-auto text-gray-400" />
          <h3 class="mt-2 text-sm font-semibold text-gray-900">Aucune analyse trouvée</h3>
          <p class="mt-1 text-sm text-gray-500">Commencez par analyser une matière.</p>
        </div>

        <UTable
          v-else
          :rows="filteredAnalyses"
          :columns="columns"
          :sort="{ column: 'created_at', direction: 'desc' }"
        >
          <template #material-data="{ row }">
            <div class="flex items-center gap-3">
              <img
                :src="row.material.image"
                :alt="row.material.name"
                class="w-10 h-10 rounded object-cover"
              />
              <div>
                <div class="font-medium">{{ row.material.name }}</div>
                <div class="text-sm text-gray-500">{{ formatDate(row.created_at) }}</div>
              </div>
            </div>
          </template>

          <template #grade-data="{ row }">
            <UBadge
              :color="getGradeColor(row.difference_grade)"
              size="lg"
            >
              {{ row.difference_grade.toFixed(1) }}
            </UBadge>
          </template>
        </UTable>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const search = ref('')
const gradeFilter = ref('')
const sort = ref('recent')

// Options de filtrage par note
const gradeOptions = [
  { label: 'Toutes les notes', value: '' },
  { label: 'Excellentes (≥4)', value: 'excellent' },
  { label: 'Moyennes (2.5-4)', value: 'average' },
  { label: 'Faibles (<2.5)', value: 'poor' }
]

// Options de tri
const sortOptions = [
  { label: 'Plus récentes', value: 'recent' },
  { label: 'Plus anciennes', value: 'old' },
  { label: 'Note croissante', value: 'grade_asc' },
  { label: 'Note décroissante', value: 'grade_desc' }
]

// Colonnes pour le tableau
const columns = [
  {
    key: 'material',
    label: 'Matière',
    sortable: true
  },
  {
    key: 'grade',
    label: 'Note',
    sortable: true
  }
]

// Récupérer les analyses
const { data: analyses } = await useFetch('/api/analyses')

// Filtrer et trier les analyses
const filteredAnalyses = computed(() => {
  if (!analyses.value) return []
  
  let filtered = [...analyses.value]

  // Appliquer le filtre de recherche
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    filtered = filtered.filter(analysis =>
      analysis.material.name.toLowerCase().includes(searchLower)
    )
  }

  // Appliquer le filtre de note
  switch (gradeFilter.value) {
    case 'excellent':
      filtered = filtered.filter(a => a.difference_grade >= 4)
      break
    case 'average':
      filtered = filtered.filter(a => a.difference_grade >= 2.5 && a.difference_grade < 4)
      break
    case 'poor':
      filtered = filtered.filter(a => a.difference_grade < 2.5)
      break
  }

  // Appliquer le tri
  switch (sort.value) {
    case 'old':
      filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      break
    case 'grade_asc':
      filtered.sort((a, b) => a.difference_grade - b.difference_grade)
      break
    case 'grade_desc':
      filtered.sort((a, b) => b.difference_grade - a.difference_grade)
      break
    default: // 'recent'
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  return filtered
})

// Fonction pour formater la date
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
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