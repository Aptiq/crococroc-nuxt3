<template>
  <UContainer class="pb-20 md:pb-0">
    <!-- En-tête avec boutons d'action -->
    <UPageHeader
      title="Tableau de bord"
      description="Bienvenue sur CrocoCroc"
    >
      <template #right>
        <div class="flex gap-2">
          <UButton
            to="/analyze"
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
      <UCard class="bg-gray-800 text-gray-100">
        <template #header>
          <h3 class="text-lg font-semibold">Matières enregistrées</h3>
        </template>
        <p class="text-3xl font-bold">
          {{ dashboardStats.materialsCount }}
        </p>
      </UCard>

      <UCard class="bg-gray-800 text-gray-100">
        <template #header>
          <h3 class="text-lg font-semibold">Analyses effectuées</h3>
        </template>
        <p class="text-3xl font-bold">
          {{ dashboardStats.analysesCount }}
        </p>
      </UCard>

      <UCard class="bg-gray-800 text-gray-100">
        <template #header>
          <h3 class="text-lg font-semibold">Note moyenne</h3>
        </template>
        <p class="text-3xl font-bold">
          {{ dashboardStats.averageGrade }}
        </p>
      </UCard>
    </div>

    <!-- Dernières matières avec recherche -->
    <UCard class="mt-8 bg-gray-800 text-gray-100">
      <template #header>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Dernières matières</h2>
          <div class="flex gap-2">
            <UButton
              to="/materials"
              color="gray"
              variant="ghost"
              icon="i-heroicons-arrow-right"
            >
              Voir tout
            </UButton>
          </div>
        </div>
        <!-- Barre de recherche -->
        <UInput
          v-model="materialSearch"
          icon="i-heroicons-magnifying-glass"
          placeholder="Rechercher une matière..."
          class="w-full"
          @input="searchMaterials"
        />
      </template>

      <div v-if="filteredMaterials.length > 0">
        <!-- Vue mobile (1 visible + 4 à swiper) -->
        <div class="md:hidden">
          <Swiper
            :modules="[Pagination]"
            :slides-per-view="1"
            :space-between="16"
            :navigation="false"
            :pagination="{ 
              clickable: true,
              dynamicBullets: true 
            }"
            class="w-full"
          >
            <SwiperSlide 
              v-for="material in filteredMaterials.slice(0, 5)" 
              :key="material.id"
              class="pb-8"
            >
              <UCard
                class="h-full transition-colors duration-300 hover:bg-gray-700"
                :ui="{ 
                  base: 'bg-gray-800 text-gray-100',
                  body: { 
                    padding: 'p-0',
                    base: 'relative overflow-hidden' 
                  }
                }"
                @click="goToAnalyze(material)"
              >
                <img
                  v-if="material.image"
                  :src="material.image"
                  :alt="material.name"
                  class="w-full h-48 object-cover"
                />
                <div class="p-4">
                  <h3 class="font-semibold text-lg text-gray-100">{{ material.name }}</h3>
                  <p class="text-sm text-gray-400 line-clamp-2 mt-1">
                    {{ material.description }}
                  </p>
                </div>
              </UCard>
            </SwiperSlide>
          </Swiper>
        </div>

        <!-- Vue desktop (3 visibles + navigation) -->
        <div class="hidden md:block">
          <Swiper
            :modules="[Pagination]"
            :slides-per-view="3"
            :space-between="16"
            :navigation="false"
            :pagination="{ 
              clickable: true,
              dynamicBullets: true 
            }"
            class="w-full"
          >
            <SwiperSlide 
              v-for="material in filteredMaterials.slice(0, 6)" 
              :key="material.id"
            >
              <UCard
                class="h-full transform transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                :ui="{ 
                  body: { 
                    padding: 'p-0',
                    base: 'relative overflow-hidden' 
                  }
                }"
                @click="goToAnalyze(material)"
              >
                <img
                  v-if="material.image"
                  :src="material.image"
                  :alt="material.name"
                  class="w-full h-48 object-cover"
                />
                <div class="p-4">
                  <h3 class="font-semibold text-lg">{{ material.name }}</h3>
                  <p class="text-sm text-gray-500 line-clamp-2 mt-1">
                    {{ material.description }}
                  </p>
                </div>
              </UCard>
            </SwiperSlide>
          </Swiper>
        </div>
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

    <!-- Section des analyses récentes -->
    <div class="mt-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-100">Analyses récentes</h2>
        <UInput
          v-model="analysisSearch"
          icon="i-heroicons-magnifying-glass"
          placeholder="Rechercher une analyse..."
          class="max-w-xs"
          color="white"
          variant="outline"
        />
      </div>

      <UCard
        class="bg-gray-800 border-0"
        :ui="{
          body: {
            padding: 'p-0'
          }
        }"
      >
        <div v-if="filteredAnalyses.length > 0">
          <UTable
            :rows="filteredAnalyses.slice(0, 5)"
            :columns="columns"
            :ui="{
              wrapper: 'bg-transparent',
              base: 'min-w-full divide-y divide-gray-700',
              thead: 'bg-gray-800',
              th: {
                base: 'text-left text-sm font-semibold text-gray-400 py-3.5 px-4',
                padding: ''
              },
              td: {
                base: 'whitespace-nowrap py-4 px-4 text-sm text-gray-100',
                padding: ''
              },
              tr: 'hover:bg-gray-700/50 transition-colors'
            }"
          >
            <template #date-data="{ row }">
              <div class="text-gray-400">
                {{ formatDate(row.created_at) }}
              </div>
            </template>

            <template #material-data="{ row }">
              <div class="flex items-center gap-3">
                <UAvatar
                  v-if="row.material?.image"
                  :src="row.material.image"
                  :alt="row.material?.name"
                  size="sm"
                />
                <div>
                  <div class="font-medium">{{ row.material?.name }}</div>
                  <div class="text-sm text-gray-400 line-clamp-1">
                    {{ row.material?.description }}
                  </div>
                </div>
              </div>
            </template>

            <template #grade-data="{ row }">
              <UBadge 
                :color="getGradeColor(row.difference_grade)"
                variant="subtle"
                size="sm"
                class="min-w-[4rem] justify-center"
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
                size="sm"
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
            <h3 class="mt-2 text-sm font-semibold text-gray-100">
              Aucune analyse
            </h3>
            <p class="mt-1 text-sm text-gray-400">
              Commencez par analyser une matière.
            </p>
          </div>
        </template>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'

