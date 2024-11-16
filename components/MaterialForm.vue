<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <UFormGroup
      label="Photo de référence"
      required
    >
      <UCameraCapture
        v-model="form.image"
        :options="{ facingMode: 'environment' }"
        class="max-w-md mx-auto"
      >
        <template #placeholder>
          <div class="text-center p-8">
            <UIcon
              name="i-heroicons-camera"
              class="w-12 h-12 mx-auto text-gray-400"
            />
            <p class="mt-2 text-sm text-gray-500">
              Prenez une photo de référence
            </p>
          </div>
        </template>
      </UCameraCapture>
    </UFormGroup>

    <UFormGroup
      label="Nom de la matière"
      required
    >
      <UInput
        v-model="form.name"
        placeholder="Ex: Coton 100%"
      />
    </UFormGroup>

    <UFormGroup
      label="Description"
    >
      <UTextarea
        v-model="form.description"
        placeholder="Description détaillée de la matière..."
        rows="4"
      />
    </UFormGroup>

    <div class="flex justify-end gap-3">
      <UButton
        type="button"
        color="gray"
        variant="soft"
        @click="$emit('cancel')"
      >
        Annuler
      </UButton>
      <UButton
        type="submit"
        color="primary"
        :loading="loading"
      >
        Enregistrer
      </UButton>
    </div>
  </form>
</template> 