<template>
  <div>
    <!-- Overlay mobile -->
    <div
      v-show="isOpen"
      class="fixed inset-0 z-50 bg-gray-500/75 dark:bg-gray-900/75 lg:hidden"
      @click="$emit('toggle')"
    />

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed z-[55] h-full w-64 transition-transform duration-300 ease-in-out',
        'bg-white dark:bg-gray-900',
        'border-r border-gray-200 dark:border-gray-800',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Header -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <NuxtLink to="/dashboard" class="flex-shrink-0">
          <NuxtImg
            :src="isDark ? '/logo-dark.svg' : '/logo-light.svg'"
            alt="CrocoCroc"
            class="h-8 w-auto"
          />
        </NuxtLink>
        <UButton
          :icon="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'"
          color="gray"
          variant="ghost"
          @click="toggleDark"
        />
      </div>

      <!-- Bouton Nouvelle Analyse (masqué sur la page de création) -->
      <div v-if="!isAnalyzePage" class="p-4">
        <UButton
          to="/analyses/new"
          block
          color="primary"
          icon="i-heroicons-camera"
          size="lg"
          class="font-semibold"
        >
          Nouvelle analyse
        </UButton>
      </div>

      <!-- Navigation -->
      <nav class="p-2">
        <UVerticalNavigation
          :links="navigation"
          :ui="{
            wrapper: 'space-y-2',
            base: 'group flex items-center w-full gap-2 rounded-md p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
            active: 'text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-950',
            inactive: 'text-gray-700 dark:text-gray-200'
          }"
        />
      </nav>
    </aside>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const colorMode = useColorMode()

defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  toggle: []
}>()

// Vérifier si on est sur la page de création d'analyse
const isAnalyzePage = computed(() => route.path === '/analyses/new')

const navigation = computed(() => [
  {
    label: 'Accueil',
    icon: 'i-heroicons-home',
    to: '/dashboard',
    active: route.path === '/dashboard'
  },
  {
    label: 'Analyses',
    icon: 'i-heroicons-chart-bar',
    to: '/analyses',
    active: route.path === '/analyses'
  },
  {
    label: 'Matières',
    icon: 'i-heroicons-square-3-stack-3d',
    to: '/materials',
    active: route.path === '/materials'
  }
])

const isDark = useDark()
const toggleDark = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>