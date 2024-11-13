export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '')
  }
  if (typeof input === 'object' && input !== null) {
    return Object.keys(input).reduce((acc, key) => ({
      ...acc,
      [key]: sanitizeInput(input[key])
    }), {})
  }
  return input
} 