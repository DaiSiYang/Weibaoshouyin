<template>
  <div class="art-table-container">
    <!-- 顶部操作栏 -->
    <div class="table-header">
      <div class="header-left">
        <slot name="header-left" />
      </div>
      <div class="header-right">
        <el-tooltip v-if="showSearch" content="搜索" placement="top">
          <el-button :icon="Search" circle @click="searchVisible = !searchVisible" />
        </el-tooltip>
        <el-tooltip content="刷新" placement="top">
          <el-button :icon="Refresh" circle @click="$emit('refresh')" />
        </el-tooltip>
        <el-tooltip content="全屏" placement="top">
          <el-button :icon="FullScreen" circle @click="toggleFullscreen" />
        </el-tooltip>
        <el-tooltip content="列设置" placement="top">
          <el-popover placement="bottom" trigger="click" :width="200">
            <template #reference>
              <el-button :icon="Operation" circle />
            </template>
            <div class="column-settings">
              <div
                v-for="col in columnChecks"
                :key="col.prop"
                class="column-item"
              >
                <el-checkbox
                  v-model="col.visible"
                  :label="col.label"
                />
              </div>
            </div>
          </el-popover>
        </el-tooltip>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div v-if="showSearch" v-show="searchVisible" class="search-bar">
      <slot name="search" />
    </div>

    <!-- 表格 -->
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="data"
      :stripe="stripe"
      :border="border"
      :height="tableHeight"
      style="width: 100%"
      v-bind="$attrs"
    >
      <!-- 通过 columns 配置渲染列 -->
      <template v-for="col in visibleColumns" :key="col.prop">
        <el-table-column
          v-bind="getColumnProps(col)"
        >
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
              v-bind="{ ...scope, value: scope.row[col.prop] }"
            >
              {{ scope.row[col.prop] }}
            </slot>
            <!-- 默认渲染 -->
            <span v-else>{{ scope.row[col.prop] }}</span>
          </template>
        </el-table-column>
      </template>

      <!-- 兼容旧的插槽方式 -->
      <slot />
    </el-table>

    <!-- 分页 -->
    <div v-if="showPagination && total > 0" class="pagination-wrapper">
      <span class="total">共 {{ total }} 条</span>
      <el-pagination
        v-model:current-page="currentPageModel"
        v-model:page-size="pageSizeModel"
        :page-sizes="pageSizes"
        :total="total"
        layout="prev, pager, next, sizes, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type VNode } from 'vue'
import { useFullscreen } from '@vueuse/core'
import {
  Search,
  Refresh,
  FullScreen,
  Operation
} from '@element-plus/icons-vue'

defineOptions({ name: 'ArtTable' })

// 列配置类型
export interface TableColumn {
  prop: string
  label: string
  width?: number | string
  minWidth?: number | string
  fixed?: 'left' | 'right' | boolean
  sortable?: boolean | 'custom'
  showOverflowTooltip?: boolean
  align?: 'left' | 'center' | 'right'
  // 自定义渲染函数
  formatter?: (row: any, column?: any, index?: number) => VNode | string
  // 使用插槽
  slot?: boolean
  // 表头插槽
  headerSlot?: boolean
  // 是否显示（用于列设置）
  visible?: boolean
  // 是否禁用切换
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
  stripe: true,
  border: false,
  height: undefined
})

const emit = defineEmits<{
  'update:currentPage': [value: number]
  'update:pageSize': [value: number]
  'update:columns': [value: TableColumn[]]
  'refresh': []
  'size-change': [value: number]
  'current-change': [value: number]
}>()

const tableRef = ref()
const searchVisible = ref(false)

// 全屏
const { toggle: toggleFullscreen } = useFullscreen()

// 表格高度
const tableHeight = computed(() => props.height)

// 列设置（带 visible 状态）
const columnChecks = computed(() => {
  return props.columns.map(col => ({
    ...col,
    visible: col.visible !== false
  }))
})

// 可见列
const visibleColumns = computed(() => {
  return columnChecks.value.filter(col => col.visible !== false)
})

// 获取列属性（过滤掉自定义属性）
const getColumnProps = (col: TableColumn) => {
  const { formatter, slot, headerSlot, visible, disabled, ...rest } = col
  return rest
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
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .header-left {
    display: flex;
    gap: 12px;
  }

  .header-right {
    display: flex;
    gap: 8px;

    .el-button {
      border: none;
      background: var(--el-fill-color-light);

      &:hover {
        background: var(--el-fill-color);
      }
    }
  }
}

.search-bar {
  padding: 16px;
  margin-bottom: 16px;
  background: var(--el-fill-color-lighter);
  border-radius: 8px;

  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}

.column-settings {
  .column-item {
    padding: 4px 0;
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);

  .total {
    margin-right: 16px;
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }
}

:deep(.el-table) {
  flex: 1;

  .el-table__header th {
    background: var(--el-fill-color-lighter) !important;
    font-weight: 500;
  }
}
</style>
