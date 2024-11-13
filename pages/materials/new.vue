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

      <!-- Carte de capture photo -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Photo de référence</h3>
        </template>

        <div class="p-4 space-y-4">
          <!-- Prévisualisation vidéo -->
          <div v-if="!imagePreview" class="relative">
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
          </div>

          <!-- Aperçu de l'image -->
          <div v-else class="relative">
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

          <!-- Bouton de capture -->
          <UButton
            v-if="!imagePreview"
            block
            color="primary"
            icon="i-heroicons-camera"
            :loading="isCapturing"
            :disabled="!stream || isCapturing"
            @click="handleCapture"
          >
            {{ isCapturing ? 'Capture en cours...' : 'Prendre la photo' }}
          </UButton>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { stream, error: cameraError, isMobile, startCamera, takePhoto } = useCamera()
const videoRef = ref<HTMLVideoElement | null>(null)
const imagePreview = ref<string | null>(null)
const isCapturing = ref(false)

// État du formulaire
const formState = ref({
  name: '',
  description: '',
})

// Schéma de validation
const formSchema = {
  name: 'required|min:3',
  description: 'required|min:10'
}

// Démarrer la caméra au montage du composant
onMounted(async () => {
  try {
    await startCamera()
  } catch (error) {
    useToast().add({
      title: 'Erreur',
      description: "Impossible d'accéder à la caméra",
      color: 'red'
    })
  }
})

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
  if (!stream.value) {
    await startCamera()
  }
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
  }
}
</script>