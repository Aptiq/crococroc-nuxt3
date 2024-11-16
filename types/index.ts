// Créer des types partagés
export interface Analysis {
  id: string
  material_id: string
  material: Material
  image1: string
  image1_gray: string
  image1_iso_grade: number
  image1_avg_gray: number
  image1_resolution: string
  image2: string
  image2_gray: string
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
  created_at: string
  updated_at: string
  analyses?: Analysis[]
  hasAnalysis?: boolean
}

export interface ImageAnalysis {
  gray_image_str: string
  iso_grade: number
  average_gray: number
  resolution: string
}

export interface TestResults {
  image1: ImageAnalysis
  image2: ImageAnalysis
  difference_grade: number
} 