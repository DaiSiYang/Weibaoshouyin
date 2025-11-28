<template>
  <header class="header">
    <div class="header-left">
      <ArtSvgIcon 
        :icon="menuOpen ? 'ri:menu-fold-line' : 'ri:menu-unfold-line'" 
        class="menu-toggle"
        size="20"
        color="#7987a1"
        @click="toggleSidebar"
      />
      <ArtSvgIcon icon="ri:refresh-line" class="header-icon refresh-btn" size="20" color="#7987a1" @click="handleRefresh" />
      <ArtSvgIcon icon="ri:function-line" class="header-icon" size="20" color="#7987a1" />
      <span class="header-text">{{ breadcrumb }}</span>
    </div>

    <div class="header-right">
      <!-- 搜索框 -->
      <div class="search-box" @click="handleSearch">
        <ArtSvgIcon icon="ri:search-line" class="text-sm" />
        <span>{{ $t('topBar.search.title') }}</span>
        <span class="shortcut">
          <ArtSvgIcon icon="ri:command-fill" class="text-xs" />
          <span class="ml-0.5">K</span>
        </span>
      </div>

      <!-- 全屏 -->
      <el-tooltip content="全屏" placement="bottom">
        <ArtSvgIcon 
          :icon="isFullscreen ? 'ri:fullscreen-exit-line' : 'ri:fullscreen-fill'" 
          class="header-icon full-screen-btn"
          size="20"
          color="#7987a1"
          @click="toggleFullscreen"
        />
      </el-tooltip>

      <!-- 语言切换 -->
      <el-dropdown @command="changeLanguage">
        <ArtSvgIcon icon="ri:translate-2" class="header-icon language-btn" size="20" color="#7987a1" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="zh">简体中文</el-dropdown-item>
            <el-dropdown-item command="en">English</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 通知 -->
      <el-badge :value="noticeCount" :hidden="noticeCount === 0" class="notification-badge">
        <ArtSvgIcon icon="ri:notification-2-line" class="header-icon notice-button" size="20" color="#7987a1" />
      </el-badge>

      <!-- 消息 -->
      <el-badge :value="messageCount" :hidden="messageCount === 0" class="notification-badge">
        <ArtSvgIcon icon="ri:message-3-line" class="header-icon chat-button" size="20" color="#7987a1" />
      </el-badge>

      <!-- 设置 -->
      <el-tooltip content="设置" placement="bottom">
        <ArtSvgIcon 
          icon="ri:settings-line" 
          class="header-icon setting-btn" 
          size="20" 
          color="#7987a1"
          @click="openSettings"
        />
      </el-tooltip>

      <!-- 主题切换 -->
      <el-tooltip :content="isDark ? '切换到亮色' : '切换到暗色'" placement="bottom">
        <ArtSvgIcon 
          :icon="isDark ? 'ri:sun-fill' : 'ri:moon-line'" 
          class="header-icon theme-toggle"
          size="20"
          color="#7987a1"
          @click="toggleTheme"
        />
      </el-tooltip>

      <!-- 用户菜单 -->
      <el-popover
        placement="bottom-end"
        :width="240"
        :hide-after="0"
        :offset="10"
        trigger="hover"
        :show-arrow="false"
        popper-class="user-menu-popover"
      >
        <template #reference>
          <img
            class="user-avatar"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            alt="avatar"
          />
        </template>
        <template #default>
          <div class="user-menu-content">
            <div class="user-info-header">
              <img
                class="avatar-large"
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              />
              <div class="user-details">
                <span class="username">{{ userInfoStore.userInfo.username }}</span>
                <span class="email">{{ userInfoStore.userInfo.email || '暂无邮箱'}}</span>
              </div>
            </div>
            <ul class="menu-list">
              <li class="menu-item" @click="handleCommand('profile')">
                <ArtSvgIcon icon="ri:user-3-line" size="16" />
                <span>{{ $t('topBar.user.userCenter') }}</span>
              </li>
              <li class="menu-item" @click="handleCommand('docs')">
                <ArtSvgIcon icon="ri:book-2-line" size="16" />
                <span>{{ $t('topBar.user.docs') }}</span>
              </li>
              <li class="menu-item" @click="handleCommand('github')">
                <ArtSvgIcon icon="ri:github-line" size="16" />
                <span>{{ $t('topBar.user.github') }}</span>
              </li>
              <li class="menu-item" @click="handleCommand('lock')">
                <ArtSvgIcon icon="ri:lock-line" size="16" />
                <span>{{ $t('topBar.user.lockScreen') }}</span>
              </li>
              <div class="divider"></div>
              <div class="logout-btn" @click="handleCommand('logout')">
                {{ $t('topBar.user.logout') }}
              </div>
            </ul>
          </div>
        </template>
      </el-popover>
    </div>

    <!-- 设置面板 -->
    <SettingsPanel v-model="showSettings" />
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { useFullscreen } from '@vueuse/core'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useSettingStore } from '@/store/modules/setting'
import { useUserStore } from '@/store/modules/user'
import { themeAnimation } from '@/utils/animation'
import ArtSvgIcon from '@/components/ArtSvgIcon.vue'
import SettingsPanel from '@/components/core/SettingsPanel.vue'

