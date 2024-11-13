<template>
  <div class="camera-capture">
    <!-- Version Desktop -->
    <div v-if="!isMobileDevice" class="text-center p-6 space-y-4">
      <div class="text-4xl text-gray-400">
        <Icon name="i-heroicons-device-phone-mobile" />
      </div>
      
      <div class="text-gray-600">
        Veuillez utiliser votre téléphone portable pour une meilleure précision.
      </div>

      <!-- QR Code -->
      <div v-if="currentUrl" class="mt-4">
        <img 
          :src="`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(currentUrl)}`"
          alt="QR Code"
          class="mx-auto"
        />
        <div class="text-sm text-gray-500 mt-2">
          Scannez ce QR code
        </div>
      </div>
    </div>

    <!-- Version Mobile -->
    <div v-else class="relative">
      <!-- Indicateur de luminosité -->
      <div 
        v-if="lightLevel"
        class="absolute top-2 right-2 px-3 py-1 rounded-full text-sm text-white"
        :class="{
          'bg-green-500': lightStatus === 'optimal',
          'bg-yellow-500': lightStatus === 'too-dark',
          'bg-red-500': lightStatus === 'too-bright'
        }"
      >
        {{ lightLevel }}lx
      </div>

      <video
        ref="videoRef"
        class="w-full h-48 object-cover rounded-lg"
        autoplay
        playsinline
        muted
      />

      <UButton
        v-if="stream"
        icon="i-heroicons-camera"
        class="w-full mt-4"
        :disabled="!isLightValid"
        @click="takePhoto"
      >
        {{ buttonText }}
      </UButton>

      <!-- Message d'aide -->
      <div 
        v-if="!isLightValid" 
        class="text-sm text-red-500 mt-2"
      >
        {{ lightMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['photo-taken'])
const videoRef = ref<HTMLVideoElement | null>(null)
const stream = ref<MediaStream | null>(null)

// Détection du device
const isMobileDevice = computed(() => {
  if (process.client) {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  }
  return false
})

// URL actuelle pour le QR Code
const currentUrl = computed(() => {
  if (process.client) {
    return window.location.href
  }
  return ""
})

// Gestion de la luminosité
const { 
  lightLevel, 
  isLightValid, 
  status: lightStatus, 
  error: lightError,
  startSensor 
} = useLightSensor()

// Message du bouton
const buttonText = computed(() => 
  isLightValid.value 
    ? "Prendre la photo" 
    : "Ajustez l'éclairage"
)

// Message d'aide pour l'éclairage
const lightMessage = computed(() => {
  if (lightError.value) return lightError.value
  
  switch (lightStatus.value) {
    case "too-dark":
      return "L'éclairage est trop faible (minimum 540 lux)"
    case "too-bright":
      return "L'éclairage est trop fort (maximum 660 lux)"
    default:
      return ""
  }
})

// Démarrer la caméra
async function startCamera() {
  if (!isMobileDevice.value) return

  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment"
      }
    })
    
    if (videoRef.value) {
      videoRef.value.srcObject = stream.value
    }
  } catch (error) {
    console.error("Erreur lors du démarrage de la caméra:", error)
  }
}

// Prendre une photo
function takePhoto() {
  if (!videoRef.value || !stream.value) return

  const canvas = document.createElement("canvas")
  canvas.width = videoRef.value.videoWidth
  canvas.height = videoRef.value.videoHeight
  
  const context = canvas.getContext("2d")
  if (!context) return
  
  context.drawImage(videoRef.value, 0, 0)
  
  const photoData = canvas.toDataURL("image/jpeg")
  emit("photo-taken", photoData)
}

// Nettoyage
onBeforeUnmount(() => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
  }
})

// Initialisation
onMounted(async () => {
  if (isMobileDevice.value) {
    await startSensor()
    await startCamera()
  }
})
</script>