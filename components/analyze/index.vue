@'
<template>
  <div class="analyze-form">
    <form @submit.prevent="handleSubmit">
      <h2>Formulaire d'analyse</h2>
    </form>
  </div>
</template>

<script setup lang="ts">
const handleSubmit = () => {
  console.log("Formulaire soumis")
}
</script>

<style scoped>
.analyze-form {
  padding: 1rem;
}
</style>
'@ | Out-File -FilePath "components/analyze/index.vue" -Encoding UTF8