<template>
  <!-- 有子菜单 -->
  <el-sub-menu
    v-if="hasVisibleChildren"
    :index="item.path"
  >
    <template #title>
      <div class="menu-icon">
        <el-icon><component :is="item.meta?.icon" /></el-icon>
      </div>
      <span class="menu-name">{{ getMenuTitle(item) }}</span>
    </template>

    <SidebarMenuItem
      v-for="child in visibleChildren"
      :key="child.path"
      :item="child"
      :menu-open="menuOpen"
    />
  </el-sub-menu>

  <!-- 无子菜单 -->
  <el-menu-item
    v-else
    :index="item.path"
    @click="handleClick"
  >
    <div class="menu-icon">
      <el-icon><component :is="item.meta?.icon" /></el-icon>
    </div>
    <template #title>
      <span class="menu-name">{{ getMenuTitle(item) }}</span>
    </template>
  </el-menu-item>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { RouteRecordRaw } from 'vue-router'

interface Props {
  item: RouteRecordRaw
  menuOpen: boolean
}

const props = defineProps<Props>()

const router = useRouter()
const { t } = useI18n()

// 获取可见的子菜单
const visibleChildren = computed(() => {
  if (!props.item.children) return []
  return props.item.children.filter(child => !child.meta?.isHide)
})

// 是否有可见的子菜单
const hasVisibleChildren = computed(() => {
  return visibleChildren.value.length > 0
})

// 获取菜单标题
const getMenuTitle = (item: RouteRecordRaw) => {
  const name = item.name?.toString().toLowerCase() || ''
  return t(`menus.${name}`)
}

// 处理点击事件
const handleClick = () => {
  // 如果是外部链接
  if (props.item.meta?.link) {
    window.open(props.item.meta.link as string, '_blank')
    return
  }

  // 内部路由跳转
  router.push(props.item.path)
}
</script>

<style scoped lang="scss">
.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  font-size: 20px;
}

.menu-name {
  font-size: 14px;
}
</style>
