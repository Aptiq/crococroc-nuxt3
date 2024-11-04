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
      if (this.materials.length > 0) return // Éviter les requêtes inutiles si les données sont déjà chargées
      
      this.loading = true
      try {
        const response = await $fetch('/api/materials')
        console.log('Fetched materials:', response)
        this.materials = response
      } catch (error: any) {
        console.error('Error fetching materials:', error)
        this.error = error.message || 'Erreur lors du chargement des matières'
      } finally {
        this.loading = false
      }
    },

    async getMaterial(id: number) {
      this.loading = true
      try {
        const response = await $fetch(`/api/materials/${id}`)
        console.log('Fetched material:', response)
        this.currentMaterial = response
        return response
      } catch (error: any) {
        console.error('Error fetching material:', error)
        this.error = error.message || 'Erreur lors du chargement de la matière'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createMaterial(data: Partial<Material>) {
      this.loading = true
      try {
        console.log('Store: Creating material with data:', {
          name: data.name,
          descriptionLength: data.description?.length,
          imageLength: data.image?.length
        });

        const requestBody = {
          name: data.name || '',
          description: data.description || '',
          image: data.image || ''
        };

        console.log('Store: Request body:', requestBody);

        const response = await $fetch('/api/materials', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        console.log('Store: Response received:', response);
        this.materials.push(response);
        return response;
      } catch (error: any) {
        console.error('Store: Error creating material:', error);
        this.error = error.message || 'Erreur lors de la création de la matière';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async analyzeMaterial(materialId: number, testImage: File) {
      this.loading = true
      try {
        console.log('Analyzing material:', {
          materialId,
          hasImage: !!testImage
        })

        const formData = new FormData()
        formData.append('testImage', testImage)
        
        const response = await $fetch(`/api/materials/${materialId}/analyze`, {
          method: 'POST',
          body: formData
        })
        
        console.log('Analysis completed:', response)
        
        if (this.currentMaterial && this.currentMaterial.id === materialId) {
          this.currentMaterial.analyses.push(response)
        }
        
        return response
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