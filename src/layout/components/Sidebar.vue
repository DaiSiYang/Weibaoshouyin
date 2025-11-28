<template>
  <aside class="layout-sidebar">
    <div class="sidebar-container" :class="{ collapsed: !menuOpen }">
      <!-- Logo 和系统名称 -->
      <div class="header" @click="toHome">
        <div class="logo">
          <ArtLogo :size="32" />
        </div>
        <p :style="{ opacity: menuOpen ? 1 : 0 }">鹊莲营通运营中心</p>
      </div>

      <!-- 菜单列表 -->
      <el-scrollbar class="menu-scrollbar">
        <el-menu
          :default-active="activeMenu"
          :collapse="!menuOpen"
          :collapse-transition="false"
          :unique-opened="true"
          :class="`el-menu-${menuTheme}`"
          :background-color="menuBgColor"
          :text-color="menuTextColor"
          :active-text-color="menuActiveTextColor"
          router
        >
          <template v-for="menu in menuConfig" :key="menu.path || menu.title">
            <!-- 有子菜单 -->
            <el-sub-menu v-if="menu.children" :index="menu.title">
              <template #title>
                <el-icon><component :is="menu.icon" /></el-icon>
                <span>{{ menu.title }}</span>
              </template>
              <el-menu-item
                v-for="child in menu.children"
                :key="child.path"
                :index="child.path"
              >
                <el-icon><component :is="child.icon" /></el-icon>
                <span>{{ child.title }}</span>
              </el-menu-item>
            </el-sub-menu>
            <!-- 无子菜单 -->
            <el-menu-item v-else :index="menu.path">
              <el-icon><component :is="menu.icon" /></el-icon>
              <span>{{ menu.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-scrollbar>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useSettingStore } from '@/store/modules/setting'
import { menuConfig } from '@/router'
import ArtLogo from '@/components/core/ArtLogo.vue'

const router = useRouter()
const route = useRoute()
const settingStore = useSettingStore()

const { menuOpen, isDark } = storeToRefs(settingStore)

// 当前激活的菜单
const activeMenu = computed(() => route.path)

// 菜单主题
const menuTheme = computed(() => (isDark.value ? 'dark' : 'design'))

// 菜单背景色
const menuBgColor = computed(() => (isDark.value ? '#141414' : '#ffffff'))

// 菜单文字颜色
const menuTextColor = computed(() =>
    isDark.value ? 'rgba(255, 255, 255, 0.7)' : '#29343D'
)

// 菜单激活文字颜色
const menuActiveTextColor = computed(() =>
    isDark.value ? '#ffffff' : 'var(--el-color-primary)'
)

// 跳转首页
const toHome = () => {
    router.push('/service-stats')
}
</script>

<style scoped lang="scss">
.layout-sidebar {
  display: flex;
  height: 100vh;
  user-select: none;
  border-right: 1px solid var(--el-border-color);

  .sidebar-container {
    width: 240px;
    height: 100%;
    background: var(--sidebar-bg);
    transition: width 0.3s;

    &.collapsed {
      width: 64px;

      .header p {
        opacity: 0 !important;
      }
    }
  }

  .header {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 100%;
    height: 60px;
    overflow: hidden;
    cursor: pointer;
    border-bottom: 1px solid var(--el-border-color);

    .logo {
      width: 32px;
      height: 32px;
      margin-left: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    p {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 64px;
      box-sizing: border-box;
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      line-height: 60px;
      color: var(--el-text-color-primary);
      transition: opacity 0.3s;
      white-space: nowrap;
    }
  }

  .menu-scrollbar {
    height: calc(100vh - 60px);

    :deep(.el-scrollbar__view) {
      padding: 8px 0;
    }

    :deep(.el-scrollbar__bar.is-vertical) {
      width: 4px;
    }

    :deep(.el-scrollbar__thumb) {
      background-color: var(--el-fill-color-dark);
      border-radius: 2px;
    }
  }

  .el-menu {
    border: none;
    height: 100%;
    overflow-y: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      width: 0 !important;
    }
  }
}

// 暗色主题
.dark {
  .layout-sidebar {
    border-right: 1px solid rgba(255, 255, 255, 0.13);

    :deep(.el-scrollbar__thumb) {
      background-color: #777;
    }
  }
}
</style>
