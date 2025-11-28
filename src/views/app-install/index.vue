<template>
  <div class="app-container">
    <el-card shadow="never" class="app-card">
      <ArtTable
        :data="tableData"
        :columns="columns"
        :loading="loading"
        :total="total"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        @refresh="fetchData"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <!-- 左侧按钮 -->
        <template #header-left>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增应用
          </el-button>
        </template>

        <!-- 搜索栏 -->
        <template #search>
          <el-form :model="searchForm" inline>
            <el-form-item label="应用名称">
              <el-input v-model="searchForm.name" placeholder="请输入应用名称" clearable />
            </el-form-item>
            <el-form-item label="版本编号">
              <el-input v-model="searchForm.version" placeholder="请输入版本编号" clearable />
            </el-form-item>
            <el-form-item label="使用终端">
              <el-select v-model="searchForm.terminal" placeholder="请选择" clearable style="width: 120px">
                <el-option label="Android" value="android" />
                <el-option label="iOS" value="ios" />
                <el-option label="Windows" value="windows" />
                <el-option label="Web" value="web" />
              </el-select>
            </el-form-item>
            <el-form-item label="应用类型">
              <el-select v-model="searchForm.app_type" placeholder="请选择" clearable style="width: 120px">
                <el-option label="iOS" value="ios" />
                <el-option label="APK" value="apk" />
                <el-option label="WGT" value="wgt" />
                <el-option label="EXE" value="exe" />
              </el-select>
            </el-form-item>
            <el-form-item label="使用状态">
              <el-select v-model="searchForm.status" placeholder="请选择" clearable style="width: 120px">
                <el-option label="启用" :value="1" />
                <el-option label="禁用" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="所属业务">
              <el-input v-model="searchForm.business" placeholder="请输入所属业务" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </template>

        <!-- 应用类型列 -->
        <template #app_type="{ row }">
          <el-tag :type="getAppTypeTag(row.app_type)">
            {{ row.app_type?.toUpperCase() }}
          </el-tag>
        </template>

        <!-- 是否更新列 -->
        <template #is_update="{ row }">
          <el-tag :type="row.is_update === 1 ? 'success' : 'info'">
            {{ row.is_update === 1 ? '是' : '否' }}
          </el-tag>
        </template>

        <!-- 强制更新列 -->
        <template #force_update="{ row }">
          <el-tag :type="row.force_update === 1 ? 'danger' : 'info'">
            {{ row.force_update === 1 ? '是' : '否' }}
          </el-tag>
        </template>

        <!-- 状态列 -->
        <template #status="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>

        <!-- 操作列 -->
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

    <!-- 表单弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增应用' : '编辑应用'"
      width="550px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="90px">
        <el-form-item label="所属分类" prop="business">
          <el-input v-model="formData.business" placeholder="请输入所属分类" />
        </el-form-item>
        <el-form-item label="作用终端" prop="terminal">
          <el-select v-model="formData.terminal" placeholder="请选择作用终端" style="width: 100%">
            <el-option label="Android" value="android" />
            <el-option label="iOS" value="ios" />
            <el-option label="Windows" value="windows" />
            <el-option label="Web" value="web" />
          </el-select>
        </el-form-item>
        <el-form-item label="应用类型" prop="app_type">
          <el-select v-model="formData.app_type" placeholder="请选择应用类型" style="width: 100%">
            <el-option label="iOS" value="ios" />
            <el-option label="APK" value="apk" />
            <el-option label="WGT" value="wgt" />
            <el-option label="EXE" value="exe" />
          </el-select>
        </el-form-item>
        <el-form-item label="应用名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入应用名称" />
        </el-form-item>
        <el-form-item label="版本编号" prop="version">
          <el-input v-model="formData.version" placeholder="请输入版本编号" />
        </el-form-item>
        <el-form-item label="更新描述" prop="description">
          <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入更新描述" />
        </el-form-item>
        <el-form-item label="是否更新" prop="is_update">
          <el-radio-group v-model="formData.is_update">
            <el-radio :value="1">是</el-radio>
            <el-radio :value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="强制更新" prop="force_update">
          <el-radio-group v-model="formData.force_update">
            <el-radio :value="1">是</el-radio>
            <el-radio :value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="使用状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, MoreFilled, Edit, Delete } from '@element-plus/icons-vue'
import ArtTable, { type TableColumn } from '@/components/core/ArtTable.vue'
import { getAppList, editApp, deleteApp, type AppItem } from '@/api/app'

defineOptions({ name: 'AppInstall' })

// 表格列配置
const columns: TableColumn[] = [
  { prop: 'business', label: '所属业务', minWidth: 100 },
  { prop: 'terminal', label: '作用终端', minWidth: 100 },
  { prop: 'app_type', label: '应用类型', width: 100, slot: true },
  { prop: 'name', label: '应用名称', minWidth: 120 },
  { prop: 'version', label: '版本编号', minWidth: 100 },
  { prop: 'description', label: '更新描述', minWidth: 150, showOverflowTooltip: true },
  { prop: 'is_update', label: '是否更新', width: 90, slot: true },
  { prop: 'force_update', label: '强制更新', width: 90, slot: true },
  { prop: 'status', label: '使用状态', width: 90, slot: true },
  { prop: 'created_time', label: '创建时间', width: 170 },
  { prop: 'updated_time', label: '更新时间', width: 170 },
  { prop: 'operation', label: '其他操作', width: 80, fixed: 'right', slot: true }
]

