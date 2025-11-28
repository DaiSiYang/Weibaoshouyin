/**
 * 角色管理 API
 */
import http from '@/utils/http'

// 角色项类型
export interface RoleItem {
    id: number
    name: string
    key: string
    remark: string
    status: number
    created_time: string
    updated_time: string
    data_scope?: number
    custom_dept?: Record<string, any>
    pid?: number
    level?: number
    tree?: string
    sort?: number
}

// 角色列表响应
export interface RoleListResponse {
    list: RoleItem[]
    page: number
    page_size: number
    pagination: boolean
    page_count: number
    total_count: number
}

// 角色编辑参数
export interface RoleEditParams {
    id?: number
    name: string
    key: string
    remark?: string
    status: number
}

// 获取角色列表
export function getRoleList(params?: { page?: number; page_size?: number }) {
    return http.get<RoleListResponse>('/role/list', params)
}

// 编辑角色
export function editRole(data: RoleEditParams) {
    return http.post<any>('/role/edit', data)
}

// 删除角色
export function deleteRole(id: number) {
    return http.post<any>('/role/delete', { id })
}
