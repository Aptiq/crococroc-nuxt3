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
        'fixed z-[55] h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Header avec logo et bouton dark mode -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <NuxtImg
          :src="isDark ? '/logo-dark.svg' : '/logo-light.svg'"
          alt="CrocoCroc"
          class="h-8 w-auto"
          loading="eager"
        />
        <UButton
          :icon="colorMode.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
          color="gray"
          variant="ghost"
          size="sm"
          @click="toggleDark"
        />
      </div>

      <!-- Navigation -->
      <nav class="p-2">
        <UVerticalNavigation
          :links="navigation"
          :ui="{
            wrapper: 'space-y-2',
            base: 'group flex items-center w-full gap-2 rounded-md p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
            active: 'text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-950',
            inactive: 'text-gray-700 dark:text-gray-200',
            icon: {
              base: 'flex-shrink-0 w-5 h-5',
              active: 'text-primary-500 dark:text-primary-400',
              inactive: 'text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-200'
            }
          }"
        />
      </nav>
    </aside>
  </div>
</template>

<script setup lang="ts">
import darkLogo from '~/assets/images/logo-dark.svg'
import lightLogo from '~/assets/images/logo-light.svg'

const colorMode = useColorMode()
const props = defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  toggle: [],
  close: []
}>()

const navigation = [
  {
    label: 'Accueil',
    icon: 'i-heroicons-home',
    to: '/dashboard'
  },
  {
    label: 'Nouvelle analyse',
    icon: 'i-heroicons-plus-circle',
    to: '/analyze',
    class: 'text-primary-500 dark:text-primary-400 font-medium'
  },
  {
    label: 'Matières',
    icon: 'i-heroicons-square-3-stack-3d',
    to: '/materials'
  }
]

const toggleDark = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const isDark = useDark()

// Empêcher le défilement du body quand le menu est ouvert sur mobile
onMounted(() => {
  watch(() => props.isOpen, (isOpen) => {
    if (window.innerWidth < 1024) {
      document.body.style.overflow = isOpen ? 'hidden' : ''
    }
  })
})
</script>