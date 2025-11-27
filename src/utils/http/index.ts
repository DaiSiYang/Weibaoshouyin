/**
 * HTTP 请求封装模块
 * 基于 Axios 封装的 HTTP 请求工具
 */
import axios, {AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse, InternalAxiosRequestConfig} from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { ApiStatus } from './status'
import {useLoginConfig} from "@/store/modules/loginConfig";

// 请求配置
const REQUEST_TIMEOUT = 15000
const BASE_URL = 'http://192.168.1.13:11015'

// 响应数据结构（根据你的接口返回格式）
export interface BaseResponse<T = any> {
    code: number
    message: string
    data: T
    timestamp?: number
    traceID?: string
}

// 扩展请求配置
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
    showErrorMessage?: boolean
    showSuccessMessage?: boolean
}

// 创建 Axios 实例
const axiosInstance = axios.create({
    timeout: REQUEST_TIMEOUT,
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器
axiosInstance.interceptors.request.use(

    (config: InternalAxiosRequestConfig) => {

        const userStore = useUserStore()
        const token = userStore.token

        const loginConfig = useLoginConfig()

        const skipPrefix = ['/account/login', '/terminal/site/loginConfig']

        const shouldSkip = skipPrefix.some(path => config.url!.startsWith(path))
        let hasPrefix = false
        if (!shouldSkip) {
            // 拼前缀
            if (loginConfig.LoginConfigData.api_prefix && loginConfig.LoginConfigData.terminal_code) {
                config.url = `${loginConfig.LoginConfigData.api_prefix}/${loginConfig.LoginConfigData.terminal_code}${config.url}`
                hasPrefix = true
            }
        }
        // 如果已拼前缀，添加 Secondary header
        if (hasPrefix) {
            if (!config.headers) config.headers = {} as AxiosRequestHeaders
            config.headers['Secondary'] = userStore.secondary
        }



        if (token) {
            config.headers.set('Authorization', `Bearer ${token}`)
        }

        console.log('[HTTP Request]', config.method?.toUpperCase(), config.url, config.data || config.params)

        return config
    },
    (error) => {
        console.error('[HTTP Request Error]', error)
        ElMessage.error('请求配置错误')
        return Promise.reject(error)
    }
)

// 响应拦截器
axiosInstance.interceptors.response.use(
    (response: AxiosResponse<BaseResponse>) => {
        const { code, message, data } = response.data

        console.log('[HTTP Response]', response.config.url, response.data)

        // 成功（code === 0 表示成功）
        if (code === 0) {
            return response
        }

        // 未授权
        if (code === ApiStatus.unauthorized) {
            ElMessage.error(message || '登录已过期，请重新登录')
            const userStore = useUserStore()
            userStore.logout()
            return Promise.reject(new Error(message || '未授权'))
        }

        // 其他错误
        ElMessage.error(message || '请求失败')
        return Promise.reject(new Error(message || '请求失败'))
    },
    (error) => {
        console.error('[HTTP Response Error]', error)

        // 网络错误
        if (!error.response) {
            ElMessage.error('网络连接失败，请检查网络')
            return Promise.reject(error)
        }

        // HTTP 状态码错误
        const status = error.response.status
        const errorMessages: Record<number, string> = {
            [ApiStatus.unauthorized]: '登录已过期，请重新登录',
            [ApiStatus.forbidden]: '没有权限访问',
            [ApiStatus.notFound]: '请求的资源不存在',
            [ApiStatus.internalServerError]: '服务器内部错误',
            [ApiStatus.badGateway]: '网关错误',
            [ApiStatus.serviceUnavailable]: '服务暂不可用',
            [ApiStatus.gatewayTimeout]: '网关超时'
        }

        ElMessage.error(errorMessages[status] || `请求失败 (${status})`)

        // 401 自动登出
        if (status === ApiStatus.unauthorized) {
            const userStore = useUserStore()
            userStore.logout()
        }

        return Promise.reject(error)
    }
)

// 请求方法
async function request<T = any>(config: ExtendedAxiosRequestConfig): Promise<T> {
    try {
        const response = await axiosInstance.request<BaseResponse<T>>(config)

        // 显示成功消息
        if (config.showSuccessMessage && response.data.message) {
            ElMessage.success(response.data.message)
        }

        return response.data.data
    } catch (error) {
        return Promise.reject(error)
    }
}

// API 方法
const http = {
    get<T = any>(url: string, params?: any, config?: ExtendedAxiosRequestConfig) {
        return request<T>({ ...config, url, params, method: 'GET' })
    },

    post<T = any>(url: string, data?: any, config?: ExtendedAxiosRequestConfig) {
        return request<T>({ ...config, url, data, method: 'POST' })
    },

    put<T = any>(url: string, data?: any, config?: ExtendedAxiosRequestConfig) {
        return request<T>({ ...config, url, data, method: 'PUT' })
    },

    delete<T = any>(url: string, params?: any, config?: ExtendedAxiosRequestConfig) {
        return request<T>({ ...config, url, params, method: 'DELETE' })
    }
}

export default http
