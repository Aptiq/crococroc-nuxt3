<template>
  <UContainer class="py-6">
    <UPageHeader
      title="Tableau de bord"
      description="Bienvenue sur CrocoCroc"
    >
      <template #right>
        <div class="flex gap-2">
          <UButton
            to="/analyses/new"
            color="primary"
            icon="i-heroicons-camera"
          >
            Nouvelle analyse
          </UButton>
          <UButton
            to="/materials/new"
            color="gray"
            variant="soft"
            icon="i-heroicons-plus"
          >
            Nouvelle matière
          </UButton>
        </div>
      </template>
    </UPageHeader>

    <!-- Statistiques -->
    <div class="grid md:grid-cols-3 gap-4 mt-8">
      <UCard
        v-for="(stat, index) in stats"
        :key="index"
      >
        <template #header>
          <h3 class="text-base font-semibold">{{ stat.label }}</h3>
        </template>
        <p class="text-2xl font-bold">{{ stat.value }}</p>
      </UCard>
    </div>

    <!-- Dernières matières -->
    <UCard class="mt-6">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Dernières matières</h3>
          <div class="flex gap-2">
            <UButton
              to="/materials/new"
              color="gray"
              variant="ghost"
              icon="i-heroicons-plus"
              size="sm"
            />
            <UButton
              to="/materials"
              color="gray"
              variant="ghost"
              icon="i-heroicons-arrow-right"
              size="sm"
            >
              Voir tout
            </UButton>
          </div>
        </div>
      </template>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <UCard
          v-for="material in recentMaterials"
          :key="material.id"
          class="hover:shadow-lg transition-shadow duration-200"
          @click="navigateTo(`/materials/${material.id}`)"
        >
          <div class="relative">
            <img
              v-if="material.image"
              :src="material.image"
              :alt="material.name"
              class="w-full h-40 object-cover rounded-t-lg"
            />
            <UBadge
              :color="material.hasAnalysis ? 'green' : 'yellow'"
              variant="subtle"
              class="absolute top-2 right-2"
            >
              {{ material.hasAnalysis ? 'Analysé' : 'Non analysé' }}
            </UBadge>
          </div>

          <div class="p-4">
            <h3 class="font-semibold">{{ material.name }}</h3>
            <p class="text-sm text-gray-500 mt-1 line-clamp-2">
              {{ material.description }}
            </p>
          </div>
        </UCard>
      </div>
    </UCard>

    <!-- Dernières analyses -->
    <UCard class="mt-6">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Dernières analyses</h3>
          <div class="flex gap-2">
            <UButton
              to="/analyses/new"
              color="gray"
              variant="ghost"
              icon="i-heroicons-plus"
              size="sm"
            />
            <UButton
              to="/analyses"
              color="gray"
              variant="ghost"
              icon="i-heroicons-arrow-right"
              size="sm"
            >
              Voir tout
            </UButton>
          </div>
        </div>
      </template>

      <div v-if="analysesLoading" class="py-4">
        <USkeleton class="h-32" />
      </div>

      <div v-else-if="!recentAnalyses?.length" class="py-8 text-center text-gray-500">
        Aucune analyse récente
      </div>

      <UTable
        v-else
        :rows="recentAnalyses"
        :columns="columns"
        :ui="{
          thead: 'bg-gray-50 dark:bg-gray-800/50',
          td: {
            base: 'whitespace-nowrap py-3 px-4'
          }
        }"
      >
        <template #material-data="{ row }">
          <div class="flex items-center gap-3">
            <img
              v-if="row.material?.image"
              :src="row.material.image"
              :alt="row.material.name"
              class="w-10 h-10 rounded object-cover"
            />
            <span>{{ row.material?.name }}</span>
          </div>
        </template>

        <template #grade-data="{ row }">
          <UBadge
            :color="getGradeColor(row.difference_grade)"
            class="min-w-[60px] justify-center"
          >
            {{ row.difference_grade?.toFixed(1) }}
          </UBadge>
        </template>

        <template #date-data="{ row }">
          {{ formatDate(row.created_at) }}
        </template>

        <template #actions-data="{ row }">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-eye"
            :to="`/analyses/${row.id}`"
          />
        </template>
      </UTable>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

// Chargement des données avec gestion des erreurs
const { data: recentMaterials, pending: materialsLoading, error: materialsError } = await useFetch('/api/materials/recent', {
  default: () => [],
  onResponseError: (error) => {
    console.error('Erreur lors du chargement des matières:', error)
    useToast().add({
      title: 'Erreur',
      description: 'Impossible de charger les matières',
      color: 'red'
    })
  }
})

const { data: recentAnalyses, pending: analysesLoading, error: analysesError } = await useFetch('/api/analyses/recent', {
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

const { data: dashboardStats, pending: statsLoading, error: dashboardError } = await useFetch('/api/dashboard/stats', {
  default: () => ({
    materialsCount: 0,
    analysesCount: 0,
    averageGrade: 0
  })
})

// Stats avec gestion du chargement
const stats = computed(() => [
  {
    label: 'Matières enregistrées',
    value: statsLoading.value ? '-' : dashboardStats.value.materialsCount,
  },
  {
    label: 'Analyses effectuées',
    value: statsLoading.value ? '-' : dashboardStats.value.analysesCount,
  },
  {
    label: 'Note moyenne',
    value: statsLoading.value ? '-' : 
      Number(dashboardStats.value.averageGrade).toFixed(1),
  }
])

// Gestion des erreurs
watch([materialsError, analysesError, dashboardError], (errors) => {
  const activeErrors = errors.filter(Boolean)
  if (activeErrors.length > 0) {
    useToast().add({
      title: 'Erreur',
      description: 'Impossible de charger certaines données',
      color: 'red'
    })
  }
})

// Colonnes pour le tableau des analyses récentes
const columns = [
  {
    key: 'material',
    label: 'Matière'
  },
  {
    key: 'grade',
    label: 'Note',
    slot: 'grade'
  },
  {
    key: 'date',
    label: 'Date',
    slot: 'date'
  },
  {
    key: 'actions',
    label: '',
    sortable: false
  }
]

// Fonction pour formater la date
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// Fonction pour déterminer la couleur du badge selon la note
function getGradeColor(grade: number) {
  if (!grade) return 'gray'
  if (grade >= 8) return 'green'
  if (grade >= 5) return 'yellow'
  return 'red'
}
</script>