import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '@/router'

// 用户信息类型
export interface UserInfo {
    id: number
    username: string
    realName?: string
    avatar?: string
    email?: string
    mobile?: string
    roleId?: number
    roleKey?: string
    deptId?: number
    deptType?: string
}

export const useUserStore = defineStore('user', () => {
    // 语言
    const language = ref('zh')

    // Token
    const token = ref('')
    const secondary = ref('')

    // 登录状态
    const isLogin = ref(false)

    // 用户信息
    const userInfo = ref<UserInfo>({
        id: 0,
        username: '',
        realName: '',
        avatar: '',
        email: '',
        mobile: '',
        roleId: 0,
        roleKey: '',
        deptId: 0,
        deptType: ''
    })

    // 计算属性
    const accessToken = computed(() => token.value)

    // 设置语言
    const setLanguage = (lang: string) => {
        language.value = lang
    }

    // 设置 Token
    const setToken = (newToken: string) => {
        token.value = newToken
        isLogin.value = !!newToken
    }

    // 设置 secondary
    const setSecondary = (sec: string) => {
        secondary.value = sec
    }

    // 设置登录状态
    const setLoginStatus = (status: boolean) => {
        isLogin.value = status
    }

    // 设置用户信息
    const setUserInfo = (info: Partial<UserInfo>) => {
        userInfo.value = { ...userInfo.value, ...info }
    }

    // 登录成功后保存数据
    const saveLoginData = (data: {
        id: number
        username: string
        token: string
        secondary: string
    }) => {
        token.value = data.token
        secondary.value = data.secondary
        isLogin.value = true
        userInfo.value = {
            ...userInfo.value,
            id: data.id,
            username: data.username
        }
    }

    // 登出
    const logout = () => {
        token.value = ''
        secondary.value = ''
        isLogin.value = false
        userInfo.value = {
            id: 0,
            username: '',
            realName: '',
            avatar: '',
            email: '',
            mobile: '',
            roleId: 0,
            roleKey: '',
            deptId: 0,
            deptType: ''
        }
        router.push('/login')
    }

    // 兼容 logOut
    const logOut = logout

    return {
        // 状态
        language,
        token,
        secondary,
        isLogin,
        userInfo,
        accessToken,
        // 方法
        setLanguage,
        setToken,
        setSecondary,
        setLoginStatus,
        setUserInfo,
        saveLoginData,
        logout,
        logOut
    }
}, {
    persist: true
})
