export default defineNuxtRouteMiddleware((to) => {
  // Liste des routes autorisées
  const allowedRoutes = [
    '/dashboard',
    '/materials',
    '/analyses',
    '/materials/new',
    '/analyses/new',
    '/materials/analyze' // Ajout de la route d'analyse
  ]

  // Si c'est la page d'accueil, rediriger vers le dashboard
  if (to.path === '/') {
    return navigateTo('/dashboard')
  }

  // Autoriser les routes dynamiques pour les matières et analyses
  if (
    to.path.startsWith('/materials/') || 
    to.path.startsWith('/analyses/')
  ) {
    return // Autoriser l'accès
  }

  // Si la route n'est pas dans la liste et n'est pas une route dynamique
  if (!allowedRoutes.includes(to.path)) {
    console.warn(`Route non autorisée: ${to.path}`)
    return navigateTo('/dashboard')
  }
}) 