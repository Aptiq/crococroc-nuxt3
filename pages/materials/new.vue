<template>
  <UContainer class="py-6">
    <!-- En-tête -->
    <UCard class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold">Nouvelle matière</h1>
          <p class="text-gray-600">Ajoutez une nouvelle matière à analyser</p>
        </div>
        <UButton
          to="/materials"
          color="gray"
          variant="ghost"
          icon="i-heroicons-arrow-left"
        >
          Retour aux matières
        </UButton>
      </div>
    </UCard>

    <!-- Contenu -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Capture photo -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Photo de référence</h3>
        </template>

        <div class="p-4 space-y-4">
          <!-- Prévisualisation vidéo -->
          <div v-if="isCameraActive && !imagePreview" class="relative">
            <video
              v-if="stream"
              ref="videoRef"
              :srcObject="stream"
              autoplay
              playsinline
              class="w-full aspect-video object-cover rounded-lg"
            />
            
            <!-- Guide de capture -->
            <CameraGuide 
              :message="isMobile ? 
                'Utilisez la caméra arrière de votre téléphone' : 
                'Utilisez votre webcam pour prendre la photo'"
            />

            <!-- Message d'erreur caméra -->
            <UAlert
              v-if="cameraError"
              color="red"
              title="Erreur de caméra"
              :description="cameraError"
              class="mt-4"
            />

            <!-- Bouton de capture -->
            <UButton
              v-if="stream"
              block
              color="primary"
              icon="i-heroicons-camera"
              :loading="isCapturing"
              class="mt-4"
              @click="handleCapture"
            >
              {{ isCapturing ? 'Capture en cours...' : 'Prendre la photo' }}
            </UButton>
          </div>

          <!-- Aperçu de l'image -->
          <div v-else-if="imagePreview" class="relative">
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
              @click="resetCapture"
            >
              Reprendre
            </UButton>
          </div>

          <!-- Bouton pour démarrer la caméra -->
          <UButton
            v-else
            block
            color="primary"
            icon="i-heroicons-camera"
            @click="startCamera"
          >
            Prendre une photo
          </UButton>
        </div>
      </UCard>

      <!-- Informations de la matière -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Informations</h3>
        </template>

        <div class="p-4 space-y-6">
          <!-- Nom de la matière -->
          <UFormGroup label="Nom de la matière">
            <UInput
              v-model="formState.name"
              placeholder="Ex: Coton 100%"
            />
          </UFormGroup>

          <!-- Description -->
          <UFormGroup label="Description">
            <UTextarea
              v-model="formState.description"
              placeholder="Description détaillée de la matière..."
            />
          </UFormGroup>
        </div>
      </UCard>
    </div>

    <!-- Bouton d'enregistrement -->
    <div class="mt-6 flex justify-end">
      <UButton
        color="primary"
        :loading="isSaving"
        :disabled="!canSave"
        @click="saveMaterial"
      >
        {{ isSaving ? 'Enregistrement...' : 'Enregistrer la matière' }}
      </UButton>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const toast = useToast()
const { stream, error: cameraError, isMobile, startCamera: initCamera, takePhoto } = useCamera()
const videoRef = ref<HTMLVideoElement | null>(null)
const imagePreview = ref<string | null>(null)
const isCapturing = ref(false)
const isSaving = ref(false)
const isCameraActive = ref(false)

// État du formulaire
const formState = ref({
  name: '',
  description: '',
})

// Vérifier si on peut sauvegarder
const canSave = computed(() => {
  return imagePreview.value && formState.value.name.trim() !== ''
})

// Démarrer la caméra
async function startCamera() {
  try {
    isCameraActive.value = true
    await initCamera()
  } catch (error) {
    useToast().add({
      title: 'Erreur',
      description: "Impossible d'accéder à la caméra",
      color: 'red'
    })
  }
}

// Nettoyer la caméra quand on quitte
onBeforeUnmount(() => {
  stream.value?.getTracks().forEach(track => track.stop())
})

// Gérer la capture
async function handleCapture() {
  if (!stream.value) {
    useToast().add({
      title: 'Erreur',
      description: 'La caméra n\'est pas active',
      color: 'red'
    })
    return
  }

  try {
    isCapturing.value = true
    const blob = await takePhoto()
    if (blob) {
      imagePreview.value = URL.createObjectURL(blob)
      isCameraActive.value = false // Désactiver la caméra après capture
    } else {
      throw new Error('Échec de la capture')
    }
  } catch (error) {
    useToast().add({
      title: 'Erreur',
      description: 'Impossible de capturer l\'image',
      color: 'red'
    })
  } finally {
    isCapturing.value = false
  }
}

// Réinitialiser la capture
async function resetCapture() {
  imagePreview.value = null
  isCameraActive.value = true
  if (!stream.value) {
    await initCamera()
  }
}

// Sauvegarder la matière
async function saveMaterial() {
  if (!imagePreview.value) {
    toast.add({
      id: 'error-photo',
      title: 'Erreur',
      description: 'Veuillez prendre une photo',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
    return
  }

  try {
    isSaving.value = true

    // Créer un FormData
    const formData = new FormData()
    formData.append('name', formState.value.name)
    formData.append('description', formState.value.description || '')

    // Convertir l'image base64 en blob
    const base64Response = await fetch(imagePreview.value)
    const blob = await base64Response.blob()
    formData.append('image', blob, 'image.jpg')

    // Envoyer la requête
    const response = await $fetch<{ error?: string, success?: boolean }>('/api/materials', {
      method: 'POST',
      body: formData
    })

    if (response.error) {
      toast.add({
        id: 'error-create',
        title: 'Erreur',
        description: response.error,
        color: 'red',
        icon: 'i-heroicons-exclamation-circle',
        timeout: 5000
      })
      return
    }

    toast.add({
      id: 'success-create',
      title: 'Succès',
      description: 'Matière créée avec succès',
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })

    await navigateTo('/materials')

  } catch (error: any) {
    console.error('Save error:', error)
    toast.add({
      id: 'error-unknown',
      title: 'Erreur',
      description: error.data?.message || 'Une erreur est survenue lors de la création',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  } finally {
    isSaving.value = false
  }
}
</script>