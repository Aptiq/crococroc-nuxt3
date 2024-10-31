<template>
  <div class="min-h-screen pb-16"> <!-- Ajout de padding-bottom pour compenser la hauteur de la barre de navigation -->
    <!-- Main Content -->
    <main class="p-4">
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <AppBottomNav />
  </div>
</template>