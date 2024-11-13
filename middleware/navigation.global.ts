export default defineNuxtRouteMiddleware((to) => {
  // Si on est sur la page d'accueil, rediriger vers le dashboard
  if (to.path === '/') {
    return navigateTo('/dashboard')
  }
}) 