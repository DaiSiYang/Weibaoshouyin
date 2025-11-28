<template>
  <div class="work-tab" :class="[`tab-style-${tabStyle}`]">
    <div class="tab-scroll" ref="scrollRef" @wheel.prevent="handleWheel">
      <ul
        class="tab-list"
        ref="tabListRef"
        :style="{
          transform: `translateX(${translateX}px)`,
          transition: transition
        }"
      >
        <li
          v-for="(tab, index) in tabs"
          :key="tab.path"
          :id="`tab-item-${index}`"
          class="tab-item"
          :class="{ active: tab.path === activeTab }"
          @click="handleClick(tab)"
          @contextmenu.prevent="showContextMenu($event, tab)"
        >
          <!-- 谷歌风格左侧分隔线 -->
          <div v-if="tabStyle === 'google'" class="tab-divider" />
          
          <el-icon v-if="tab.icon" class="tab-icon">
            <component :is="tab.icon" />
          </el-icon>
          <span class="tab-title">{{ tab.title }}</span>
          <span
            v-if="tab.closable !== false && tabs.length > 1"
            class="tab-close"
            @click.stop="handleClose(tab.path)"
          >
            <el-icon><Close /></el-icon>
          </span>
        </li>
      </ul>
    </div>

    <!-- 下拉菜单按钮 -->
    <el-dropdown trigger="click" @command="handleCommand">
      <div class="tab-action">
        <el-icon><ArrowDown /></el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="refresh">
            <el-icon><Refresh /></el-icon>
            刷新当前
          </el-dropdown-item>
          <el-dropdown-item divided command="closeLeft" :disabled="!canCloseLeft">
            <el-icon><DArrowLeft /></el-icon>
            关闭左侧
          </el-dropdown-item>
          <el-dropdown-item command="closeRight" :disabled="!canCloseRight">
            <el-icon><DArrowRight /></el-icon>
            关闭右侧
          </el-dropdown-item>
          <el-dropdown-item command="closeOther" :disabled="closableTabs.length <= 1">
            <el-icon><Close /></el-icon>
            关闭其他
          </el-dropdown-item>
          <el-dropdown-item command="closeAll" :disabled="closableTabs.length === 0">
            <el-icon><CircleClose /></el-icon>
            关闭全部
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  Close,
  ArrowDown,
  Refresh,
  DArrowLeft,
  DArrowRight,
  CircleClose
} from '@element-plus/icons-vue'
import { useWorktabStore, type WorkTab } from '@/store/modules/worktab'
import { useSettingStore } from '@/store/modules/setting'

const route = useRoute()
const router = useRouter()
const worktabStore = useWorktabStore()
const settingStore = useSettingStore()
const { tabs, activeTab } = storeToRefs(worktabStore)
const { tabStyle } = storeToRefs(settingStore)

const scrollRef = ref<HTMLElement>()
const tabListRef = ref<HTMLElement>()
const translateX = ref(0)
const transition = ref('')

// 可关闭的标签
const closableTabs = computed(() => tabs.value.filter((t) => t.closable !== false))

// 计算是否可以关闭左侧/右侧
const currentIndex = computed(() => tabs.value.findIndex((t) => t.path === activeTab.value))
const canCloseLeft = computed(() => {
  return tabs.value.slice(0, currentIndex.value).some((t) => t.closable !== false)
})
const canCloseRight = computed(() => {
  return tabs.value.slice(currentIndex.value + 1).some((t) => t.closable !== false)
})

// 滚轮滚动
const handleWheel = (e: WheelEvent) => {
  if (!scrollRef.value || !tabListRef.value) return
  
  const scrollWidth = scrollRef.value.offsetWidth
  const listWidth = tabListRef.value.offsetWidth
  
  if (listWidth <= scrollWidth) return
  
  const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
  const xMin = scrollWidth - listWidth
  
  translateX.value = Math.min(Math.max(translateX.value - delta, xMin), 0)
}

// 自动滚动到当前激活的标签
const scrollToActiveTab = () => {
  nextTick(() => {
    if (!scrollRef.value || !tabListRef.value) return
    
    const activeEl = document.getElementById(`tab-item-${currentIndex.value}`)
    if (!activeEl) return
    
    const scrollWidth = scrollRef.value.offsetWidth
    const listWidth = tabListRef.value.offsetWidth
    const { offsetLeft, clientWidth } = activeEl
    const tabRight = offsetLeft + clientWidth
    
    transition.value = 'transform 0.3s ease'
    setTimeout(() => { transition.value = '' }, 300)
    
    if (tabRight > scrollWidth + Math.abs(translateX.value)) {
      translateX.value = Math.max(scrollWidth - tabRight - 10, scrollWidth - listWidth)
    } else if (offsetLeft < Math.abs(translateX.value)) {
      translateX.value = -offsetLeft
    }
  })
}

// 点击标签
const handleClick = (tab: WorkTab) => {
  if (tab.path !== activeTab.value) {
    worktabStore.setActiveTab(tab.path)
    router.push({ path: tab.path, query: tab.query })
  }
}

