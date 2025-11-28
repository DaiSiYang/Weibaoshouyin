<template>
  <div class="role-container">
    <el-card shadow="never" class="role-card">
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
            新增角色
          </el-button>
        </template>

        <!-- 搜索栏 -->
        <template #search>
          <el-form :model="searchForm" inline>
            <el-form-item label="角色名称">
              <el-input v-model="searchForm.roleName" placeholder="请输入角色名称" clearable />
            </el-form-item>
            <el-form-item label="角色编码">
              <el-input v-model="searchForm.roleCode" placeholder="请输入角色编码" clearable />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="searchForm.enabled" placeholder="请选择" clearable style="width: 120px">
                <el-option label="启用" :value="true" />
                <el-option label="禁用" :value="false" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </template>

        <!-- 状态列插槽 -->
        <template #enabled="{ row }">
          <el-tag :type="row.enabled ? 'success' : 'warning'">
            {{ row.enabled ? '启用' : '禁用' }}
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
                <el-dropdown-item @click="handlePermission(row)">
                  <el-icon><User /></el-icon>
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

    <!-- 使用通用表单弹窗组件 -->
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
import { Plus, MoreFilled, User, Edit, Delete } from '@element-plus/icons-vue'
import ArtTable, { type TableColumn } from '@/components/core/ArtTable.vue'
import ArtFormDialog, { type FormField } from '@/components/core/ArtFormDialog.vue'

defineOptions({ name: 'Role' })

interface RoleItem {
  roleId: number
  roleName: string
  roleCode: string
  description: string
  enabled: boolean
  createTime: string
}

// 表格列配置
const columns: TableColumn[] = [
  { prop: 'roleId', label: '角色ID', width: 100 },
  { prop: 'roleName', label: '角色名称', minWidth: 120 },
  { prop: 'roleCode', label: '角色编码', minWidth: 120 },
  { prop: 'description', label: '角色描述', minWidth: 180, showOverflowTooltip: true },
  { prop: 'enabled', label: '角色状态', width: 100, slot: true },
  { prop: 'createTime', label: '创建日期', width: 180, sortable: true },
  { prop: 'operation', label: '操作', width: 80, fixed: 'right', slot: true }
]

// 搜索
const searchForm = reactive({
  roleName: '',
  roleCode: '',
  enabled: undefined as boolean | undefined
})

// 表格
const loading = ref(false)
const tableData = ref<RoleItem[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)

// 弹窗
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const submitLoading = ref(false)
const formData = ref<Record<string, any>>({})

// 表单字段配置
const formFields: FormField[] = [
  { prop: 'roleName', label: '角色名称', type: 'input' },
  { prop: 'roleCode', label: '角色编码', type: 'input' },
  { prop: 'description', label: '角色描述', type: 'textarea', rows: 3 },
  { prop: 'enabled', label: '状态', type: 'switch' }
]

// 表单校验规则
const rules: FormRules = {
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  roleCode: [{ required: true, message: '请输入角色编码', trigger: 'blur' }]
}

// 模拟数据
const mockData: RoleItem[] = [
  { roleId: 1, roleName: '系统管理员', roleCode: 'R_SUPPORT', description: '处理客户支持请求', enabled: false, createTime: '1991-08-29 03:23:40' },
  { roleId: 2, roleName: '普通用户', roleCode: 'R_FINANCE', description: '负责系统维护和更新', enabled: true, createTime: '1985-07-27 12:11:09' },
  { roleId: 3, roleName: '超级管理员', roleCode: 'R_DATA', description: '管理项目相关权限', enabled: true, createTime: '2010-12-24 22:02:37' },
  { roleId: 4, roleName: '普通用户', roleCode: 'R_DATA', description: '拥有数据分析权限', enabled: true, createTime: '2022-07-22 06:28:02' },
  { roleId: 5, roleName: '财务', roleCode: 'R_GUEST', description: '管理财务相关权限', enabled: true, createTime: '2012-08-02 06:27:56' },
  { roleId: 6, roleName: '系统管理员', roleCode: 'R_ADMIN', description: '管理项目相关权限', enabled: true, createTime: '1973-10-24 05:00:31' },
  { roleId: 7, roleName: '运维', roleCode: 'R_OPS', description: '处理客户支持请求', enabled: false, createTime: '2004-01-01 18:47:21' },
  { roleId: 8, roleName: '客服', roleCode: 'R_FINANCE', description: '拥有系统普通权限', enabled: true, createTime: '2014-08-19 14:28:08' },
  { roleId: 9, roleName: '普通用户', roleCode: 'R_TEST', description: '拥有数据分析权限', enabled: true, createTime: '1973-02-27 08:26:00' },
  { roleId: 10, roleName: '运维', roleCode: 'R_USER', description: '拥有数据分析权限', enabled: false, createTime: '2001-06-12 07:20:10' },
  { roleId: 11, roleName: '数据分析师', roleCode: 'R_TEST', description: '仅限浏览权限', enabled: true, createTime: '2006-01-01 18:47:20' },
  { roleId: 12, roleName: '系统管理员', roleCode: 'R_OPS', description: '管理项目相关权限', enabled: false, createTime: '1972-09-17 17:44:30' },
  { roleId: 13, roleName: '客服', roleCode: 'R_DATA', description: '拥有系统管理权限', enabled: false, createTime: '1981-04-19 22:56:25' }
]

// 获取数据
const fetchData = () => {
  loading.value = true
  setTimeout(() => {
    let filtered = [...mockData]
    if (searchForm.roleName) {
      filtered = filtered.filter((item) => item.roleName.includes(searchForm.roleName))
    }
    if (searchForm.roleCode) {
      filtered = filtered.filter((item) => item.roleCode.includes(searchForm.roleCode))
    }
    if (searchForm.enabled !== undefined) {
      filtered = filtered.filter((item) => item.enabled === searchForm.enabled)
    }

    total.value = filtered.length
    const start = (currentPage.value - 1) * pageSize.value
    tableData.value = filtered.slice(start, start + pageSize.value)
    loading.value = false
  }, 300)
}

const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

const resetSearch = () => {
  searchForm.roleName = ''
  searchForm.roleCode = ''
  searchForm.enabled = undefined
  handleSearch()
}

const handleSizeChange = () => fetchData()
const handleCurrentChange = () => fetchData()

// 新增
const handleAdd = () => {
  dialogType.value = 'add'
  formData.value = { roleId: 0, roleName: '', roleCode: '', description: '', enabled: true }
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: RoleItem) => {
  dialogType.value = 'edit'
  formData.value = { ...row }
  dialogVisible.value = true
}

// 提交
const handleSubmit = (data: Record<string, any>) => {
  submitLoading.value = true
  setTimeout(() => {
    submitLoading.value = false
    ElMessage.success(dialogType.value === 'add' ? '新增成功' : '编辑成功')
    dialogVisible.value = false
    fetchData()
    console.log('提交数据:', data)
  }, 500)
}

// 删除
const handleDelete = (row: RoleItem) => {
  ElMessageBox.confirm(`确定删除角色"${row.roleName}"吗？`, '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      ElMessage.success('删除成功')
      fetchData()
    })
    .catch(() => {})
}

const handlePermission = (row: RoleItem) => {
  ElMessage.info(`配置角色"${row.roleName}"的菜单权限`)
}

onMounted(() => fetchData())
</script>

<style lang="scss" scoped>
.role-container {
  height: 100%;
}

.role-card {
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
