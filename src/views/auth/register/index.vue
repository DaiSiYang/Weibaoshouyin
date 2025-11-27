<template>
  <div class="register-container">
    <LoginLeftView />

    <div class="register-right">
      <AuthTopBar />

      <div class="form-wrapper">
        <div class="form-content">
          <h3 class="title">{{ $t('register.title') }}</h3>
          <p class="sub-title">{{ $t('register.subTitle') }}</p>

          <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            class="register-form"
          >
            <el-form-item prop="username">
              <el-input
                v-model.trim="formData.username"
                :placeholder="$t('register.placeholder.username')"
                size="large"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model.trim="formData.password"
                :placeholder="$t('register.placeholder.password')"
                type="password"
                size="large"
                show-password
              />
            </el-form-item>

            <el-form-item prop="confirmPassword">
              <el-input
                v-model.trim="formData.confirmPassword"
                :placeholder="$t('register.placeholder.confirmPassword')"
                type="password"
                size="large"
                show-password
              />
            </el-form-item>

            <el-form-item prop="agreement">
              <el-checkbox v-model="formData.agreement">
                {{ $t('register.agreeText') }}
                <a href="#" class="link">{{ $t('register.privacyPolicy') }}</a>
              </el-checkbox>
            </el-form-item>

            <el-button
              type="primary"
              size="large"
              class="submit-btn"
              :loading="loading"
              @click="handleSubmit"
            >
              {{ $t('register.submitBtnText') }}
            </el-button>

            <div class="login-link">
              <span>{{ $t('register.hasAccount') }}</span>
              <router-link class="link" :to="{ name: 'Login' }">
                {{ $t('register.toLogin') }}
              </router-link>
            </div>
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

defineOptions({ name: 'Register' })

const { t } = useI18n()
const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)

const formData = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  agreement: false
})

const rules = computed<FormRules>(() => ({
  username: [{ required: true, message: t('register.placeholder.username'), trigger: 'blur' }],
  password: [{ required: true, message: t('register.placeholder.password'), trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: t('register.placeholder.confirmPassword'), trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== formData.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  agreement: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请同意隐私协议'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}))

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // 模拟注册
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('注册成功')
    router.push({ name: 'Login' })
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.register-container {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.register-right {
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

.register-form {
  :deep(.el-input__wrapper) {
    height: 40px;
  }

  .link {
    color: var(--el-color-primary);
    text-decoration: none;
  }
}

.submit-btn {
  width: 100%;
  height: 40px;
  margin-top: 16px;
}

.login-link {
  margin-top: 20px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
  text-align: center;

  .link {
    color: var(--el-color-primary);
    text-decoration: none;
    margin-left: 4px;
  }
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
