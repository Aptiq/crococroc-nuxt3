<template>
  <UTable
    :rows="analyses"
    :columns="columns"
    :loading="loading"
    :empty-state="{
      icon: 'i-heroicons-document-magnifying-glass',
      title: 'Aucune analyse',
      description: 'Commencez par analyser une matière'
    }"
  >
    <template #material-data="{ row }">
      <div class="flex items-center gap-3">
        <UAvatar
          :src="row.material.image"
          :alt="row.material.name"
          size="sm"
        />
        <div>
          <div class="font-medium">{{ row.material.name }}</div>
          <div class="text-xs text-gray-500">
            {{ formatDate(row.created_at) }}
          </div>
        </div>
      </div>
    </template>

    <template #grade-data="{ row }">
      <UBadge
        :color="getGradeColor(row.difference_grade)"
        size="lg"
        class="min-w-[3rem] justify-center"
      >
        {{ row.difference_grade.toFixed(1) }}
      </UBadge>
    </template>
  </UTable>
</template> 