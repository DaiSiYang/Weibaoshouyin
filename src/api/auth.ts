/**
 * 认证相关 API
 */
import http from '@/utils/http'
import {LoginConfigInterface} from "@/store/modules/loginConfig";

// 登录参数
export interface LoginParams {
    username: string
    password: string
}

// 登录响应数据
export interface LoginData {
    id: number
    username: string
    token: string
    secondary: string
}

/**
 * 登录
 */
export function login(params: LoginParams) {
    return http.post<LoginData>('/account/login', params)
}

/**
 * 获取应用配置
 */
export function  LoginConfig(code: string) {
    return http.get<LoginConfigInterface>('/terminal/site/loginConfig?terminal_code=' + code)
}