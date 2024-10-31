<template>
  <UContainer>
    <UPageHeader
      title="Tableau de bord"
      description="Bienvenue sur CrocoCroc"
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

    <!-- Statistiques -->
    <div class="grid md:grid-cols-3 gap-4 mt-8">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Matières enregistrées</h3>
        </template>
        <p class="text-3xl font-bold">
          {{ dashboardStats.materialsCount }}
        </p>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Analyses effectuées</h3>
        </template>
        <p class="text-3xl font-bold">
          {{ dashboardStats.analysesCount }}
        </p>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Note moyenne</h3>
        </template>
        <p class="text-3xl font-bold">
          {{ dashboardStats.averageGrade }}
        </p>
      </UCard>
    </div>

    <!-- Dernières matières -->
    <UCard class="mt-8">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">Dernières matières</h2>
          <UButton
            to="/materials"
            color="gray"
            variant="ghost"
            icon="i-heroicons-arrow-right"
          >
            Voir tout
          </UButton>
        </div>
      </template>

      <div v-if="recentMaterials.length > 0" class="grid md:grid-cols-3 gap-4">
        <UCard
          v-for="material in recentMaterials"
          :key="material.id"
          class="hover:shadow-lg transition-shadow"
          :to="`/materials/${material.id}`"
        >
          <img
            v-if="material.image"
            :src="material.image"
            :alt="material.name"
            class="w-full h-48 object-cover rounded-t-lg"
          />
          <template #footer>
            <div class="space-y-1">
              <h3 class="font-semibold">{{ material.name }}</h3>
              <p class="text-sm text-gray-500">
                {{ formatDate(material.created_at) }}
              </p>
            </div>
          </template>
        </UCard>
      </div>

      <template v-else>
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
      </template>
    </UCard>

    <!-- Dernières analyses -->
    <UCard class="mt-8">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">Analyses récentes</h2>
        </div>
      </template>

      <div v-if="recentAnalyses.length > 0">
        <UTable
          :rows="recentAnalyses"
          :columns="columns"
        >
          <template #date-data="{ row }">
            {{ formatDate(row.created_at) }}
          </template>

          <template #grade-data="{ row }">
            <UBadge 
              :color="getGradeColor(row.difference_grade)"
              variant="subtle"
            >
              {{ formatGrade(row.difference_grade) }}
            </UBadge>
          </template>

          <template #actions-data="{ row }">
            <UButton
              :to="`/analyses/${row.id}`"
              color="gray"
              variant="ghost"
              icon="i-heroicons-eye"
            >
              Voir
            </UButton>
          </template>
        </UTable>
      </div>

      <template v-else>
        <div class="text-center py-12">
          <UIcon
            name="i-heroicons-document-magnifying-glass"
            class="mx-auto h-12 w-12 text-gray-400"
          />
          <h3 class="mt-2 text-sm font-semibold text-gray-900">
            Aucune analyse
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Les analyses effectuées apparaîtront ici.
          </p>
        </div>
      </template>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
// Types
interface DashboardStats {
  materialsCount: number
  analysesCount: number
  averageGrade: string
}

// Valeurs par défaut
const defaultStats: DashboardStats = {
  materialsCount: 0,
  analysesCount: 0,
  averageGrade: '-'
}

// État et données
const dashboardStats = ref<DashboardStats>(defaultStats)
const recentMaterials = ref([])
const recentAnalyses = ref([])

// Configuration du tableau
const columns = [
  {
    key: 'date',
    label: 'Date'
  },
  {
    key: 'material',
    label: 'Matière'
  },
  {
    key: 'grade',
    label: 'Note'
  },
  {
    key: 'actions',
    label: 'Actions'
  }
]

// Chargement des données
onMounted(async () => {
  try {
    const stats = await $fetch('/api/stats')
    dashboardStats.value = stats || defaultStats
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  }

  try {
    const materials = await $fetch('/api/materials')
    recentMaterials.value = materials?.slice(0, 3) || []
  } catch (error) {
    console.error('Erreur lors du chargement des matières:', error)
  }

  try {
    const analyses = await $fetch('/api/analyses')
    recentAnalyses.value = analyses || []
  } catch (error) {
    console.error('Erreur lors du chargement des analyses:', error)
  }
})

// Utilitaires
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

function formatGrade(grade: number) {
  return grade?.toFixed(1) || '-'
}

function getGradeColor(grade: number | undefined) {
  if (!grade) return 'gray'
  if (grade >= 4.5) return 'green'
  if (grade >= 3.5) return 'yellow'
  if (grade >= 2.5) return 'orange'
  return 'red'
}
</script>