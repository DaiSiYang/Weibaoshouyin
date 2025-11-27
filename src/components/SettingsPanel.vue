<template>
  <el-drawer
    v-model="visible"
    title="主题风格"
    direction="rtl"
    size="320px"
    :show-close="true"
  >
    <div class="settings-content">
      <!-- 主题风格 -->
      <div class="setting-section">
        <h3 class="section-title">主题风格</h3>
        <div class="theme-options">
          <div 
            class="theme-card" 
            :class="{ active: !isDark }"
            @click="setTheme(false)"
          >
            <div class="theme-preview light"></div>
            <span>浅色</span>
          </div>
          <div 
            class="theme-card"
            :class="{ active: isDark }"
            @click="setTheme(true)"
          >
            <div class="theme-preview dark"></div>
            <span>深色</span>
          </div>
        </div>
      </div>

      <!-- 系统主题色 -->
      <div class="setting-section">
        <h3 class="section-title">系统主题色</h3>
        <div class="color-options">
          <div
            v-for="color in themeColors"
            :key="color"
            class="color-item"
            :class="{ active: systemThemeColor === color }"
            :style="{ backgroundColor: color }"
            @click="setThemeColor(color)"
          >
            <el-icon v-if="systemThemeColor === color" color="#fff"><Check /></el-icon>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingStore } from '@/store/modules/setting'
import { Check } from '@element-plus/icons-vue'

const settingStore = useSettingStore()
const { isDark, systemThemeColor } = storeToRefs(settingStore)

const visible = ref(false)

const themeColors = [
  '#5D87FF',
  '#B48DF3',
  '#1D84FF',
  '#60C041',
  '#38C0FC',
  '#F9901F',
  '#FF80C8'
]

const open = () => {
  visible.value = true
}

const close = () => {
  visible.value = false
}

const setTheme = (dark: boolean) => {
  if (dark !== isDark.value) {
    settingStore.toggleTheme()
  }
}

const setThemeColor = (color: string) => {
  settingStore.setThemeColor(color)
}

defineExpose({
  open,
  close
})
</script>

<style scoped lang="scss">
.settings-content {
  padding: 0 4px;
}

.setting-section {
  margin-bottom: 32px;

  .section-title {
    margin: 0 0 16px;
    font-size: 14px;
    font-weight: 500;
    color: var(--el-text-color-primary);
    text-align: center;
  }
}

.theme-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  .theme-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border: 2px solid transparent;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      border-color: var(--el-color-primary-light-5);
    }

    &.active {
      border-color: var(--el-color-primary);
    }

    .theme-preview {
      width: 100%;
      height: 60px;
      border-radius: 6px;
      border: 1px solid var(--el-border-color);

      &.light {
        background: linear-gradient(to bottom, #fff 0%, #fff 30%, #f5f5f5 30%, #f5f5f5 100%);
      }

      &.dark {
        background: linear-gradient(to bottom, #1a1a1a 0%, #1a1a1a 30%, #0a0a0a 30%, #0a0a0a 100%);
      }
    }

    span {
      font-size: 12px;
      color: var(--el-text-color-regular);
    }
  }
}

.color-options {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;

  .color-item {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    border: 2px solid transparent;

    &:hover {
      transform: scale(1.1);
    }

    &.active {
      border-color: var(--el-border-color);
      box-shadow: 0 0 0 2px var(--el-bg-color);
    }

    .el-icon {
      font-size: 16px;
    }
  }
}
</style>
