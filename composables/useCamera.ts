export function useCamera() {
  const stream = ref<MediaStream | null>(null)
  const error = ref<string | null>(null)
  const lightLevel = ref<number>(0)
  const isMobile = ref(false)

  // Vérifier si on est sur mobile
  onMounted(() => {
    isMobile.value = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)
  })

  async function startCamera() {
    try {
      // Vérifier si la caméra est disponible
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Votre appareil ne supporte pas l'accès à la caméra")
      }

      stream.value = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: isMobile.value ? 'environment' : 'user',
          width: { ideal: 4096 },
          height: { ideal: 2160 }
        }
      })

      // Vérifier le niveau de luminosité si possible
      if ('AmbientLightSensor' in window) {
        const sensor = new (window as any).AmbientLightSensor()
        sensor.addEventListener('reading', () => {
          lightLevel.value = sensor.illuminance
        })
        sensor.start()
      }

    } catch (e: any) {
      error.value = e.message || "Erreur d'accès à la caméra"
      useToast().add({
        title: 'Erreur',
        description: error.value,
        color: 'red'
      })
    }
  }

  async function takePhoto(): Promise<Blob | null> {
    if (!stream.value) {
      useToast().add({
        title: 'Erreur',
        description: 'La caméra n\'est pas active',
        color: 'red'
      })
      return null
    }

    try {
      const video = document.createElement('video')
      video.srcObject = stream.value
      await video.play()

      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Impossible de créer le contexte canvas')
      
      ctx.drawImage(video, 0, 0)
      
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            useToast().add({
              title: 'Erreur',
              description: 'Impossible de capturer l\'image',
              color: 'red'
            })
            resolve(null)
            return
          }
          resolve(blob)
        }, 'image/jpeg', 0.95)
      })
    } catch (e) {
      useToast().add({
        title: 'Erreur',
        description: 'Erreur lors de la capture',
        color: 'red'
      })
      return null
    }
  }

  return {
    stream,
    error,
    lightLevel,
    isMobile,
    startCamera,
    takePhoto
  }
} 