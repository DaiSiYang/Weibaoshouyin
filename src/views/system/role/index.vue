<template>
  <div class="page-container">
    <!-- 搜索栏 -->
    <el-card v-show="showSearch" shadow="never" class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="角色名称">
          <el-input v-model="searchForm.name" placeholder="请输入角色名称" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="角色编号">
          <el-input v-model="searchForm.key" placeholder="请输入角色编号" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable style="width: 120px">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="resetSearch">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card shadow="never" class="table-card">
      <ArtTable
        :data="tableData"
        :columns="columns"
        :loading="loading"
        :total="total"
        :show-search="false"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        @refresh="fetchData"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #header-left>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增角色
          </el-button>
        </template>

        <template #header-right-extra>
          <el-tooltip content="搜索" placement="top">
            <div class="header-btn" :class="{ active: showSearch }" @click="showSearch = !showSearch">
              <el-icon><Search /></el-icon>
            </div>
          </el-tooltip>
        </template>

        <template #status="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>

        <template #operation="{ row }">
          <el-dropdown trigger="click">
            <el-button link>
              <el-icon><MoreFilled /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handlePermission(row)">
                  <el-icon><Setting /></el-icon>
                  菜单权限
                </el-dropdown-item>
                <el-dropdown-item @click="handleEdit(row)">
                  <el-icon><Edit /></el-icon>
                  编辑角色
                </el-dropdown-item>
                <el-dropdown-item @click="handleDelete(row)" style="color: #f56c6c">
                  <el-icon><Delete /></el-icon>
                  删除角色
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </ArtTable>
    </el-card>

    <ArtFormDialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增角色' : '编辑角色'"
      :fields="formFields"
      :rules="rules"
      :data="formData"
      :loading="submitLoading"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormRules } from 'element-plus'
import { Plus, MoreFilled, Setting, Edit, Delete, Search, Refresh } from '@element-plus/icons-vue'
import ArtTable, { type TableColumn } from '@/components/core/ArtTable.vue'
import ArtFormDialog, { type FormField } from '@/components/core/ArtFormDialog.vue'
import { getRoleList, editRole, deleteRole, type RoleItem } from '@/api/role'

defineOptions({ name: 'Role' })

const showSearch = ref(false)

const columns: TableColumn[] = [
  { type: 'index', label: '序号', width: 60 },
  { prop: 'name', label: '角色名称', minWidth: 120 },
  { prop: 'key', label: '角色编号', minWidth: 120 },
  { prop: 'remark', label: '作用描述', minWidth: 180, showOverflowTooltip: true },
  { prop: 'status', label: '使用状态', width: 100, slot: true },
  { prop: 'created_time', label: '创建时间', width: 170 },
  { prop: 'updated_time', label: '更新时间', width: 170 },
  { prop: 'operation', label: '其他操作', width: 80, fixed: 'right', slot: true }
]

const searchForm = reactive({ name: '', key: '', status: undefined as number | undefined })
const loading = ref(false)
const tableData = ref<RoleItem[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)

const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const submitLoading = ref(false)
const formData = ref<Record<string, any>>({})

const formFields: FormField[] = [
  { prop: 'name', label: '角色名称', type: 'input' },
  { prop: 'key', label: '角色编号', type: 'input' },
  { prop: 'remark', label: '作用描述', type: 'textarea', rows: 3 },
  { prop: 'status', label: '启用状态', type: 'radio', options: [{ label: '启用', value: 1 }, { label: '禁用', value: 2 }] }
]

const rules: FormRules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  key: [{ required: true, message: '请输入角色编号', trigger: 'blur' }]
}

const fetchData = async () => {
  loading.value = true
  const params: Record<string, any> = { page: currentPage.value, page_size: pageSize.value }
  if (searchForm.name) params.name = searchForm.name
  if (searchForm.key) params.key = searchForm.key
  if (searchForm.status !== undefined) params.status = searchForm.status
  
  try {
    const res = await getRoleList(params)
    tableData.value = res.list || []
    total.value = res.total_count || 0
  } catch (error) {
    console.error('[角色管理] 获取列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { currentPage.value = 1; fetchData() }
const resetSearch = () => {
  searchForm.name = ''
  searchForm.key = ''
  searchForm.status = undefined
  handleSearch()
}
const handleSizeChange = () => fetchData()
const handleCurrentChange = () => fetchData()

const handleAdd = () => {
  dialogType.value = 'add'
  formData.value = { name: '', key: '', remark: '', status: 1 }
  dialogVisible.value = true
}

const handleEdit = (row: RoleItem) => {
  dialogType.value = 'edit'
  formData.value = { ...row }
  dialogVisible.value = true
}

const handleSubmit = async (data: Record<string, any>) => {
  submitLoading.value = true
  const params: Record<string, any> = { name: data.name, key: data.key, remark: data.remark, status: data.status }
  if (dialogType.value === 'edit' && data.id) params.id = data.id
  
  try {
    await editRole(params)
    ElMessage.success(dialogType.value === 'add' ? '新增成功' : '编辑成功')
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error('[角色管理] 操作失败:', error)
  } finally {
    submitLoading.value = false
  }
}

const handlePermission = (row: RoleItem) => {
  ElMessage.info(`配置角色"${row.name}"的菜单权限`)
}

const handleDelete = (row: RoleItem) => {
  ElMessageBox.confirm(`确定删除角色"${row.name}"吗？`, '删除确认', {
    confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
  }).then(async () => {
    try {
      await deleteRole(row.id)
      ElMessage.success('删除成功')
      fetchData()
    } catch (error) {
      console.error('[角色管理] 删除失败:', error)
    }
  }).catch(() => {})
}

onMounted(() => fetchData())
</script>

<style lang="scss" scoped>
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-card {
  flex-shrink: 0;
  :deep(.el-card__body) { padding: 16px 16px 0; }
  :deep(.el-form-item) { margin-bottom: 16px; }
}

.table-card {
  flex: 1;
  min-height: 0;
  :deep(.el-card__body) { height: 100%; padding: 16px; }
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

  &:hover { background: var(--el-fill-color); color: var(--el-color-primary); }
  &.active { background: var(--el-color-primary); color: #fff; }
}

:deep(.el-dropdown-menu__item) { display: flex; align-items: center; gap: 8px; }
</style>
