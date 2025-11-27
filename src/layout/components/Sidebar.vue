<template>
  <aside class="layout-sidebar" :class="{ 'no-border': menuRoutes.length === 0 }">
    <div class="sidebar-container" :class="{ collapsed: !menuOpen }">
      <!-- Logo 和系统名称 -->
      <div class="header" @click="toHome">
        <div class="logo">
          <ArtLogo :size="32" />
        </div>
        <p :style="{ opacity: menuOpen ? 1 : 0 }">鹊莲银通运营中心</p>
      </div>

      <!-- 菜单列表 -->
      <el-scrollbar class="menu-scrollbar">
        <el-menu
          :default-active="activeMenu"
          :collapse="!menuOpen"
          :collapse-transition="false"
          :unique-opened="false"
          :class="`el-menu-${menuTheme}`"
          :background-color="menuBgColor"
          :text-color="menuTextColor"
          :active-text-color="menuActiveTextColor"
        >
          <SidebarMenuItem
            v-for="route in menuRoutes"
            :key="route.path"
            :item="route"
            :menu-open="menuOpen"
          />
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
import SidebarMenuItem from './SidebarMenuItem.vue'
import ArtLogo from '@/components/core/ArtLogo.vue'

const router = useRouter()
const route = useRoute()
const settingStore = useSettingStore()

const { menuOpen, isDark } = storeToRefs(settingStore)

// 菜单路由列表
const menuRoutes = computed(() => {
  const routes = router.getRoutes().find(r => r.path === '/')?.children || []
  return routes.filter(r => !r.meta?.isHide)
})

// 当前激活的菜单
const activeMenu = computed(() => route.path)

// 菜单主题
const menuTheme = computed(() => isDark.value ? 'dark' : 'design')

// 菜单背景色
const menuBgColor = computed(() => {
  return isDark.value ? '#141414' : '#ffffff'
})

// 菜单文字颜色
const menuTextColor = computed(() => {
  return isDark.value ? 'rgba(255, 255, 255, 0.7)' : '#29343D'
})

// 菜单激活文字颜色
const menuActiveTextColor = computed(() => {
  return isDark.value ? '#ffffff' : 'var(--el-color-primary)'
})

// 跳转首页
const toHome = () => {
  router.push('/dashboard')
}
</script>

<style scoped lang="scss">
.layout-sidebar {
  display: flex;
  height: 100vh;
  user-select: none;
  border-right: 1px solid var(--el-border-color);

  &.no-border {
    border-right: none !important;
  }

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
      font-size: 18px;
      font-weight: 600;
      line-height: 60px;
      color: var(--el-text-color-primary);
      transition: opacity 0.3s;
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
