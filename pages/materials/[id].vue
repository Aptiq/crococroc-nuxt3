<template>
  <UContainer>
    <UPageHeader
      :title="material?.name || 'Détail de la matière'"
    >
      <template #right>
        <div class="flex gap-2">
          <UButton
            color="gray"
            variant="soft"
            icon="i-heroicons-pencil"
            :to="`/materials/${material?.id}/edit`"
          >
            Modifier
          </UButton>
          
          <UButton
            color="primary"
            icon="i-heroicons-camera"
            :to="`/analyze?material=${material?.id}`"
          >
            Nouvelle analyse
          </UButton>
        </div>
      </template>
    </UPageHeader>

    <div class="mt-8 grid md:grid-cols-3 gap-6">
      <!-- Informations principales -->
      <UCard class="md:col-span-2">
        <template #header>
          <h3 class="text-base font-semibold">Informations</h3>
        </template>

        <div class="space-y-6">
          <img
            v-if="material?.image"
            :src="material.image"
            :alt="material.name"
            class="w-full h-64 object-cover rounded-lg"
          />

          <div class="prose dark:prose-invert max-w-none">
            <p>{{ material?.description }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                Date de création
              </div>
              <div>{{ formatDate(material?.created_at) }}</div>
            </div>
            
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                Dernière modification
              </div>
              <div>{{ formatDate(material?.updated_at) }}</div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Statistiques -->
      <UCard>
        <template #header>
          <h3 class="text-base font-semibold">Statistiques</h3>
        </template>

        <div class="space-y-4">
          <div v-for="stat in stats" :key="stat.label">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ stat.label }}
            </div>
            <div class="text-2xl font-semibold">
              {{ stat.value }}
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Historique des analyses -->
    <UCard class="mt-6">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold">Historique des analyses</h3>
          <UInput
            v-model="searchAnalyses"
            icon="i-heroicons-magnifying-glass"
            placeholder="Rechercher..."
            class="max-w-xs"
          />
        </div>
      </template>

      <UTable
        :rows="filteredAnalyses"
        :columns="columns"
        :ui="{
          thead: 'bg-gray-50 dark:bg-gray-800/50',
          td: {
            base: 'whitespace-nowrap py-3 px-4'
          },
          tr: 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }"
      >
        <!-- Templates personnalisés pour chaque colonne -->
      </UTable>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
// ... logique existante ...
</script> 