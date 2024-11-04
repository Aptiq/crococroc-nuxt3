<template>
  <UContainer>
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
          Retour
        </UButton>
      </template>
    </UPageHeader>

    <UCard class="mt-8">
      <form @submit.prevent="handleSubmit">
        <UFormGroup
          label="Nom de la matière"
          name="name"
        >
          <UInput
            v-model="form.name"
            placeholder="Ex: Bracelet cuir marron"
            required
          />
        </UFormGroup>

        <UFormGroup
          label="Description"
          name="description"
        >
          <UTextarea
            v-model="form.description"
            placeholder="Ajoutez des détails sur la matière..."
          />
        </UFormGroup>

        <UFormGroup
          label="Photo"
          name="image"
        >
          <CameraCapture
            v-model="form.image"
            @photo-taken="handlePhotoTaken"
          />
        </UFormGroup>

        <div class="mt-4 flex justify-end gap-2">
          <UButton
            to="/materials"
            color="gray"
          >
            Annuler
          </UButton>
          <UButton
            type="submit"
            color="primary"
            :loading="pending"
          >
            Enregistrer
          </UButton>
        </div>
      </form>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
const materialsStore = useMaterialsStore()
const router = useRouter()

const form = ref({
  name: '',
  description: '',
  image: null as string | null
})

const pending = ref(false)

function handlePhotoTaken(photoData: string) {
  console.log('Photo taken, length:', photoData?.length)
  form.value.image = photoData
}

async function handleSubmit() {
  try {
    console.log('Submit clicked, form values:', {
      name: form.value.name,
      descriptionLength: form.value.description?.length,
      hasImage: !!form.value.image
    })

    pending.value = true

    if (!form.value.name?.trim()) {
      useToast().add({
        title: 'Erreur',
        description: 'Le nom est requis',
        color: 'red'
      })
      return
    }

    if (!form.value.image) {
      useToast().add({
        title: 'Erreur',
        description: 'Veuillez prendre une photo',
        color: 'red'
      })
      return
    }

    const materialData = {
      name: form.value.name.trim(),
      description: form.value.description?.trim() || '',
      image: form.value.image
    }

    console.log('Sending material data:', {
      name: materialData.name,
      descriptionLength: materialData.description.length,
      imageLength: materialData.image.length
    })

    // Créer la matière
    const result = await materialsStore.createMaterial(materialData)
    console.log('Material created:', result)

    // Rafraîchir la liste des matières
    await materialsStore.fetchMaterials()

    useToast().add({
      title: 'Succès',
      description: 'Matière enregistrée avec succès',
      color: 'green'
    })

    // Rediriger vers la liste des matières
    await navigateTo('/materials')
  } catch (error: any) {
    console.error('Submission error:', error)
    useToast().add({
      title: 'Erreur',
      description: error.message || 'Erreur lors de la création de la matière',
      color: 'red'
    })
  } finally {
    pending.value = false
  }
}
</script>