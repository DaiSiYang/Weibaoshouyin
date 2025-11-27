<template>
  <div class="forget-container">
    <LoginLeftView />

    <div class="forget-right">
      <AuthTopBar />

      <div class="form-wrapper">
        <div class="form-content">
          <h3 class="title">{{ $t('forgetPassword.title') }}</h3>
          <p class="sub-title">{{ $t('forgetPassword.subTitle') }}</p>

          <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            class="forget-form"
          >
            <el-form-item prop="email">
              <el-input
                v-model.trim="formData.email"
                :placeholder="$t('forgetPassword.placeholder')"
                size="large"
              />
            </el-form-item>

            <el-button
              type="primary"
              size="large"
              class="submit-btn"
              :loading="loading"
              @click="handleSubmit"
            >
              {{ $t('forgetPassword.submitBtnText') }}
            </el-button>

            <el-button
              size="large"
              class="back-btn"
              @click="goBack"
            >
              {{ $t('forgetPassword.backBtnText') }}
            </el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import LoginLeftView from '../login/components/LoginLeftView.vue'
import AuthTopBar from '../login/components/AuthTopBar.vue'

defineOptions({ name: 'ForgetPassword' })

const { t } = useI18n()
const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)

const formData = reactive({
  email: ''
})

const rules = computed<FormRules>(() => ({
  email: [
    { required: true, message: t('forgetPassword.placeholder'), trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}))

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // 模拟发送邮件
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('重置密码邮件已发送，请查收')
    router.push({ name: 'Login' })
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push({ name: 'Login' })
}
</script>

<style lang="scss" scoped>
.forget-container {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.forget-right {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-wrapper {
  width: 400px;
  padding: 40px 0;
  animation: slideInRight 0.6s ease-out;

  @media (max-width: 768px) {
    width: 100%;
    padding: 40px 24px;
  }
}

.form-content {
  .title {
    font-size: 32px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin-bottom: 8px;
  }

  .sub-title {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    margin-bottom: 32px;
  }
}

.forget-form {
  :deep(.el-input__wrapper) {
    height: 40px;
  }
}

.submit-btn {
  width: 100%;
  height: 40px;
  margin-top: 16px;
}

.back-btn {
  width: 100%;
  height: 40px;
  margin-top: 12px;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