// 搜索
const searchForm = reactive({
  name: '',
  version: '',
  terminal: '',
  app_type: '',
  status: undefined as number | undefined,
  business: ''
})

// 表格
const loading = ref(false)
const tableData = ref<AppItem[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)

// 弹窗
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const formData = reactive({
  id: 0,
  business: '',
  terminal: '',
  app_type: '',
  name: '',
  version: '',
  description: '',
  is_update: 0,
  force_update: 0,
  status: 1
})

// 表单校验规则
const rules: FormRules = {
  business: [{ required: true, message: '请输入所属分类', trigger: 'blur' }],
  terminal: [{ required: true, message: '请选择作用终端', trigger: 'change' }],
  app_type: [{ required: true, message: '请选择应用类型', trigger: 'change' }],
  name: [{ required: true, message: '请输入应用名称', trigger: 'blur' }],
  version: [{ required: true, message: '请输入版本编号', trigger: 'blur' }]
}

// 获取应用类型标签颜色
const getAppTypeTag = (type: string) => {
  const map: Record<string, string> = {
    ios: 'primary',
    apk: 'success',
    wgt: 'warning',
    exe: 'info'
  }
  return map[type] || 'info'
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  const params: Record<string, any> = {
    page: currentPage.value,
    page_size: pageSize.value
  }
  if (searchForm.name) params.name = searchForm.name
  if (searchForm.version) params.version = searchForm.version
  if (searchForm.terminal) params.terminal = searchForm.terminal
  if (searchForm.app_type) params.app_type = searchForm.app_type
  if (searchForm.status !== undefined) params.status = searchForm.status
  if (searchForm.business) params.business = searchForm.business

  console.log('[应用安装] 获取列表 - 请求参数:', params)
  try {
    const res = await getAppList(params)
    console.log('[应用安装] 获取列表 - 响应数据:', res)
    tableData.value = res.list || []
    total.value = res.total_count || 0
  } catch (error) {
    console.error('[应用安装] 获取列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

const resetSearch = () => {
  searchForm.name = ''
  searchForm.version = ''
  searchForm.terminal = ''
  searchForm.app_type = ''
  searchForm.status = undefined
  searchForm.business = ''
  handleSearch()
}

const handleSizeChange = () => fetchData()
const handleCurrentChange = () => fetchData()

// 新增
const handleAdd = () => {
  dialogType.value = 'add'
  formData.id = 0
  formData.business = ''
  formData.terminal = ''
  formData.app_type = ''
  formData.name = ''
  formData.version = ''
  formData.description = ''
  formData.is_update = 0
  formData.force_update = 0
  formData.status = 1
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: AppItem) => {
  dialogType.value = 'edit'
  formData.id = row.id
  formData.business = row.business
  formData.terminal = row.terminal
  formData.app_type = row.app_type
  formData.name = row.name
  formData.version = row.version
  formData.description = row.description
  formData.is_update = row.is_update
  formData.force_update = row.force_update
  formData.status = row.status
  dialogVisible.value = true
}

// 提交
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate()

  submitLoading.value = true
  const params: Record<string, any> = {
    business: formData.business,
    terminal: formData.terminal,
    app_type: formData.app_type,
    name: formData.name,
    version: formData.version,
    description: formData.description,
    is_update: formData.is_update,
    force_update: formData.force_update,
    status: formData.status
  }
  if (dialogType.value === 'edit' && formData.id) {
    params.id = formData.id
  }

  const action = dialogType.value === 'add' ? '新增' : '编辑'
  console.log(`[应用安装] ${action}应用 - 请求参数:`, params)
  try {
    const res = await editApp(params)
    console.log(`[应用安装] ${action}应用 - 响应数据:`, res)
    ElMessage.success(`${action}成功`)
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error(`[应用安装] ${action}应用失败:`, error)
  } finally {
    submitLoading.value = false
  }
}

// 删除
const handleDelete = (row: AppItem) => {
  ElMessageBox.confirm(`确定删除应用"${row.name}"吗？`, '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      console.log('[应用安装] 删除应用 - 请求参数:', { id: row.id })
      try {
        const res = await deleteApp(row.id)
        console.log('[应用安装] 删除应用 - 响应数据:', res)
        ElMessage.success('删除成功')
        fetchData()
      } catch (error) {
        console.error('[应用安装] 删除应用失败:', error)
      }
    })
    .catch(() => {})
}

onMounted(() => fetchData())
</script>

<style lang="scss" scoped>
.app-container {
  height: 100%;
}

.app-card {
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
