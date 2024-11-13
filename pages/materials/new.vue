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

            <!-- Bouton pour activer la caméra -->
            <UButton
              v-if="!isCameraActive && !imagePreview && isFormValid"
              block
              color="primary"
              icon="i-heroicons-camera"
              @click="startCamera"
            >
              Prendre une photo
            </UButton>
          </div>
        </UForm>
      </UCard>

      <!-- Carte de capture photo -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Photo de référence</h3>
        </template>

        <div class="p-4 space-y-4">
          <!-- Message si formulaire incomplet -->
          <UAlert
            v-if="!isFormValid && !imagePreview"
            color="yellow"
            title="Information requise"
            description="Veuillez d'abord remplir le nom et la description de la matière"
          />

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
              @click="resetCapture"
            >
              Reprendre
            </UButton>
          </div>
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

// Schéma de validation
const formSchema = {
  name: 'required|min:3',
  description: 'required|min:10'
}

// Vérifier si le formulaire est valide
const isFormValid = computed(() => {
  return formState.value.name.length >= 3 && 
         formState.value.description.length >= 10
})

// Vérifier si on peut sauvegarder
const canSave = computed(() => {
  return isFormValid.value && imagePreview.value
})

// Démarrer la caméra
async function startCamera() {
  if (!isFormValid.value) {
    useToast().add({
      title: 'Erreur',
      description: 'Veuillez d\'abord remplir le formulaire',
      color: 'red'
    })
    return
  }

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
  if (!canSave.value) {
    useToast().add({
      title: 'Erreur',
      description: 'Veuillez remplir tous les champs et prendre une photo',
      color: 'red'
    })
    return
  }

  try {
    isSaving.value = true

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

    useToast().add({
      title: 'Succès',
      description: 'Matière créée avec succès',
      color: 'green'
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
    isSaving.value = false
  }
}
</script>