// Import des styles Swiper
import 'swiper/css'
import 'swiper/css/pagination'

definePageMeta({
  layout: 'default'
})

// Types
interface DashboardStats {
  materialsCount: number
  analysesCount: number
  averageGrade: string
}

// État initial
const dashboardStats = ref<DashboardStats>({
  materialsCount: 0,
  analysesCount: 0,
  averageGrade: '-'
})

const recentMaterials = ref<Material[]>([])
const recentAnalyses = ref<Analysis[]>([])
const filteredMaterials = ref<Material[]>([])
const filteredAnalyses = ref<Analysis[]>([])

// Configuration du tableau
const columns = [
  {
    key: 'date',
    label: 'Date',
    sortable: true
  },
  {
    key: 'material',
    label: 'Matière',
    sortable: true
  },
  {
    key: 'grade',
    label: 'Note',
    sortable: true,
    class: 'text-center'
  },
  {
    key: 'actions',
    label: '',
    sortable: false,
    class: 'w-24'
  }
]

// État pour la recherche
const materialSearch = ref('')
const analysisSearch = ref('')

// Configuration du Swiper
const swiperModules = [Pagination]

// Fonction de recherche pour les matières
function searchMaterials() {
  const search = materialSearch.value.toLowerCase()
  filteredMaterials.value = recentMaterials.value.filter(material => 
    material.name.toLowerCase().includes(search) ||
    material.description?.toLowerCase().includes(search)
  )
}

// Fonction de recherche pour les analyses
function searchAnalyses() {
  const search = analysisSearch.value.toLowerCase()
  filteredAnalyses.value = recentAnalyses.value.filter(analysis => 
    analysis.material?.name.toLowerCase().includes(search) ||
    analysis.material?.description?.toLowerCase().includes(search)
  )
}

// Navigation vers l'analyse
function goToAnalyze(material) {
  navigateTo(`/analyze?material=${material.id}`)
}

// Chargement des données
onMounted(async () => {
  try {
    const [materials, analyses] = await Promise.all([
      $fetch('/api/materials'),
      $fetch('/api/analyses')
    ])
    
    recentMaterials.value = materials
    recentAnalyses.value = analyses
    filteredMaterials.value = materials
    filteredAnalyses.value = analyses
    
    // Mise à jour des stats
    dashboardStats.value = {
      materialsCount: materials.length,
      analysesCount: analyses.length,
      averageGrade: calculateAverageGrade(analyses)
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
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

// Modification de la fonction getGradeColor pour la nouvelle logique
function getGradeColor(grade: number | undefined) {
  if (!grade) return 'gray'
  if (grade <= 1) return 'green'     // Excellent (très similaire)
  if (grade <= 2) return 'lime'      // Bon
  if (grade <= 3) return 'yellow'    // Moyen
  if (grade <= 4) return 'orange'    // Mauvais
  return 'red'                       // Très mauvais
}

// Gestion du cycle de vie
onMounted(() => {
  // Initialisation des données
  if (!materialSearch.value) {
    filteredMaterials.value = recentMaterials.value
  }
  if (!analysisSearch.value) {
    filteredAnalyses.value = recentAnalyses.value
  }
})

onBeforeUnmount(() => {
  // Nettoyage des références
  filteredMaterials.value = []
  filteredAnalyses.value = []
})

// Remplacer le watch par un watchEffect
watchEffect(() => {
  if (!materialSearch.value) {
    filteredMaterials.value = recentMaterials.value
  }
  if (!analysisSearch.value) {
    filteredAnalyses.value = recentAnalyses.value
  }
})
</script>

<style>
.swiper-button-next,
.swiper-button-prev {
  color: var(--primary-500);
}

.swiper-pagination-bullet-active {
  background: var(--primary-500) !important;
}

/* Ajustements pour le swiper */
.swiper {
  padding: 0 1rem;
}

@media (min-width: 768px) {
  .swiper {
    padding: 0 2rem;
  }
}
</style>