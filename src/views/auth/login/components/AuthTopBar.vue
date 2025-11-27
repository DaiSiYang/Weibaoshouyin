<template>
  <div class="auth-top-bar">
    <!-- 移动端 Logo -->
    <div class="mobile-logo">
      <ArtLogo :size="40" />
      <h1 class="name">{{ AppConfig.systemInfo.name }}</h1>
    </div>

    <!-- 右侧操作区 -->
    <div class="actions">
      <!-- 主题色选择 -->
      <div class="color-picker">
        <div class="color-dots">
          <div
            v-for="color in mainColors"
            :key="color"
            class="color-dot"
            :class="{ active: color === systemThemeColor }"
            :style="{ background: color }"
            @click="changeThemeColor(color)"
          >
            <el-icon v-if="color === systemThemeColor" class="check"><Check /></el-icon>
          </div>
        </div>
        <div class="btn palette-btn">
          <el-icon><Brush /></el-icon>
        </div>
      </div>

      <!-- 语言切换 -->
      <el-dropdown @command="changeLanguage">
        <div class="btn">
          <svg class="lang-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="lang in languageOptions"
              :key="lang.value"
              :command="lang.value"
              :class="{ 'is-active': language === lang.value }"
            >
              {{ lang.label }}
              <el-icon v-if="language === lang.value" class="check-icon"><Check /></el-icon>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 主题切换 -->
      <div class="btn" @click="handleThemeClick">
        <el-icon>
          <Sunny v-if="isDark" />
          <Moon v-else />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { Check, Brush, Sunny, Moon } from '@element-plus/icons-vue'
import { useSettingStore } from '@/store/modules/setting'
import { useUserStore } from '@/store/modules/user'
import ArtLogo from '@/components/core/ArtLogo.vue'
import AppConfig from '@/config'
import { themeAnimation } from '@/utils/animation'

const { locale } = useI18n()
const settingStore = useSettingStore()
const userStore = useUserStore()
const { isDark, systemThemeColor } = storeToRefs(settingStore)
const { language } = storeToRefs(userStore)

const mainColors = AppConfig.systemMainColor

const languageOptions = [
  { value: 'zh', label: '简体中文' },
  { value: 'en', label: 'English' }
]

const changeLanguage = (lang: string) => {
  if (language.value === lang) return
  userStore.setLanguage(lang)
  locale.value = lang
}

const changeThemeColor = (color: string) => {
  settingStore.setThemeColor(color)
}

const handleThemeClick = (e: MouseEvent) => {
  themeAnimation(e)
}
</script>

<style lang="scss" scoped>
.auth-top-bar {
  position: absolute;
  top: 16px;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 16px;

  @media (max-width: 1180px) {
    justify-content: space-between;
  }
}

.mobile-logo {
  display: none;
  align-items: center;
  gap: 8px;

  @media (max-width: 1180px) {
    display: flex;
  }

  .name {
    font-size: 18px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s;
  color: var(--el-text-color-primary);

  &:hover {
    background: var(--el-fill-color-light);
  }

  .el-icon {
    font-size: 18px;
  }

  .lang-icon {
    width: 18px;
    height: 18px;
  }
}

// 颜色选择器
.color-picker {
  position: relative;
  display: flex;
  align-items: center;

  @media (max-width: 640px) {
    display: none;
  }

  .color-dots {
    position: absolute;
    right: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 40px 8px 12px;
    background: var(--el-bg-color-overlay);
    border-radius: 20px;
    box-shadow: var(--el-box-shadow-light);
    opacity: 0;
    pointer-events: none;
    transform: translateX(10px);
    transition: all 0.3s;
  }

  &:hover .color-dots {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(0);
  }

  .color-dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.1);
    }

    &.active {
      box-shadow: 0 0 0 2px var(--el-bg-color), 0 0 0 4px currentColor;
    }

    .check {
      font-size: 12px;
      color: #fff;
    }
  }

  .palette-btn {
    position: relative;
    z-index: 2;
  }
}

// 下拉菜单样式
:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 120px;

  &.is-active {
    color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
  }

  .check-icon {
    margin-left: 8px;
  }
}
</style>
