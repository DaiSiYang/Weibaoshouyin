<template>
  <div class="art-table-container" :class="{ 'is-empty': isEmpty }">
    <!-- 顶部操作栏 -->
    <div class="table-header">
      <div class="header-left">
        <slot name="header-left" />
      </div>
      <div class="header-right">
        <el-tooltip v-if="showSearch" content="搜索" placement="top">
          <div class="header-btn" :class="{ active: searchVisible }" @click="searchVisible = !searchVisible">
            <el-icon><Search /></el-icon>
          </div>
        </el-tooltip>
        <el-tooltip content="刷新" placement="top">
          <div class="header-btn" :class="{ loading: refreshing }" @click="handleRefresh">
            <el-icon :class="{ 'is-loading': refreshing }"><Refresh /></el-icon>
          </div>
        </el-tooltip>
        <el-tooltip content="密度" placement="top">
          <el-dropdown trigger="click" @command="handleSizeCommand">
            <div class="header-btn">
              <el-icon><DCaret /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="small" :class="{ 'is-active': tableSize === 'small' }">紧凑</el-dropdown-item>
                <el-dropdown-item command="default" :class="{ 'is-active': tableSize === 'default' }">默认</el-dropdown-item>
                <el-dropdown-item command="large" :class="{ 'is-active': tableSize === 'large' }">宽松</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-tooltip>
        <el-tooltip content="全屏" placement="top">
          <div class="header-btn" @click="toggleFullscreen">
            <el-icon><FullScreen /></el-icon>
          </div>
        </el-tooltip>
        <el-tooltip content="列设置" placement="top">
          <el-popover placement="bottom-end" trigger="click" :width="180">
            <template #reference>
              <div class="header-btn">
                <el-icon><Setting /></el-icon>
              </div>
            </template>
            <div class="column-settings">
              <el-scrollbar max-height="300px">
                <div
                  v-for="col in columnChecks"
                  :key="col.prop"
                  class="column-item"
                >
                  <el-checkbox
                    :model-value="col.visible"
                    @update:model-value="(val) => toggleColumnVisible(col.prop!, val as boolean)"
                  >
                    {{ col.label }}
                  </el-checkbox>
                </div>
              </el-scrollbar>
            </div>
          </el-popover>
        </el-tooltip>
      </div>
    </div>

    <!-- 搜索栏 -->
    <transition name="slide-fade">
      <div v-if="showSearch" v-show="searchVisible" class="search-bar">
        <slot name="search" />
      </div>
    </transition>

    <!-- 表格 -->
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="data"
      :stripe="stripe"
      :border="border"
      :size="tableSize"
      :height="tableHeight"
      :header-cell-style="headerCellStyle"
      style="width: 100%"
      v-bind="$attrs"
    >
      <!-- 通过 columns 配置渲染列 -->
      <template v-for="col in visibleColumns" :key="col.prop || col.type">
        <!-- 序号/选择/展开列 -->
        <el-table-column
          v-if="col.type"
          :type="col.type"
          :label="col.label"
          :width="col.width"
          :fixed="col.fixed"
          :align="col.align || 'center'"
        />
        <!-- 普通列 -->
        <el-table-column v-else v-bind="getColumnProps(col)">
          <!-- 自定义表头插槽 -->
          <template v-if="col.headerSlot" #header="scope">
            <slot :name="`header-${col.prop}`" v-bind="scope">
              {{ col.label }}
            </slot>
          </template>

          <!-- 自定义内容插槽 -->
          <template #default="scope">
            <!-- 使用 formatter 函数 -->
            <component
              v-if="col.formatter"
              :is="col.formatter(scope.row, scope.column, scope.$index)"
            />
            <!-- 使用插槽 -->
            <slot
              v-else-if="col.slot"
              :name="col.prop"
              v-bind="{ ...scope, value: scope.row[col.prop!] }"
            >
              {{ scope.row[col.prop!] }}
            </slot>
            <!-- 默认渲染 -->
            <span v-else>{{ scope.row[col.prop!] }}</span>
          </template>
        </el-table-column>
      </template>

      <!-- 空状态 -->
      <template #empty>
        <el-empty v-if="!loading" description="暂无数据" :image-size="100" />
      </template>

      <!-- 兼容旧的插槽方式 -->
      <slot />
    </el-table>

    <!-- 分页 -->
    <div v-if="showPagination && total > 0" class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPageModel"
        v-model:page-size="pageSizeModel"
        :page-sizes="pageSizes"
        :total="total"
        :disabled="loading"
        :background="true"
        layout="total, prev, pager, next, sizes, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, type VNode } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { Search, Refresh, FullScreen, Setting, DCaret } from '@element-plus/icons-vue'

defineOptions({ name: 'ArtTable' })

// 列配置类型
export interface TableColumn {
  prop?: string
  label: string
  type?: 'index' | 'selection' | 'expand'
  width?: number | string
  minWidth?: number | string
  fixed?: 'left' | 'right' | boolean
  sortable?: boolean | 'custom'
  showOverflowTooltip?: boolean
  align?: 'left' | 'center' | 'right'
  formatter?: (row: any, column?: any, index?: number) => VNode | string
  slot?: boolean
  headerSlot?: boolean
  visible?: boolean
  disabled?: boolean
}

