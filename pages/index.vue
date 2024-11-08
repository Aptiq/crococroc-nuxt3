<template>
  <div>
    <!-- Page de chargement si nécessaire -->
  </div>
</template>

<script setup lang="ts">
// Redirection automatique vers le dashboard
const router = useRouter()
onMounted(() => {
  router.push('/dashboard')
})
</script>