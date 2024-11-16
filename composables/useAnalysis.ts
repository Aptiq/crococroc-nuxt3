import type { Analysis } from '~/types'
import { getGradeColor, getGradeLabel } from '~/constants/grades'

export function useAnalysis() {
  const formatDate = (date: string, options: Intl.DateTimeFormatOptions = {}) => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    }

    return new Date(date).toLocaleDateString('fr-FR', defaultOptions)
  }

  const formatShortDate = (date: string) => {
    return formatDate(date, {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const sortAnalysesByDate = (analyses: Analysis[]) => {
    return [...analyses].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }

  return {
    getGradeColor,
    getGradeLabel,
    formatDate,
    formatShortDate,
    sortAnalysesByDate
  }
} 