<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo -->
      <div class="text-center">
        <img src="/logo.svg" alt="CrocoCroc" class="h-12 mx-auto" />
        <h2 class="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
          {{ isLogin ? 'Connexion' : 'Créer un compte' }}
        </h2>
      </div>

      <!-- Formulaire -->
      <UCard>
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Email -->
          <UFormGroup label="Email" name="email">
            <UInput
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
            />
          </UFormGroup>

          <!-- Nom (inscription uniquement) -->
          <UFormGroup v-if="!isLogin" label="Nom" name="name">
            <UInput
              v-model="form.name"
              required
              autocomplete="name"
            />
          </UFormGroup>

          <!-- Organisation (inscription uniquement) -->
          <UFormGroup v-if="!isLogin" label="Organisation" name="organization">
            <UInput
              v-model="form.organization"
              required
            />
          </UFormGroup>

          <!-- Mot de passe -->
          <UFormGroup label="Mot de passe" name="password">
            <UInput
              v-model="form.password"
              type="password"
              required
              autocomplete="current-password"
            />
          </UFormGroup>

          <!-- Bouton de soumission -->
          <UButton
            type="submit"
            block
            color="primary"
            :loading="loading"
          >
            {{ isLogin ? 'Se connecter' : 'Créer un compte' }}
          </UButton>
        </form>

        <!-- Lien pour basculer -->
        <div class="mt-4 text-center">
          <UButton
            variant="link"
            @click="isLogin = !isLogin"
          >
            {{ isLogin ? 'Créer un compte' : 'Déjà un compte ? Se connecter' }}
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const isLogin = ref(true)
const loading = ref(false)

const form = ref({
  email: '',
  password: '',
  name: '',
  organization: ''
})

async function handleSubmit() {
  try {
    loading.value = true

    if (isLogin.value) {
      // Login
      const { token } = await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email: form.value.email,
          password: form.value.password
        }
      })

      // Stocker le token
      const auth = useAuth()
      auth.setToken(token)

      // Rediriger vers le dashboard
      navigateTo('/dashboard')
    } else {
      // Register
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          email: form.value.email,
          password: form.value.password,
          name: form.value.name,
          organization: form.value.organization
        }
      })

      // Basculer vers le login
      isLogin.value = true
      form.value = {
        email: form.value.email,
        password: '',
        name: '',
        organization: ''
      }

      useToast().add({
        title: 'Compte créé',
        description: 'Vous pouvez maintenant vous connecter',
        color: 'green'
      })
    }
  } catch (error: any) {
    useToast().add({
      title: 'Erreur',
      description: error.data?.message || 'Une erreur est survenue',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

// Rediriger si déjà connecté
const auth = useAuth()
if (auth.isAuthenticated.value) {
  navigateTo('/dashboard')
}
</script> 