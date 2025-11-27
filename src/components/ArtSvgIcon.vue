<template>
  <Icon :icon="icon" :style="iconStyle" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  icon: string
  color?: string
  size?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  color: 'currentColor',
  size: '1em'
})

const iconStyle = computed(() => ({
  color: props.color,
  fontSize: typeof props.size === 'number' ? `${props.size}px` : props.size,
  display: 'inline-block',
  verticalAlign: 'middle'
}))
</script>

<style scoped>
:deep(svg) {
  display: block;
  width: 1em;
  height: 1em;
}
</style>
