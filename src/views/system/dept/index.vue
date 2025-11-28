<template>
  <div class="dept-container">
    <el-card shadow="never" class="dept-card">
      <ArtTable
        :data="tableData"
        :columns="columns"
        :loading="loading"
        :total="total"
        :show-pagination="false"
        @refresh="fetchData"
      >
        <!-- 左侧按钮 -->
        <template #header-left>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增部门
          </el-button>
        </template>

        <!-- 搜索栏 -->
        <template #search>
          <el-form :model="searchForm" inline>
            <el-form-item label="部门名称">
              <el-input v-model="searchForm.name" placeholder="请输入部门名称" clearable />
            </el-form-item>
            <el-form-item label="部门编号">
              <el-input v-model="searchForm.code" placeholder="请输入部门编号" clearable />
            </el-form-item>
            <el-form-item label="使用状态">
              <el-select v-model="searchForm.status" placeholder="请选择" clearable style="width: 120px">
                <el-option label="启用" :value="1" />
                <el-option label="禁用" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </template>

        <!-- 状态列插槽 -->
        <template #status="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>

        <!-- 操作列插槽 -->
        <template #operation="{ row }">
          <el-dropdown trigger="click">
            <el-button link>
              <el-icon><MoreFilled /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleEdit(row)">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-dropdown-item>
                <el-dropdown-item @click="handleDelete(row)" style="color: #f56c6c">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </ArtTable>
    </el-card>

    <!-- 使用通用表单弹窗组件 -->
    <ArtFormDialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增部门' : '编辑部门'"
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
import { Plus, MoreFilled, Edit, Delete } from '@element-plus/icons-vue'
import ArtTable, { type TableColumn } from '@/components/core/ArtTable.vue'
import ArtFormDialog, { type FormField } from '@/components/core/ArtFormDialog.vue'
import { getDeptList, editDept, deleteDept, type DeptItem } from '@/api/dept'

defineOptions({ name: 'Dept' })

// 表格列配置
const columns: TableColumn[] = [
  { prop: 'name', label: '部门名称', minWidth: 120 },
  { prop: 'code', label: '部门编号', minWidth: 120 },
  { prop: 'remark', label: '作用描述', minWidth: 180, showOverflowTooltip: true },
  { prop: 'status', label: '使用状态', width: 100, slot: true },
  { prop: 'created_time', label: '创建时间', width: 170 },
  { prop: 'updated_time', label: '更新时间', width: 170 },
  { prop: 'operation', label: '其他操作', width: 80, fixed: 'right', slot: true }
]

// 搜索
const searchForm = reactive({
  name: '',
  code: '',
  status: undefined as number | undefined
})

// 表格
const loading = ref(false)
const tableData = ref<DeptItem[]>([])
const total = ref(0)

// 弹窗
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const submitLoading = ref(false)
const formData = ref<Record<string, any>>({})

// 表单字段配置
const formFields: FormField[] = [
  { prop: 'name', label: '部门名称', type: 'input' },
  { prop: 'code', label: '部门编号', type: 'input' },
  { prop: 'remark', label: '作用描述', type: 'textarea', rows: 3 },
  {
    prop: 'status',
    label: '启用状态',
    type: 'radio',
    options: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 2 }
    ]
  }
]

// 表单校验规则
const rules: FormRules = {
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入部门编号', trigger: 'blur' }]
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  const params: Record<string, any> = {}
  if (searchForm.name) params.name = searchForm.name
  if (searchForm.code) params.code = searchForm.code
  if (searchForm.status !== undefined) params.status = searchForm.status

  console.log('[部门管理] 获取列表 - 请求参数:', params)
  try {
    const res = await getDeptList(params)
    console.log('[部门管理] 获取列表 - 响应数据:', res)
    tableData.value = res.list || []
    total.value = res.list?.length || 0
  } catch (error) {
    console.error('[部门管理] 获取列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  fetchData()
}

const resetSearch = () => {
  searchForm.name = ''
  searchForm.code = ''
  searchForm.status = undefined
  fetchData()
}

// 新增
const handleAdd = () => {
  dialogType.value = 'add'
  formData.value = {
    name: '',
    code: '',
    remark: '',
    status: 1
  }
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: DeptItem) => {
  dialogType.value = 'edit'
  formData.value = { ...row }
  dialogVisible.value = true
}

// 提交
const handleSubmit = async (data: Record<string, any>) => {
  submitLoading.value = true
  const params: Record<string, any> = {
    name: data.name,
    code: data.code,
    remark: data.remark,
    status: data.status
  }
  if (dialogType.value === 'edit' && data.id) {
    params.id = data.id
  }
  const action = dialogType.value === 'add' ? '新增' : '编辑'
  console.log(`[部门管理] ${action}部门 - 请求参数:`, params)
  try {
    const res = await editDept(params)
    console.log(`[部门管理] ${action}部门 - 响应数据:`, res)
    ElMessage.success(`${action}成功`)
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error(`[部门管理] ${action}部门失败:`, error)
  } finally {
    submitLoading.value = false
  }
}

// 删除
const handleDelete = (row: DeptItem) => {
  ElMessageBox.confirm(`确定删除部门"${row.name}"吗？`, '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      console.log('[部门管理] 删除部门 - 请求参数:', { id: row.id })
      try {
        const res = await deleteDept(row.id)
        console.log('[部门管理] 删除部门 - 响应数据:', res)
        ElMessage.success('删除成功')
        fetchData()
      } catch (error) {
        console.error('[部门管理] 删除部门失败:', error)
      }
    })
    .catch(() => {})
}

onMounted(() => fetchData())
</script>

<style lang="scss" scoped>
.dept-container {
  height: 100%;
}

.dept-card {
  height: 100%;

  :deep(.el-card__body) {
    height: 100%;
    padding: 16px;
  }
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
