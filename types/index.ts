// Créer des types partagés
export interface Analysis {
  id: string
  material_id: string
  material: {
    id: string
    name: string
    image: string
    description?: string
  }
  image1_gray: string
  image1_iso_grade: number
  image1_avg_gray: number
  image1_resolution: string
  image2_gray: string
  image2: string
  image2_iso_grade: number
  image2_avg_gray: number
  image2_resolution: string
  difference_grade: number
  created_at: string
  updated_at: string
}

export interface Material {
  id: string
  name: string
  description?: string
  image: string
  createdAt: Date
  updatedAt: Date
  analyses?: Analysis[]
} 