// 关闭标签
const handleClose = (path: string) => {
  worktabStore.removeTab(path)
  nextTick(() => {
    // 关闭后调整滚动位置
    if (scrollRef.value && tabListRef.value) {
      const scrollWidth = scrollRef.value.offsetWidth
      const listWidth = tabListRef.value.offsetWidth
      if (listWidth <= scrollWidth) {
        translateX.value = 0
      } else if (Math.abs(translateX.value) > listWidth - scrollWidth) {
        translateX.value = scrollWidth - listWidth
      }
    }
  })
}

// 右键菜单（预留）
const showContextMenu = (_e: MouseEvent, _tab: WorkTab) => {}

// 下拉菜单命令
const handleCommand = (command: string) => {
  switch (command) {
    case 'refresh':
      router.go(0)
      break
    case 'closeLeft':
      worktabStore.removeLeft(activeTab.value)
      break
    case 'closeRight':
      worktabStore.removeRight(activeTab.value)
      break
    case 'closeOther':
      worktabStore.removeOthers(activeTab.value)
      break
    case 'closeAll':
      worktabStore.removeAll()
      break
  }
}

// 监听路由变化，自动添加标签
watch(
  () => route.path,
  (path) => {
    if (path && route.meta?.title) {
      worktabStore.addTab({
        path,
        title: route.meta.title as string,
        icon: route.meta.icon as string,
        query: route.query as Record<string, any>
      })
      scrollToActiveTab()
    }
  },
  { immediate: true }
)

onMounted(() => {
  scrollToActiveTab()
})
</script>

<style lang="scss" scoped>
.work-tab {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 16px;
  gap: 8px;
  user-select: none;
}

.tab-scroll {
  flex: 1;
  overflow: hidden;
}

.tab-list {
  display: flex;
  align-items: center;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
  white-space: nowrap;
}

.tab-item {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 8px 0 12px;
  font-size: 13px;
  color: var(--el-text-color-regular);
  background: var(--el-fill-color-light);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);

    .tab-close {
      opacity: 1;
    }
  }

  &.active {
    color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
    font-weight: 500;

    .tab-close {
      opacity: 1;
    }
  }

  .tab-icon {
    font-size: 14px;
    margin-right: 4px;
  }

  .tab-title {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tab-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    margin-left: 4px;
    font-size: 10px;
    border-radius: 50%;
    opacity: 0;
    transition: all 0.15s;

    &:hover {
      background: var(--el-color-primary);
      color: #fff;
    }
  }
}

.tab-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-light);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
  }
}

// ========== 卡片风格 ==========
.tab-style-card {
  .tab-item {
    border: 1px solid var(--el-border-color-lighter);

    &:hover {
      border-color: var(--el-color-primary-light-5);
    }

    &.active {
      border-color: var(--el-color-primary);
    }
  }

  .tab-action {
    border: 1px solid var(--el-border-color-lighter);

    &:hover {
      border-color: var(--el-color-primary-light-5);
    }
  }
}

// ========== 谷歌风格 ==========
.tab-style-google {
  padding-bottom: 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
  
  .tab-list {
    gap: 0;
  }

  .tab-item {
    height: 34px;
    background: transparent;
    border-radius: 8px 8px 0 0;
    margin-right: 2px;

    .tab-divider {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 1px;
      height: 16px;
      background: var(--el-border-color);
      transition: opacity 0.15s;
    }

    &:first-child .tab-divider,
    &:hover .tab-divider,
    &.active .tab-divider {
      opacity: 0;
    }

    &:hover + .tab-item .tab-divider,
    &.active + .tab-item .tab-divider {
      opacity: 0;
    }

    &:hover {
      background: var(--el-fill-color-light);
    }

    &.active {
      background: var(--el-color-primary-light-9);
      
      &::before,
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        box-shadow: 0 0 0 20px var(--el-color-primary-light-9);
      }

      &::before {
        left: -10px;
        clip-path: inset(50% -5px 0 50%);
      }

      &::after {
        right: -10px;
        clip-path: inset(50% 50% 0 -5px);
      }
    }
  }

  .tab-action {
    margin-bottom: 6px;
  }
}

// ========== 简约风格 ==========
.tab-style-simple {
  border-bottom: 1px solid var(--el-border-color-lighter);
  
  .tab-item {
    background: transparent;
    border-radius: 0;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;

    &:hover {
      background: transparent;
      border-bottom-color: var(--el-color-primary-light-5);
    }

    &.active {
      background: transparent;
      border-bottom-color: var(--el-color-primary);
    }
  }
}

// ========== 暗色模式 ==========
.dark {
  .tab-item {
    &:hover,
    &.active {
      background: var(--el-color-primary-dark-2);
    }

    .tab-close:hover {
      background: var(--el-color-primary);
    }
  }

  .tab-action {
    &:hover {
      background: var(--el-color-primary-dark-2);
    }
  }

  .tab-style-google .tab-item.active {
    background: var(--el-color-primary-dark-2);

    &::before,
    &::after {
      box-shadow: 0 0 0 20px var(--el-color-primary-dark-2);
    }
  }
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;

  .el-icon {
    font-size: 14px;
  }
}
</style>
