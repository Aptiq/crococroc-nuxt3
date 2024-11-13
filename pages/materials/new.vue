<template>
  <UContainer class="py-6">
    <UPageHeader
      title="Nouvelle matière"
      description="Ajoutez une nouvelle matière à analyser"
    >
      <template #right>
        <UButton
          to="/materials"
          color="gray"
          variant="ghost"
          icon="i-heroicons-arrow-left"
        >
          Retour aux matières
        </UButton>
      </template>
    </UPageHeader>

    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Informations de la matière -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Informations</h3>
        </template>

        <UForm
          :schema="formSchema"
          :state="formState"
          @submit="onSubmit"
          class="p-4"
        >
          <div class="space-y-6">
            <!-- Nom de la matière -->
            <UFormGroup label="Nom" name="name">
              <UInput v-model="formState.name" />
            </UFormGroup>

            <!-- Description -->
            <UFormGroup label="Description" name="description">
              <UTextarea v-model="formState.description" />
            </UFormGroup>
          </div>
        </UForm>
      </UCard>

      <!-- Capture photo -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Photo de référence</h3>
        </template>

        <div class="p-4 space-y-4">
          <!-- Guide de capture -->
          <CameraGuide v-if="!imagePreview" />
          
          <!-- Aperçu de l'image -->
          <div v-if="imagePreview" class="relative">
            <img
              :src="imagePreview"
              alt="Aperçu"
              class="w-full aspect-video object-cover rounded-lg"
            />
            <UButton
              color="gray"
              variant="solid"
              icon="i-heroicons-arrow-path"
              class="absolute top-2 right-2"
              @click="resetImage"
            >
              Reprendre
            </UButton>
          </div>

          <!-- Bouton de capture -->
          <UButton
            v-if="!imagePreview"
            block
            color="primary"
            icon="i-heroicons-camera"
            @click="captureImage"
          >
            Prendre la photo
          </UButton>

          <!-- Bouton de validation -->
          <UButton
            v-else
            block
            color="primary"
            :loading="loading"
            :disabled="!formState.name || !formState.description"
            @click="onSubmit"
          >
            Créer la matière
          </UButton>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

// État du formulaire
const formState = ref({
  name: '',
  description: '',
})

// État de l'image
const imagePreview = ref<string | null>(null)
const loading = ref(false)

// Schéma de validation
const formSchema = {
  name: 'required|min:3',
  description: 'required|min:10'
}

// Capturer une image
async function captureImage() {
  try {
    // Implémenter la capture d'image avec la caméra
    // Utiliser le composant CameraGuide pour les guides
  } catch (error) {
    console.error('Erreur lors de la capture:', error)
    useToast().add({
      title: 'Erreur',
      description: 'Impossible de capturer l\'image',
      color: 'red'
    })
  }
}

// Réinitialiser l'image
function resetImage() {
  imagePreview.value = null
}

// Soumettre le formulaire
async function onSubmit() {
  if (!imagePreview.value) {
    useToast().add({
      title: 'Erreur',
      description: 'Veuillez prendre une photo de la matière',
      color: 'red'
    })
    return
  }

  try {
    loading.value = true

    // Créer un FormData pour l'upload
    const formData = new FormData()
    formData.append('name', formState.value.name)
    formData.append('description', formState.value.description)
    formData.append('image', imagePreview.value)

    // Envoyer la requête
    await $fetch('/api/materials', {
      method: 'POST',
      body: formData
    })

    // Rediriger vers la liste des matières
    await navigateTo('/materials')

  } catch (error) {
    console.error('Erreur lors de la création:', error)
    useToast().add({
      title: 'Erreur',
      description: 'Impossible de créer la matière',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}
</script>