const userInfoStore = useUserStore()

const router = useRouter()
const route = useRoute()
const { locale, t } = useI18n()
const settingStore = useSettingStore()
const userStore = useUserStore()

// 面包屑导航
const breadcrumb = computed(() => {
  const meta = route.meta
  if (meta?.parent) {
    return `${meta.parent} / ${meta.title}`
  }
  return meta?.title || '首页'
})

const { menuOpen, isDark } = storeToRefs(settingStore)
const { userInfo } = storeToRefs(userStore)

const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

// 通知和消息数量（后续可从接口获取）
const noticeCount = ref(0)
const messageCount = ref(0)

const toggleSidebar = () => {
  settingStore.setMenuOpen(!menuOpen.value)
}

const toggleTheme = (e: MouseEvent) => {
  console.log('主题切换被点击', { isDark: isDark.value })
  themeAnimation(e)
  console.log('主题切换后', { isDark: isDark.value })
}

const changeLanguage = (lang: string) => {
  locale.value = lang
  userStore.setLanguage(lang)
  ElMessage.success('语言切换成功')
}

const handleSearch = () => {
  ElMessage.info('搜索功能开发中...')
}

const handleRefresh = () => {
  location.reload()
}

const showSettings = ref(false)

const openSettings = () => {
  showSettings.value = true
}

const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/user-center')
      break
    case 'docs':
      window.open('https://www.artd.pro/docs')
      break
    case 'github':
      window.open('https://github.com/Daymychen/art-design-pro')
      break
    case 'lock':
      ElMessage.info('锁屏功能开发中...')
      break
    case 'logout':
      ElMessageBox.confirm(
        t('common.logOutTips'),
        t('common.tips'),
        {
          confirmButtonText: t('common.confirm'),
          cancelButtonText: t('common.cancel'),
          type: 'warning'
        }
      ).then(() => {
        userStore.logout()
        ElMessage.success('退出成功')
      })
      break
  }
}
</script>

