<template>
  <nav class="bg-white shadow-md mb-8">
    <div class="container mx-auto px-4">
      <div class="flex justify-between h-16">
        <div class="flex">
          <nuxt-link to="/" class="flex items-center px-4 text-gray-700 hover:text-blue-600">
            Accueil
          </nuxt-link>
          <nuxt-link to="/history" class="flex items-center px-4 text-gray-700 hover:text-blue-600">
            Historique
          </nuxt-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>