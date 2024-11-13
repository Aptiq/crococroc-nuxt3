<template>
  <img
    :src="optimizedImageUrl"
    loading="lazy"
    :srcset="srcSet"
    sizes="(max-width: 768px) 100vw, 50vw"
    :alt="alt"
  />
</template>

<script setup lang="ts">
interface Props {
  src: string
  alt?: string
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  width: 800,
  height: 600
})

const optimizedImageUrl = computed(() => {
  return `${props.src}?w=${props.width}&q=80`
})

const srcSet = computed(() => {
  const sizes = [400, 800, 1200]
  return sizes
    .map(size => `${props.src}?w=${size}&q=80 ${size}w`)
    .join(', ')
})
</script> 