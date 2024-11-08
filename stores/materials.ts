import { defineStore } from 'pinia'

interface Material {
  id: number
  name: string
  description: string
  image: string
  created_at: string
  analyses: Analysis[]
}

interface Analysis {
  id: number
  created_at: string
  initial_grade: number
  test_grade: number
  difference_grade: number
}

export const useMaterialsStore = defineStore('materials', {
  state: () => ({
    materials: [] as Material[],
    currentMaterial: null as Material | null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    getMaterialById: (state) => {
      return (id: number) => state.materials.find(m => m.id === id)
    },
    
    sortedMaterials: (state) => {
      return [...state.materials].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    }
  },

  actions: {
    async fetchMaterials() {
      try {
        this.loading = true
        this.error = null
        const { data: response } = await useFetch('/api/materials', {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        if (response.value) {
          console.log('Fetched materials:', response.value)
          this.materials = response.value
        } else {
          throw new Error('Aucune matière trouvée')
        }
      } catch (error: any) {
        console.error('Error fetching materials:', error)
        this.error = error.message || 'Erreur lors du chargement des matières'
        this.materials = []
      } finally {
        this.loading = false
      }
    },

    async getMaterial(id: number) {
      try {
        this.loading = true
        this.error = null
        const { data: response } = await useFetch(`/api/materials/${id}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (response.value) {
          console.log('Fetched material:', response.value)
          this.currentMaterial = response.value
          return response.value
        } else {
          throw new Error('Matière non trouvée')
        }
      } catch (error: any) {
        console.error('Error fetching material:', error)
        this.error = error.message || 'Erreur lors du chargement de la matière'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createMaterial(data: Partial<Material>) {
      try {
        this.loading = true
        this.error = null
        console.log('Creating material with data:', data)

        const { data: response } = await useFetch('/api/materials', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: data.name || '',
            description: data.description || '',
            image: data.image || ''
          })
        })

        if (response.value) {
          console.log('Material created:', response.value)
          this.materials.push(response.value)
          return response.value
        } else {
          throw new Error('Erreur lors de la création de la matière')
        }
      } catch (error: any) {
        console.error('Error creating material:', error)
        this.error = error.message || 'Erreur lors de la création de la matière'
        throw error
      } finally {
        this.loading = false
      }
    },

    async analyzeMaterial(materialId: number, testImage: File) {
      try {
        this.loading = true
        this.error = null
        console.log('Analyzing material:', { materialId, hasImage: !!testImage })

        const formData = new FormData()
        formData.append('testImage', testImage)
        
        const { data: response } = await useFetch(`/api/materials/${materialId}/analyze`, {
          method: 'POST',
          body: formData
        })

        if (response.value) {
          console.log('Analysis completed:', response.value)
          
          if (this.currentMaterial && this.currentMaterial.id === materialId) {
            this.currentMaterial.analyses.push(response.value)
          }
          
          return response.value
        } else {
          throw new Error('Erreur lors de l\'analyse')
        }
      } catch (error: any) {
        console.error('Error analyzing material:', error)
        this.error = error.message || 'Erreur lors de l\'analyse'
        throw error
      } finally {
        this.loading = false
      }
    }
  },

  persist: {
    key: 'materials-store',
    storage: process.client ? localStorage : null,
    paths: ['materials', 'currentMaterial']
  }
})