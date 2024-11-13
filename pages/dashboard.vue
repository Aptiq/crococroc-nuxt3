<template>
  <div class="py-6">
    <div class="container mx-auto px-4">
      <!-- En-tête avec boutons -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 class="text-2xl font-bold">Tableau de bord</h1>
          <p class="text-gray-600">Bienvenue sur CrocoCroc</p>
        </div>
        <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <UButton
            to="/analyses/new"
            color="primary"
            icon="i-heroicons-plus"
            class="w-full sm:w-auto"
          >
            Nouvelle analyse
          </UButton>
          <UButton
            to="/materials/new"
            color="gray"
            variant="ghost"
            icon="i-heroicons-plus"
            class="w-full sm:w-auto"
          >
            Nouvelle matière
          </UButton>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="grid gap-4 mb-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        <UCard class="col-span-1">
          <div class="flex items-start gap-4">
            <div class="p-2 bg-primary-50 dark:bg-primary-950 rounded-lg">
              <UIcon name="i-heroicons-square-3-stack-3d" class="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <div class="text-sm text-gray-500">Matières</div>
              <div class="text-xl sm:text-2xl font-semibold">{{ stats?.materialsCount || 0 }}</div>
            </div>
          </div>
        </UCard>

        <UCard class="col-span-1">
          <div class="flex items-start gap-4">
            <div class="p-2 bg-primary-50 dark:bg-primary-950 rounded-lg">
              <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <div class="text-sm text-gray-500">Analyses</div>
              <div class="text-xl sm:text-2xl font-semibold">{{ stats?.analysesCount || 0 }}</div>
            </div>
          </div>
        </UCard>

        <UCard class="col-span-1">
          <div class="flex items-start gap-4">
            <div class="p-2 bg-primary-50 dark:bg-primary-950 rounded-lg">
              <UIcon name="i-heroicons-clock" class="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <div class="text-sm text-gray-500">Ce mois</div>
              <div class="text-xl sm:text-2xl font-semibold">{{ stats?.analysesThisMonth || 0 }}</div>
            </div>
          </div>
        </UCard>

        <UCard class="col-span-1">
          <div class="flex items-start gap-4">
            <div class="p-2 bg-primary-50 dark:bg-primary-950 rounded-lg">
              <UIcon name="i-heroicons-star" class="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <div class="text-sm text-gray-500">Note moyenne</div>
              <div class="text-xl sm:text-2xl font-semibold">{{ (stats?.averageGrade || 0).toFixed(1) }}/5</div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Dernières analyses -->
      <UCard class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Dernières analyses</h3>
            <div class="flex gap-2">
              <UButton
                to="/analyses/new"
                color="primary"
                variant="ghost"
                icon="i-heroicons-plus"
                size="sm"
                class="hidden sm:flex"
              >
                Nouvelle
              </UButton>
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

        <div class="overflow-x-auto">
          <UTable
            :rows="recentAnalyses || []"
            :columns="[
              {
                key: 'material',
                label: 'Matière'
              },
              {
                key: 'grade',
                label: 'Note'
              },
              {
                key: 'date',
                label: 'Date',
                class: 'hidden sm:table-cell'
              }
            ]"
          >
            <template #material-data="{ row }">
              <div class="flex items-center gap-3">
                <img
                  :src="row.material.image"
                  :alt="row.material.name"
                  class="w-10 h-10 rounded object-cover"
                />
                <span class="font-medium line-clamp-1">{{ row.material.name }}</span>
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

            <template #date-data="{ row }">
              {{ formatDate(row.created_at) }}
            </template>
          </UTable>
        </div>
      </UCard>

      <!-- Dernières matières -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Dernières matières</h3>
            <div class="flex gap-2">
              <UButton
                to="/materials/new"
                color="primary"
                variant="ghost"
                icon="i-heroicons-plus"
                size="sm"
                class="hidden sm:flex"
              >
                Nouvelle
              </UButton>
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

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <UCard
            v-for="material in recentMaterials"
            :key="material.id"
            class="hover:shadow-lg transition-shadow"
          >
            <div class="aspect-w-16 aspect-h-9 mb-4">
              <img
                :src="material.image"
                :alt="material.name"
                class="object-cover rounded-lg w-full h-full"
              />
            </div>
            <h4 class="font-medium line-clamp-1">{{ material.name }}</h4>
            <p class="text-sm text-gray-500 line-clamp-2">{{ material.description }}</p>
          </UCard>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
// Récupérer les statistiques
const { data: stats } = await useFetch('/api/dashboard/stats')

// Récupérer les analyses récentes
const { data: recentAnalyses } = await useFetch('/api/analyses/recent')
console.log('Recent analyses:', recentAnalyses.value)

// Récupérer les matières récentes
const { data: recentMaterials } = await useFetch('/api/materials/recent')

// Fonction pour formater la date
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
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