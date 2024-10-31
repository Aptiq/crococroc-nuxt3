<template>
  <div class="relative">
    <!-- Preview de la caméra -->
    <video
      v-show="isCapturing && !capturedImage"
      ref="videoRef"
      class="w-full rounded-lg aspect-[4/3] bg-gray-100"
      autoplay
      playsinline
    />

    <!-- Image capturée -->
    <img
      v-if="capturedImage"
      :src="capturedImage"
      class="w-full rounded-lg aspect-[4/3] object-cover"
      alt="Captured image"
    />

    <!-- Boutons de contrôle -->
    <div class="mt-4 flex gap-2 justify-center">
      <template v-if="!isCapturing && !capturedImage">
        <UButton
          icon="i-heroicons-camera"
          @click="startCapture"
          :disabled="isInitializing"
        >
          {{ isInitializing ? 'Initialisation...' : 'Prendre une photo' }}
        </UButton>
      </template>
      
      <template v-if="isCapturing && !capturedImage">
        <UButton
          color="primary"
          icon="i-heroicons-camera"
          @click="capture"
        >
          Capturer
        </UButton>
        
        <UButton
          color="gray"
          @click="stopCapture"
        >
          Annuler
        </UButton>

        <UButton
          v-if="hasMultipleCameras"
          color="gray"
          icon="i-heroicons-arrow-path"
          @click="switchCamera"
        >
          Changer de caméra
        </UButton>
      </template>

      <template v-if="capturedImage">
        <UButton
          color="gray"
          icon="i-heroicons-arrow-path"
          @click="retakePhoto"
        >
          Reprendre
        </UButton>
      </template>
    </div>

    <!-- Message d'erreur -->
    <p v-if="error" class="mt-2 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface CameraOptions {
  facingMode?: 'user' | 'environment'
  quality?: number // 0 à 1
  maxWidth?: number
  maxHeight?: number
}

const props = defineProps<{
  modelValue?: string | null
  options?: CameraOptions
  showSwitchButton?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
  'photo-taken': [value: string]
  'error': [error: string]
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const isCapturing = ref(false)
const isInitializing = ref(false)
const stream = ref<MediaStream | null>(null)
const error = ref<string | null>(null)
const capturedImage = ref<string | null>(null)
const currentFacingMode = ref<'user' | 'environment'>(
  props.options?.facingMode || 'environment'
)
const hasMultipleCameras = ref(false)

// Vérifier la disponibilité de plusieurs caméras
async function checkMultipleCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const videoDevices = devices.filter(device => device.kind === 'videoinput')
    hasMultipleCameras.value = videoDevices.length > 1
  } catch (err) {
    console.error('Erreur lors de la vérification des caméras:', err)
  }
}

async function startCapture() {
  error.value = null
  isInitializing.value = true
  capturedImage.value = null
  
  try {
    const constraints: MediaTrackConstraints = {
      facingMode: currentFacingMode.value,
      width: props.options?.maxWidth ? { max: props.options.maxWidth } : undefined,
      height: props.options?.maxHeight ? { max: props.options.maxHeight } : undefined
    }

    stream.value = await navigator.mediaDevices.getUserMedia({
      video: constraints
    })
    
    if (videoRef.value && stream.value) {
      videoRef.value.srcObject = stream.value
      isCapturing.value = true
      await checkMultipleCameras()
    }
  } catch (err) {
    const errorMessage = "Impossible d'accéder à la caméra. Vérifiez que vous avez donné les permissions nécessaires."
    error.value = errorMessage
    emit('error', errorMessage)
    useToast().add({
      title: 'Erreur',
      description: errorMessage,
      color: 'red'
    })
  } finally {
    isInitializing.value = false
  }
}

function capture() {
  if (!videoRef.value) return
  
  const canvas = document.createElement('canvas')
  canvas.width = videoRef.value.videoWidth
  canvas.height = videoRef.value.videoHeight
  
  const context = canvas.getContext('2d')
  if (!context) return
  
  context.drawImage(videoRef.value, 0, 0)

  // Appliquer la qualité si spécifiée
  const quality = props.options?.quality || 0.92
  const imageData = canvas.toDataURL('image/jpeg', quality)
  
  capturedImage.value = imageData
  emit('update:modelValue', imageData)
  emit('photo-taken', imageData)
  stopCapture()
}

function stopCapture() {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
  isCapturing.value = false
  error.value = null
}

function retakePhoto() {
  capturedImage.value = null
  emit('update:modelValue', null)
  startCapture()
}

async function switchCamera() {
  currentFacingMode.value = currentFacingMode.value === 'user' ? 'environment' : 'user'
  await stopCapture()
  await startCapture()
}

// Nettoyage à la destruction du composant
onUnmounted(() => {
  stopCapture()
})
</script>