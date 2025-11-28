<template>
  <div class="assistant-container">
    <el-card shadow="never" class="assistant-card">
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
            新增人员
          </el-button>
        </template>

        <!-- 搜索栏 -->
        <template #search>
          <el-form :model="searchForm" inline>
            <el-form-item label="账号/姓名">
              <el-input v-model="searchForm.name" placeholder="请输入账号或姓名" clearable style="width: 180px" />
            </el-form-item>
            <el-form-item label="角色身份">
              <el-select v-model="searchForm.role_id" placeholder="请选择" clearable style="width: 140px">
                <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="使用状态">
              <el-select v-model="searchForm.status" placeholder="请选择" clearable style="width: 120px">
                <el-option label="启用" :value="1" />
                <el-option label="停用" :value="2" />
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
            {{ row.status === 1 ? '启用' : '停用' }}
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
                  修改信息
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleUpdateMobile(row)">
                  <el-icon><Iphone /></el-icon>
                  修改手机号
                </el-dropdown-item>
                <el-dropdown-item @click="handleUpdatePassword(row)">
                  <el-icon><Lock /></el-icon>
                  修改登录密码
                </el-dropdown-item>
                <el-dropdown-item @click="handleUpdateSecondaryPassword(row)">
                  <el-icon><Key /></el-icon>
                  修改二级密码
                </el-dropdown-item>
                <el-dropdown-item @click="handleUpdateSecureKey(row)">
                  <el-icon><Connection /></el-icon>
                  修改安全密钥
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleToggleStatus(row)">
                  <el-icon><Switch /></el-icon>
                  {{ row.status === 1 ? '停用' : '启用' }}
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

    <!-- 新增人员弹窗 -->
    <el-dialog v-model="addDialogVisible" title="新增协助人员" width="550px" destroy-on-close>
      <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="90px">
        <el-form-item label="登录账号" prop="username">
          <el-input v-model="addForm.username" placeholder="请输入登录账号" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <div class="sms-input">
            <el-input v-model="addForm.code" placeholder="请输入验证码" />
            <el-button :disabled="smsCooldown > 0" @click="handleSendSms('add')">
              {{ smsCooldown > 0 ? `${smsCooldown}s` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input v-model="addForm.password" type="password" placeholder="请输入登录密码" show-password />
        </el-form-item>
        <el-form-item label="人员姓名" prop="real_name">
          <el-input v-model="addForm.real_name" placeholder="请输入人员姓名" />
        </el-form-item>
        <el-form-item label="通知邮箱" prop="email">
          <el-input v-model="addForm.email" placeholder="请输入通知邮箱（选填）" />
        </el-form-item>
        <el-form-item label="角色身份" prop="role_id">
          <el-select v-model="addForm.role_id" placeholder="请选择角色" style="width: 100%">
            <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="dept_id">
          <el-select v-model="addForm.dept_id" placeholder="请选择部门" style="width: 100%">
            <el-option v-for="item in deptOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="二级密码" prop="s_password">
          <el-input v-model="addForm.s_password" type="password" placeholder="请输入二级密码（选填）" show-password />
        </el-form-item>
        <el-form-item label="安全密钥" prop="secure_key">
          <el-input v-model="addForm.secure_key" placeholder="请输入安全密钥（选填）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitAdd">确定</el-button>
      </template>
    </el-dialog>

    <!-- 编辑基本信息弹窗 -->
    <el-dialog v-model="editDialogVisible" title="修改信息" width="500px" destroy-on-close>
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="90px">
        <el-form-item label="登录账号" prop="username">
          <el-input v-model="editForm.username" placeholder="请输入登录账号" />
        </el-form-item>
        <el-form-item label="人员姓名" prop="real_name">
          <el-input v-model="editForm.real_name" placeholder="请输入人员姓名" />
        </el-form-item>
        <el-form-item label="通知邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入通知邮箱" />
        </el-form-item>
        <el-form-item label="角色身份" prop="role_id">
          <el-select v-model="editForm.role_id" placeholder="请选择角色" style="width: 100%">
            <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="dept_id">
          <el-select v-model="editForm.dept_id" placeholder="请选择部门" style="width: 100%">
            <el-option v-for="item in deptOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitEdit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 修改手机号弹窗 -->
    <el-dialog v-model="mobileDialogVisible" title="修改手机号" width="450px" destroy-on-close>
      <el-form ref="mobileFormRef" :model="mobileForm" :rules="mobileRules" label-width="80px">
        <el-form-item label="新手机号" prop="mobile">
          <el-input v-model="mobileForm.mobile" placeholder="请输入新手机号" />
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <div class="sms-input">
            <el-input v-model="mobileForm.code" placeholder="请输入验证码" />
            <el-button :disabled="smsCooldown > 0" @click="handleSendSms('update_mobile')">
              {{ smsCooldown > 0 ? `${smsCooldown}s` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="mobileDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitUpdateMobile">确定</el-button>
      </template>
    </el-dialog>

    <!-- 修改登录密码弹窗 -->
    <el-dialog v-model="passwordDialogVisible" title="修改登录密码" width="480px" destroy-on-close>
      <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-width="80px">
        <el-form-item label="验证方式">
          <el-radio-group v-model="passwordForm.type">
            <el-radio :value="1">短信验证</el-radio>
            <el-radio :value="2">旧密码验证</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 短信验证 -->
        <template v-if="passwordForm.type === 1">
          <el-form-item label="手机号">
            <el-input :model-value="passwordForm.mobile" disabled />
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <div class="sms-input">
              <el-input v-model="passwordForm.code" placeholder="请输入验证码" />
              <el-button :disabled="smsCooldown > 0" @click="handleSendSms('update_password')">
                {{ smsCooldown > 0 ? `${smsCooldown}s` : '获取验证码' }}
              </el-button>
            </div>
          </el-form-item>
        </template>
        <!-- 旧密码验证 -->
        <el-form-item v-if="passwordForm.type === 2" label="旧密码" prop="old_password">
          <el-input v-model="passwordForm.old_password" type="password" placeholder="请输入旧密码" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="passwordForm.password" type="password" placeholder="请输入新密码" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm_password">
          <el-input v-model="passwordForm.confirm_password" type="password" placeholder="请再次输入新密码" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitUpdatePassword">确定</el-button>
      </template>
    </el-dialog>

    <!-- 修改二级密码弹窗 -->
    <el-dialog v-model="secondaryPasswordDialogVisible" title="修改二级密码" width="450px" destroy-on-close>
      <el-form ref="secondaryPasswordFormRef" :model="secondaryPasswordForm" :rules="secondaryPasswordRules" label-width="100px">
        <el-form-item label="新二级密码" prop="s_password">
          <el-input v-model="secondaryPasswordForm.s_password" type="password" placeholder="请输入新二级密码" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm_password">
          <el-input v-model="secondaryPasswordForm.confirm_password" type="password" placeholder="请再次输入新二级密码" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="secondaryPasswordDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitUpdateSecondaryPassword">确定</el-button>
      </template>
    </el-dialog>

    <!-- 修改安全密钥弹窗 -->
    <el-dialog v-model="secureKeyDialogVisible" title="修改安全密钥" width="450px" destroy-on-close>
      <el-form ref="secureKeyFormRef" :model="secureKeyForm" :rules="secureKeyRules" label-width="80px">
        <el-form-item label="安全密钥" prop="secure_key">
          <el-input v-model="secureKeyForm.secure_key" placeholder="请输入新安全密钥" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="secureKeyDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitUpdateSecureKey">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>


<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, MoreFilled, Edit, Delete, Iphone, Lock, Key, Connection, Switch } from '@element-plus/icons-vue'
import ArtTable, { type TableColumn } from '@/components/core/ArtTable.vue'
import {
  getAssistantList,
  editAssistant,
  updateAssistantMobile,
  updateAssistantPassword,
  updateAssistantSecondaryPassword,
  updateAssistantSecureKey,
  toggleAssistantStatus,
  deleteAssistant,
  sendRegisterVerifyCode,
  sendBindMobileVerifyCode,
  sendPasswordVerifyCode,
  type AssistantItem
} from '@/api/assistant'
import { getRoleList, type RoleItem } from '@/api/role'
import { getDeptList, type DeptItem } from '@/api/dept'

defineOptions({ name: 'Assistant' })

// 表格列配置
const columns: TableColumn[] = [
  { type: 'index', label: '序号', width: 60 },
  { prop: 'real_name', label: '协助姓名', minWidth: 100 },
  { prop: 'mobile', label: '手机号', minWidth: 120 },
  { prop: 'username', label: '登录账号', minWidth: 120 },
  { prop: 'email', label: '通知邮箱', minWidth: 160, showOverflowTooltip: true },
  { prop: 'role_name', label: '角色身份', minWidth: 100 },
  { prop: 'status', label: '使用状态', width: 90, slot: true },
  { prop: 'last_active_at', label: '最后活跃时间', width: 170 },
  { prop: 'created_time', label: '创建时间', width: 170 },
  { prop: 'updated_time', label: '更新时间', width: 170 },
  { prop: 'operation', label: '其他操作', width: 80, fixed: 'right', slot: true }
]

// 搜索表单
const searchForm = reactive({
  name: '',
  role_id: undefined as number | undefined,
  status: undefined as number | undefined
})

// 表格数据
const loading = ref(false)
const tableData = ref<AssistantItem[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)

// 选项数据
const roleOptions = ref<RoleItem[]>([])
const deptOptions = ref<DeptItem[]>([])

// 弹窗状态
const submitLoading = ref(false)
const smsCooldown = ref(0)
let smsTimer: ReturnType<typeof setInterval> | null = null

// 新增弹窗
const addDialogVisible = ref(false)
const addFormRef = ref<FormInstance>()
const addForm = reactive({
  username: '',
  mobile: '',
  code: '',
  password: '',
  real_name: '',
  email: '',
  role_id: undefined as number | undefined,
  dept_id: undefined as number | undefined,
  s_password: '',
  secure_key: ''
})

// 编辑弹窗
const editDialogVisible = ref(false)
const editFormRef = ref<FormInstance>()
const editForm = reactive({
  id: 0,
  username: '',
  real_name: '',
  email: '',
  role_id: undefined as number | undefined,
  dept_id: undefined as number | undefined
})

// 修改手机号弹窗
const mobileDialogVisible = ref(false)
const mobileFormRef = ref<FormInstance>()
const mobileForm = reactive({ id: 0, mobile: '', code: '' })

// 修改登录密码弹窗
const passwordDialogVisible = ref(false)
const passwordFormRef = ref<FormInstance>()
const passwordForm = reactive({
  id: 0,
  type: 2 as 1 | 2,           // 验证方式：1-短信验证，2-旧密码验证
  mobile: '',                  // 手机号（用于显示和发送验证码）
  code: '',                    // 验证码
  old_password: '',            // 旧密码
  password: '',
  confirm_password: ''
})

// 修改二级密码弹窗
const secondaryPasswordDialogVisible = ref(false)
const secondaryPasswordFormRef = ref<FormInstance>()
const secondaryPasswordForm = reactive({ id: 0, s_password: '', confirm_password: '' })

// 修改安全密钥弹窗
const secureKeyDialogVisible = ref(false)
const secureKeyFormRef = ref<FormInstance>()
const secureKeyForm = reactive({ id: 0, secure_key: '' })

// 表单校验规则
const addRules: FormRules = {
  username: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入登录密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  real_name: [{ required: true, message: '请输入人员姓名', trigger: 'blur' }],
  email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
  role_id: [{ required: true, message: '请选择角色身份', trigger: 'change' }],
  dept_id: [{ required: true, message: '请选择所属部门', trigger: 'change' }]
}

const editRules: FormRules = {
  username: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
  real_name: [{ required: true, message: '请输入人员姓名', trigger: 'blur' }],
  email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
  role_id: [{ required: true, message: '请选择角色身份', trigger: 'change' }],
  dept_id: [{ required: true, message: '请选择所属部门', trigger: 'change' }]
}

const mobileRules: FormRules = {
  mobile: [
    { required: true, message: '请输入新手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

const passwordRules: FormRules = {
  code: [{
    validator: (_rule, value, callback) => {
      if (passwordForm.type === 1 && !value) callback(new Error('请输入验证码'))
      else callback()
    },
    trigger: 'blur'
  }],
  old_password: [{
    validator: (_rule, value, callback) => {
      if (passwordForm.type === 2 && !value) callback(new Error('请输入旧密码'))
      else callback()
    },
    trigger: 'blur'
  }],
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirm_password: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== passwordForm.password) callback(new Error('两次输入的密码不一致'))
        else callback()
      },
      trigger: 'blur'
    }
  ]
}

const secondaryPasswordRules: FormRules = {
  s_password: [
    { required: true, message: '请输入新二级密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirm_password: [
    { required: true, message: '请再次输入新二级密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== secondaryPasswordForm.s_password) callback(new Error('两次输入的密码不一致'))
        else callback()
      },
      trigger: 'blur'
    }
  ]
}

const secureKeyRules: FormRules = {
  secure_key: [{ required: true, message: '请输入安全密钥', trigger: 'blur' }]
}

// 获取选项数据
const fetchOptions = async () => {
  try {
    const [roleRes, deptRes] = await Promise.all([
      getRoleList({ page_size: 100 }),
      getDeptList({})
    ])
    roleOptions.value = roleRes.list || []
    deptOptions.value = deptRes.list || []
  } catch (error) {
    console.error('[协助人员] 获取选项数据失败:', error)
  }
}

// 获取列表数据
const fetchData = async () => {
  loading.value = true
  const params: Record<string, any> = {
    page: currentPage.value,
    page_size: pageSize.value,
    pagination: true
  }
  if (searchForm.name) params.name = searchForm.name
  if (searchForm.role_id !== undefined) params.role_id = searchForm.role_id
  if (searchForm.status !== undefined) params.status = searchForm.status

  try {
    const res = await getAssistantList(params)
    tableData.value = res.list || []
    total.value = res.total_count || 0
  } catch (error) {
    console.error('[协助人员] 获取列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { currentPage.value = 1; fetchData() }
const resetSearch = () => {
  searchForm.name = ''
  searchForm.role_id = undefined
  searchForm.status = undefined
  handleSearch()
}
const handleSizeChange = () => fetchData()
const handleCurrentChange = () => fetchData()

// 发送短信验证码
const handleSendSms = async (type: 'add' | 'update_mobile' | 'update_password') => {
  let mobile = ''
  if (type === 'add') mobile = addForm.mobile
  else if (type === 'update_mobile') mobile = mobileForm.mobile
  else if (type === 'update_password') mobile = passwordForm.mobile

  if (!mobile || !/^1[3-9]\d{9}$/.test(mobile)) {
    ElMessage.warning('请输入正确的手机号')
    return
  }
  try {
    // 根据类型调用不同的验证码接口
    if (type === 'update_password') {
      await sendPasswordVerifyCode(mobile)
    } else if (type === 'update_mobile') {
      await sendBindMobileVerifyCode(mobile)
    } else if (type === 'add') {
      await sendRegisterVerifyCode(mobile)
    }
    ElMessage.success('验证码已发送')
    smsCooldown.value = 60
    smsTimer = setInterval(() => {
      smsCooldown.value--
      if (smsCooldown.value <= 0 && smsTimer) { clearInterval(smsTimer); smsTimer = null }
    }, 1000)
  } catch (error) {
    console.error('[协助人员] 发送验证码失败:', error)
  }
}

// 新增
const handleAdd = () => {
  Object.assign(addForm, {
    username: '', mobile: '', code: '', password: '', real_name: '',
    email: '', role_id: undefined, dept_id: undefined, s_password: '', secure_key: ''
  })
  addDialogVisible.value = true
}

const submitAdd = async () => {
  if (!addFormRef.value) return
  await addFormRef.value.validate()
  submitLoading.value = true
  try {
    await editAssistant({
      username: addForm.username,
      mobile: addForm.mobile,
      code: addForm.code,
      password: addForm.password,
      real_name: addForm.real_name,
      email: addForm.email || undefined,
      role_id: addForm.role_id!,
      dept_id: addForm.dept_id!,
      s_password: addForm.s_password || undefined
    })
    ElMessage.success('新增成功')
    addDialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error('[协助人员] 新增失败:', error)
  } finally {
    submitLoading.value = false
  }
}

// 编辑
const handleEdit = (row: AssistantItem) => {
  Object.assign(editForm, {
    id: row.id,
    username: row.username,
    real_name: row.real_name,
    email: row.email,
    role_id: row.role_id,
    dept_id: (row as any).dept_id
  })
  editDialogVisible.value = true
}

const submitEdit = async () => {
  if (!editFormRef.value) return
  await editFormRef.value.validate()
  submitLoading.value = true
  try {
    await editAssistant({
      id: editForm.id,
      username: editForm.username,
      real_name: editForm.real_name,
      email: editForm.email || undefined,
      role_id: editForm.role_id!,
      dept_id: editForm.dept_id!
    })
    ElMessage.success('修改成功')
    editDialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error('[协助人员] 修改失败:', error)
  } finally {
    submitLoading.value = false
  }
}

// 修改手机号
const handleUpdateMobile = (row: AssistantItem) => {
  Object.assign(mobileForm, { id: row.id, mobile: '', code: '' })
  mobileDialogVisible.value = true
}

const submitUpdateMobile = async () => {
  if (!mobileFormRef.value) return
  await mobileFormRef.value.validate()
  submitLoading.value = true
  try {
    await updateAssistantMobile(mobileForm)
    ElMessage.success('手机号修改成功')
    mobileDialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error('[协助人员] 修改手机号失败:', error)
  } finally {
    submitLoading.value = false
  }
}

// 修改登录密码
const handleUpdatePassword = (row: AssistantItem) => {
  Object.assign(passwordForm, {
    id: row.id,
    type: 2,
    mobile: row.mobile,
    code: '',
    old_password: '',
    password: '',
    confirm_password: ''
  })
  passwordDialogVisible.value = true
}

const submitUpdatePassword = async () => {
  if (!passwordFormRef.value) return
  await passwordFormRef.value.validate()
  submitLoading.value = true
  try {
    const params: any = {
      id: passwordForm.id,
      type: passwordForm.type,
      password: passwordForm.password
    }
    if (passwordForm.type === 1) {
      params.code = passwordForm.code
    } else {
      params.old_password = passwordForm.old_password
    }
    await updateAssistantPassword(params)
    ElMessage.success('登录密码修改成功')
    passwordDialogVisible.value = false
  } catch (error) {
    console.error('[协助人员] 修改登录密码失败:', error)
  } finally {
    submitLoading.value = false
  }
}

// 修改二级密码
const handleUpdateSecondaryPassword = (row: AssistantItem) => {
  Object.assign(secondaryPasswordForm, { id: row.id, s_password: '', confirm_password: '' })
  secondaryPasswordDialogVisible.value = true
}

const submitUpdateSecondaryPassword = async () => {
  if (!secondaryPasswordFormRef.value) return
  await secondaryPasswordFormRef.value.validate()
  submitLoading.value = true
  try {
    await updateAssistantSecondaryPassword({
      id: secondaryPasswordForm.id,
      s_password: secondaryPasswordForm.s_password
    })
    ElMessage.success('二级密码修改成功')
    secondaryPasswordDialogVisible.value = false
  } catch (error) {
    console.error('[协助人员] 修改二级密码失败:', error)
  } finally {
    submitLoading.value = false
  }
}

// 修改安全密钥
const handleUpdateSecureKey = (row: AssistantItem) => {
  Object.assign(secureKeyForm, { id: row.id, secure_key: '' })
  secureKeyDialogVisible.value = true
}

const submitUpdateSecureKey = async () => {
  if (!secureKeyFormRef.value) return
  await secureKeyFormRef.value.validate()
  submitLoading.value = true
  try {
    await updateAssistantSecureKey(secureKeyForm)
    ElMessage.success('安全密钥修改成功')
    secureKeyDialogVisible.value = false
  } catch (error) {
    console.error('[协助人员] 修改安全密钥失败:', error)
  } finally {
    submitLoading.value = false
  }
}

// 启用/停用
const handleToggleStatus = (row: AssistantItem) => {
  const action = row.status === 1 ? '停用' : '启用'
  ElMessageBox.confirm(`确定${action}协助人员"${row.real_name}"吗？`, `${action}确认`, {
    confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
  }).then(async () => {
    try {
      await toggleAssistantStatus(row.id)
      ElMessage.success(`${action}成功`)
      fetchData()
    } catch (error) {
      console.error(`[协助人员] ${action}失败:`, error)
    }
  }).catch(() => {})
}

// 删除
const handleDelete = (row: AssistantItem) => {
  ElMessageBox.confirm(`确定删除协助人员"${row.real_name}"吗？此操作不可恢复！`, '删除确认', {
    confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
  }).then(async () => {
    try {
      await deleteAssistant(row.id)
      ElMessage.success('删除成功')
      fetchData()
    } catch (error) {
      console.error('[协助人员] 删除失败:', error)
    }
  }).catch(() => {})
}

onMounted(() => { fetchOptions(); fetchData() })
</script>

<style lang="scss" scoped>
.assistant-container { height: 100%; }
.assistant-card {
  height: 100%;
  :deep(.el-card__body) { height: 100%; padding: 16px; }
}
.sms-input {
  display: flex; gap: 10px; width: 100%;
  .el-input { flex: 1; }
  .el-button { width: 110px; }
}
:deep(.el-dropdown-menu__item) { display: flex; align-items: center; gap: 8px; }
</style>
