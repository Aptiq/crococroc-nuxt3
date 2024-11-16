export const GRADE_THRESHOLDS = {
  EXCELLENT: 4.5,
  GOOD: 3.5,
  AVERAGE: 2.5,
  POOR: 1.5
} as const

export const GRADE_COLORS = {
  EXCELLENT: 'green',
  GOOD: 'yellow',
  AVERAGE: 'orange',
  POOR: 'red',
  DEFAULT: 'gray'
} as const

export const GRADE_LABELS = {
  EXCELLENT: 'Excellent',
  GOOD: 'Bon',
  AVERAGE: 'Moyen',
  POOR: 'Faible',
  DEFAULT: 'Non évalué'
} as const

export function getGradeColor(grade: number): string {
  if (!grade) return GRADE_COLORS.DEFAULT
  if (grade >= GRADE_THRESHOLDS.EXCELLENT) return GRADE_COLORS.EXCELLENT
  if (grade >= GRADE_THRESHOLDS.GOOD) return GRADE_COLORS.GOOD
  if (grade >= GRADE_THRESHOLDS.AVERAGE) return GRADE_COLORS.AVERAGE
  return GRADE_COLORS.POOR
}

export function getGradeLabel(grade: number): string {
  if (!grade) return GRADE_LABELS.DEFAULT
  if (grade >= GRADE_THRESHOLDS.EXCELLENT) return GRADE_LABELS.EXCELLENT
  if (grade >= GRADE_THRESHOLDS.GOOD) return GRADE_LABELS.GOOD
  if (grade >= GRADE_THRESHOLDS.AVERAGE) return GRADE_LABELS.AVERAGE
  return GRADE_LABELS.POOR
} 