<style scoped lang="scss">
.header {
  height: 60px;
  background: var(--el-bg-color-page);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .menu-toggle {
      font-size: 20px;
      color: #7987a1;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: var(--el-color-primary);
      }
    }

    .header-icon {
      font-size: 20px;
      color: #7987a1;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: var(--el-color-primary);
      }
    }

    .refresh-btn {
      &:hover {
        animation: rotate180 0.5s;
      }
    }

    .header-text {
      font-size: 13px;
      color: rgba(107, 107, 107, 0.5);
      margin-left: 4px;
      font-weight: 400;
    }
  }

  // 暗色模式下的颜色
  html.dark & {
    .header-left {
      .menu-toggle,
      .header-icon {
        color: rgba(255, 255, 255, 0.65);
      }

      .header-text {
        color: rgba(255, 255, 255, 0.35);
      }
    }

    .header-right {
      .header-icon {
        color: rgba(255, 255, 255, 0.65);
      }

      .search-box {
        border-color: rgba(255, 255, 255, 0.13);

        &:hover {
          border-color: rgba(255, 255, 255, 0.25);
        }

        :deep(.art-svg-icon),
        > span {
          color: rgba(255, 255, 255, 0.45);
        }

        .shortcut {
          border-color: rgba(255, 255, 255, 0.13);

          :deep(.art-svg-icon),
          span {
            color: rgba(255, 255, 255, 0.45);
          }
        }
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;

    .search-box {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 10px;
      height: 34px;
      border: 1px solid rgba(107, 107, 107, 0.22);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        border-color: rgba(107, 107, 107, 0.35);
      }

      :deep(.art-svg-icon) {
        font-size: 14px;
        color: rgba(107, 107, 107, 0.5);
      }

      > span {
        font-size: 12px;
        font-weight: 400;
        color: rgba(107, 107, 107, 0.5);
      }

      .shortcut {
        display: flex;
        align-items: center;
        gap: 2px;
        padding: 2px 6px;
        height: 20px;
        background: transparent;
        border: 1px solid rgba(107, 107, 107, 0.22);
        border-radius: 4px;

        :deep(.art-svg-icon) {
          font-size: 12px;
          color: rgba(107, 107, 107, 0.5);
        }

        span {
          font-size: 12px;
          color: rgba(107, 107, 107, 0.5);
        }
      }
    }

    .header-icon {
      font-size: 20px;
      color: #7987a1;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: var(--el-color-primary);
      }
    }

    .notification-badge {
      :deep(.el-badge__content) {
        border: none;
        font-size: 10px;
        height: 16px;
        line-height: 16px;
        padding: 0 5px;
        min-width: 16px;
      }
    }

    .user-avatar {
      width: 34px;
      height: 34px;
      margin-right: 20px;
      border-radius: 50%;
      object-fit: cover;
      cursor: pointer;
    }
  }
}

// 图标动画效果
@keyframes rotate180 {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(180deg);
  }
}

@keyframes shake {
  0% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
  75% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(0);
  }
}

@keyframes expand {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes moveUp {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
  100% {
    transform: translateY(0);
  }
}

.language-btn:hover {
  animation: moveUp 0.4s;
}

.theme-toggle:hover {
  animation: rotate180 0.5s;
}

.setting-btn:hover {
  animation: rotate180 0.5s;
}

.full-screen-btn:hover {
  animation: expand 0.6s;
}

.notice-button:hover,
.chat-button:hover {
  animation: shake 0.5s ease-in-out;
}

.user-menu-content {
  padding: 12px 0;

  .user-info-header {
    display: flex;
    align-items: center;
    padding: 0 0 4px;

    .avatar-large {
      width: 40px;
      height: 40px;
      margin-right: 12px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-details {
      flex: 1;
      min-width: 0;

      .username {
        display: block;
        font-size: 14px;
        font-weight: 500;
        color: var(--el-text-color-primary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .email {
        display: block;
        margin-top: 2px;
        font-size: 12px;
        color: var(--el-text-color-secondary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .menu-list {
    padding: 16px 0;
    margin-top: 12px;
    border-top: 1px solid var(--el-border-color-lighter);
    list-style: none;

    .menu-item {
      display: flex;
      align-items: center;
      padding: 8px;
      margin-bottom: 12px;
      border-radius: 6px;
      cursor: pointer;
      user-select: none;
      transition: background 0.3s;

      &:last-of-type {
        margin-bottom: 0;
      }

      &:hover {
        background: var(--el-fill-color-light);
      }

      :deep(.art-svg-icon) {
        margin-right: 8px;
        font-size: 16px;
        color: var(--el-text-color-regular);
      }

      span {
        font-size: 14px;
        color: var(--el-text-color-primary);
      }
    }

    .divider {
      width: 100%;
      height: 1px;
      margin: 8px 0;
      background: var(--el-border-color-lighter);
    }

    .logout-btn {
      margin-top: 20px;
      padding: 6px 0;
      text-align: center;
      font-size: 12px;
      color: var(--el-text-color-regular);
      border: 1px solid var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>
