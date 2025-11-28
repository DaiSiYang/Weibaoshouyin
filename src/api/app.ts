/**
 * 应用安装 API
 */
import http from '@/utils/http'

// 应用项类型
export interface AppItem {
    id: number
    business: string // 所属业务
    terminal: string // 作用终端
    app_type: string // 应用类型 ios/apk/wgt/exe
    name: string // 应用名称
    version: string // 版本编号
    description: string // 更新描述
    is_update: number // 是否更新
    force_update: number // 强制更新
    status: number // 使用状态
    created_time: string
    updated_time: string
}

// 应用列表响应
export interface AppListResponse {
    list: AppItem[]
    page: number
    page_size: number
    total_count: number
}

// 应用列表查询参数
export interface AppListParams {
    page?: number
    page_size?: number
    name?: string
    version?: string
    terminal?: string
    app_type?: string
    status?: number
    business?: string
}

// 应用编辑参数
export interface AppEditParams {
    id?: number
    business: string
    terminal: string
    app_type: string
    name: string
    version: string
    description?: string
    is_update?: number
    force_update?: number
    status: number
}

// 获取应用列表
export function getAppList(params?: AppListParams) {
    return http.get<AppListResponse>('/app/list', params)
}

// 编辑应用
export function editApp(data: AppEditParams) {
    return http.post<any>('/app/edit', data)
}

// 删除应用
export function deleteApp(id: number) {
    return http.post<any>('/app/delete', { id })
}
