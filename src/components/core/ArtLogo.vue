<template>
  <div class="art-logo">
    <div class="logo-icon" :style="logoStyle">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" :style="`stop-color: ${themeColor}`" />
            <stop offset="100%" :style="`stop-color: ${themeColorDark}`" />
          </linearGradient>
        </defs>
        <rect x="10" y="10" width="80" height="80" rx="16" fill="url(#logoGradient)" />
        <text x="50" y="65" text-anchor="middle" fill="white" font-size="40" font-weight="bold">W</text>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSettingStore } from '@/store/modules/setting'
import { storeToRefs } from 'pinia'

defineOptions({ name: 'ArtLogo' })

interface Props {
  size?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  size: 36
})

const settingStore = useSettingStore()
const { systemThemeColor } = storeToRefs(settingStore)

const themeColor = computed(() => systemThemeColor.value)
const themeColorDark = computed(() => {
  // 简单的颜色加深处理
  return systemThemeColor.value
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
  
  svg {
    width: 100%;
    height: 100%;
  }
}
</style>
