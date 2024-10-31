<template>
  <div>
    <div class="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
      <input 
        type="file" 
        :id="id" 
        ref="fileInput"
        @change="onFileSelected" 
        accept="image/*"
        class="hidden"
      />
      <label :for="id" class="cursor-pointer">
        <div class="flex flex-col items-center">
          <span class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors mb-2">
            {{ label }}
          </span>
          <span v-if="selectedFileName" class="text-sm text-gray-600">
            Fichier sélectionné : {{ selectedFileName }}
          </span>
          <span v-else class="text-sm text-gray-500">
            Aucun fichier sélectionné
          </span>
        </div>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Sélectionner une image'
    },
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      selectedFileName: null
    }
  },
  methods: {
    onFileSelected(event) {
      const file = event.target.files[0]
      if (file) {
        this.selectedFileName = file.name
        this.$emit('file-selected', file)
      }
    }
  }
}
</script>