interface Props {
  data: any[]
  columns?: TableColumn[]
  loading?: boolean
  total?: number
  currentPage?: number
  pageSize?: number
  pageSizes?: number[]
  showPagination?: boolean
  showSearch?: boolean
  stripe?: boolean
  border?: boolean
  height?: string | number
  headerBackground?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  columns: () => [],
  loading: false,
  total: 0,
  currentPage: 1,
  pageSize: 20,
  pageSizes: () => [10, 20, 50, 100],
  showPagination: true,
  showSearch: true,
  stripe: false,
  border: false,
  height: undefined,
  headerBackground: true
})

const emit = defineEmits<{
  'update:currentPage': [value: number]
  'update:pageSize': [value: number]
  'update:columns': [value: TableColumn[]]
  refresh: []
  'size-change': [value: number]
  'current-change': [value: number]
}>()

const tableRef = ref()
const searchVisible = ref(false)
const refreshing = ref(false)
const tableSize = ref<'small' | 'default' | 'large'>('default')

// 全屏
const { toggle: toggleFullscreen } = useFullscreen()

// 表格高度
const tableHeight = computed(() => props.height)

// 是否为空
const isEmpty = computed(() => !props.data || props.data.length === 0)

// 表头样式
const headerCellStyle = computed(() => ({
  background: 'transparent',
  fontWeight: 600
}))

// 列设置状态
const columnVisibility = ref<Record<string, boolean>>({})

// 初始化列可见状态
const initColumnVisibility = () => {
  props.columns.forEach((col) => {
    const key = col.prop || col.type || ''
    if (key && columnVisibility.value[key] === undefined) {
      columnVisibility.value[key] = col.visible !== false
    }
  })
}

watch(
  () => props.columns,
  () => {
    initColumnVisibility()
  },
  { immediate: true }
)

// 列设置（带 visible 状态，排除 type 列）
const columnChecks = computed(() => {
  return props.columns
    .filter((col) => col.prop)
    .map((col) => ({
      ...col,
      visible: columnVisibility.value[col.prop!] ?? true
    }))
})

// 切换列可见状态
const toggleColumnVisible = (prop: string, visible: boolean) => {
  columnVisibility.value[prop] = visible
}

// 可见列
const visibleColumns = computed(() => {
  return props.columns.filter((col) => {
    const key = col.prop || col.type || ''
    return columnVisibility.value[key] !== false
  })
})

// 获取列属性
const getColumnProps = (col: TableColumn) => {
  const { formatter, slot, headerSlot, visible, disabled, ...rest } = col
  return rest
}

// 刷新
const handleRefresh = () => {
  refreshing.value = true
  emit('refresh')
  setTimeout(() => {
    refreshing.value = false
  }, 500)
}

// 表格密度
const handleSizeCommand = (command: 'small' | 'default' | 'large') => {
  tableSize.value = command
}

// 分页双向绑定
const currentPageModel = computed({
  get: () => props.currentPage,
  set: (val) => emit('update:currentPage', val)
})

const pageSizeModel = computed({
  get: () => props.pageSize,
  set: (val) => emit('update:pageSize', val)
})

const handleSizeChange = (val: number) => {
  emit('size-change', val)
}

const handleCurrentChange = (val: number) => {
  emit('current-change', val)
}

// 暴露方法
defineExpose({
  tableRef
})
</script>

<style lang="scss" scoped>
.art-table-container {
  height: 100%;
  display: flex;
  flex-direction: column;

  &.is-empty {
    :deep(.el-scrollbar__wrap) {
      display: flex;
    }
  }
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 12px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.header-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-regular);
  transition: all 0.2s;

  &:hover {
    background: var(--el-fill-color);
    color: var(--el-color-primary);
  }

  &.active {
    background: var(--el-color-primary);
    color: #fff;

    &:hover {
      background: var(--el-color-primary-light-3);
    }
  }

  &.loading .el-icon {
    animation: none;
  }

  .is-loading {
    animation: rotating 1s linear infinite;
  }
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.search-bar {
  padding: 16px;
  margin-bottom: 12px;
  background: var(--el-fill-color-lighter);
  border-radius: 8px;

  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.column-settings {
  .column-item {
    padding: 6px 0;

    &:first-child {
      padding-top: 0;
    }

    &:last-child {
      padding-bottom: 0;
    }

    :deep(.el-checkbox__label) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;

  :deep(.el-pagination) {
    .btn-prev,
    .btn-next {
      background-color: transparent;
      border: 1px solid var(--el-border-color);
      transition: border-color 0.15s;

      &:hover:not(:disabled) {
        color: var(--el-color-primary);
        border-color: var(--el-color-primary);
      }
    }

    .el-pager li {
      background-color: transparent;
      border: 1px solid var(--el-border-color);
      transition: border-color 0.15s;

      &.is-active {
        color: #fff;
        background-color: var(--el-color-primary);
        border-color: var(--el-color-primary);
      }

      &:hover:not(.is-active) {
        border-color: var(--el-color-primary);
      }
    }
  }
}

:deep(.el-table) {
  flex: 1;
  border-radius: 8px;

  .el-table__header th {
    font-weight: 500;
  }

  .el-table__empty-block {
    min-height: 200px;
  }
}

:deep(.el-loading-mask) {
  background-color: var(--el-bg-color);
  z-index: 10;
}

// 下拉菜单激活状态
:deep(.el-dropdown-menu__item.is-active) {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>
