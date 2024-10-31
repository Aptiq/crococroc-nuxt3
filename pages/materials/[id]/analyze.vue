<template>
  <UContainer>
    <UPageHeader
      title="Nouvelle analyse"
      :description="material?.name"
    >
      <template #right>
        <UButton
          :to="`/materials/${id}`"
          color="gray"
          variant="ghost"
          icon="i-heroicons-arrow-left"
        >
          Retour
        </UButton>
      </template>
    </UPageHeader>

    <div v-if="pending" class="flex justify-center py-8">
      <ULoadingBar />
    </div>

    <template v-else-if="material">
      <!-- Image originale -->
      <UCard class="mt-8">
        <template #header>
          <h3 class="text-xl font-semibold">État initial de référence</h3>
        </template>

        <img 
          :src="material.image"
          class="max-w-md mx-auto rounded-lg"
          :alt="material.name"
        />

        <template #footer>
          <p class="text-sm text-gray-500">
            Photo prise le {{ formatDate(material.created_at) }}
          </p>
        </template>
      </UCard>

      <!-- Nouvelle photo pour analyse -->
      <UCard class="mt-8">
        <template #header>
          <h3 class="text-xl font-semibold">Nouvelle photo pour analyse</h3>
        </template>

        <div class="space-y-4">
          <UCameraCapture
            v-if="!testImage"
            v-model="testImage"
            :options="{ facingMode: 'environment' }"
          />

          <div v-else>
            <img 
              :src="testImage"
              class="max-w-md mx-auto rounded-lg"
              alt="Photo pour analyse"
            />
            <div class="mt-4 flex justify-center gap-4">
              <UButton
                color="gray"
                @click="testImage = null"
              >
                Reprendre la photo
              </UButton>
              <UButton
                color="primary"
                :loading="analyzing"
                @click="analyzeImages"
              >
                Lancer l'analyse
              </UButton>
            </div>
          </div>
        </div>
      </UCard>
    </template>

    <UCard v-else class="mt-8 p-12">
      <div class="text-center">
        <UIcon 
          name="i-heroicons-exclamation-triangle" 
          class="w-12 h-12 text-gray-400 mx-auto"
        />
        <h3 class="mt-2 text-sm font-semibold text-gray-900">
          Matière non trouvée
        </h3>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { id } = route.params

// États
const testImage = ref<string | null>(null)
const analyzing = ref(false)

// Charger les données de la matière
const { data: material, pending } = await useFetch(`/api/materials/${id}`)

// Formater la date
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

// Lancer l'analyse
async function analyzeImages() {
  if (!testImage.value) return

  analyzing.value = true
  try {
    // Convertir l'image base64 en blob
    const response = await fetch(testImage.value)
    const blob = await response.blob()

    // Préparer les données pour l'envoi
    const formData = new FormData()
    formData.append('testImage', blob, 'test-image.jpg')

    // Envoyer à l'API
    const result = await $fetch(`/api/materials/${id}/analyze`, {
      method: 'POST',
      body: formData
    })

    // Rediriger vers la page des résultats
    router.push(`/analyses/${result.id}`)
  } catch (error) {
    useToast().add({
      title: 'Erreur',
      description: "Une erreur s'est produite lors de l'analyse",
      color: 'red'
    })
  } finally {
    analyzing.value = false
  }
}
</script>