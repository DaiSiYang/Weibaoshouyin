<template>
  <div class="login-container">
    <!-- 左侧背景区域 -->
    <LoginLeftView />

    <!-- 右侧登录表单 -->
    <div class="login-right">
      <AuthTopBar />

      <div class="form-wrapper">
        <div class="form-content">
          <h3 class="title">{{ $t('login.title') }}</h3>
          <p class="sub-title">{{ $t('login.subTitle') }}</p>

          <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            class="login-form"
            @keyup.enter="handleSubmit"
          >
            <!-- 用户名 -->
            <el-form-item prop="username">
              <el-input
                v-model.trim="formData.username"
                :placeholder="$t('login.placeholder.username')"
                size="large"
              />
            </el-form-item>

            <!-- 密码 -->
            <el-form-item prop="password">
              <el-input
                v-model.trim="formData.password"
                :placeholder="$t('login.placeholder.password')"
                type="password"
                size="large"
                show-password
              />
            </el-form-item>

            <!-- 拖拽验证 -->
            <div class="verify-wrapper">
              <div class="verify-box" :class="{ error: !isPassing && isClickPass }">
                <ArtDragVerify
                  ref="dragVerifyRef"
                  v-model="isPassing"
                  :text="$t('login.sliderText')"
                  :success-text="$t('login.sliderSuccessText')"
                  :background="isDark ? '#26272F' : '#F1F1F4'"
                />
              </div>
              <p v-if="!isPassing && isClickPass" class="verify-error">
                {{ $t('login.placeholder.slider') }}
              </p>
            </div>

            <!-- 记住密码 -->
            <div class="form-options">
              <el-checkbox v-model="formData.rememberPassword">
                {{ $t('login.rememberPwd') }}
              </el-checkbox>
            </div>

            <!-- 登录按钮 -->
            <el-button
              type="primary"
              size="large"
              class="login-btn"
              :loading="loading"
              @click="handleSubmit"
            >
              {{ $t('login.btnText') }}
            </el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed , onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElNotification, type FormInstance, type FormRules } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useSettingStore } from '@/store/modules/setting'
import { useUserStore} from '@/store/modules/user'
import {LoginConfigInterface, useLoginConfig} from "@/store/modules/loginConfig";
import LoginLeftView from './components/LoginLeftView.vue'
import AuthTopBar from './components/AuthTopBar.vue'
import ArtDragVerify from '@/components/core/ArtDragVerify.vue'
import AppConfig from '@/config'
import { login , LoginConfig} from '@/api/auth'
import {aesECBDecrypt,aesECBEncrypt} from '@/utils/passwordUtil'
import {getRuntimeKey} from "@/store/modules/secureKeyStore";

defineOptions({ name: 'Login' })

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const settingStore = useSettingStore()
const userStore = useUserStore()
const { isDark } = storeToRefs(settingStore)


const formRef = ref<FormInstance>()
const dragVerifyRef = ref()
const isPassing = ref(false)
const isClickPass = ref(false)
const loading = ref(false)


const loginConfig = useLoginConfig()

const getLoginConfig = async () => {
  const res = await LoginConfig("web")
  console.log(res)
  loginConfig.setLoginConfigData(res)


}

const formData = reactive({
  username: 'admin123',
  password: 'admin123',
  rememberPassword: true
})

const rules = computed<FormRules>(() => ({
  username: [{ required: true, message: t('login.placeholder.username'), trigger: 'blur' }],
  password: [{ required: true, message: t('login.placeholder.password'), trigger: 'blur' }]
}))

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    if (!isPassing.value) {
      isClickPass.value = true
      return
    }

    loading.value = true

    const decryptedPassword = aesECBEncrypt(formData.password, getRuntimeKey()! )

    console.log(getRuntimeKey()!)
    console.log("加密之后的密码:",decryptedPassword)
    // 调用登录接口
    const res = await login({
      username: formData.username,
      password: decryptedPassword
    })

    // 保存登录数据到 pinia
    userStore.saveLoginData({
      id: res.id,
      username: res.username,
      token: res.token,
      secondary: res.secondary
    })

    userStore.setSecondary(res.secondary)

    // 登录成功提示
    ElNotification({
      title: t('login.success.title'),
      type: 'success',
      duration: 2500,
      message: `${t('login.success.message')}, ${formData.username}!`
    })

    // 跳转
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    loading.value = false
    dragVerifyRef.value?.reset()
  }
}

onMounted(() => {
  getLoginConfig()
})

</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.login-right {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-bg-color);
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

.login-form {
  :deep(.el-input__wrapper) {
    height: 40px;
  }
}

.verify-wrapper {
  margin: 24px 0 16px;

  .verify-box {
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid transparent;
    transition: border-color 0.3s;

    &.error {
      border-color: var(--el-color-danger);
    }
  }

  .verify-error {
    font-size: 12px;
    color: var(--el-color-danger);
    margin-top: 8px;
  }
}

.form-options {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.login-btn {
  width: 100%;
  height: 40px;
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
