<template>
  <div class="art-logo">
    <div class="logo-icon" :style="logoStyle">
      <img src="@/assets/images/common/logo.webp" alt="Logo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'ArtLogo' })

interface Props {
  size?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  size: 36
})

const logoStyle = computed(() => ({
  width: typeof props.size === 'number' ? `${props.size}px` : props.size,
  height: typeof props.size === 'number' ? `${props.size}px` : props.size
}))
</script>

<style scoped lang="scss">
.art-logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
