<template>
    <UContainer>
      <UPageHeader
        title="Analyses"
        description="Liste de toutes les analyses effectuées"
      >
        <template #right>
          <UButton
            to="/materials"
            color="gray"
            variant="ghost"
            icon="i-heroicons-arrow-left"
          >
            Retour aux matériaux
          </UButton>
        </template>
      </UPageHeader>
  
      <div v-if="pending" class="flex justify-center py-8">
        <ULoadingBar />
      </div>
  
      <template v-else>
        <!-- Statistiques globales -->
        <div class="grid md:grid-cols-3 gap-4 mb-8">
          <UStat
            label="Nombre de matériaux"
            :value="stats.materialsCount"
          />
          <UStat
            label="Nombre d'analyses"
            :value="stats.analysesCount"
          />
          <UStat
            label="Note moyenne"
            :value="stats.averageGrade"
            :color="getGradeColor(Number(stats.averageGrade))"
          />
        </div>
  
        <!-- Liste des analyses -->
        <UCard>
          <UTable
            :rows="analyses"
            :columns="columns"
            :loading="pending"
          >
            <template #date-data="{ row }">
              {{ formatDate(row.createdAt) }}
            </template>
            
            <template #grade-data="{ row }">
              <UBadge :color="getGradeColor(row.differenceGrade)">
                {{ row.differenceGrade.toFixed(1) }}
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
        </UCard>
      </template>
    </UContainer>
  </template>
  
  <script setup lang="ts">
  // Récupération des données
  const { data: stats, pending: statsPending } = await useFetch('/api/analyses')
  const { data: analyses, pending: analysesPending } = await useFetch('/api/analyses/list')
  
  const pending = computed(() => statsPending.value || analysesPending.value)
  
  // Configuration de la table
  const columns = [
    {
      key: 'date',
      label: 'Date'
    },
    {
      key: 'material',
      label: 'Matériau',
      sortable: true
    },
    {
      key: 'grade',
      label: 'Note',
      sortable: true
    },
    {
      key: 'actions',
      label: 'Actions'
    }
  ]
  
  // Fonctions utilitaires
  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }
  
  function getGradeColor(grade: number) {
    if (grade >= 4.5) return 'green'
    if (grade >= 3.5) return 'yellow'
    if (grade >= 2.5) return 'orange'
    return 'red'
  }
  </script>