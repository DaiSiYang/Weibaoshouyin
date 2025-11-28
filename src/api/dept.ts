/**
 * 部门管理 API
 */
import http from '@/utils/http'

// 部门项类型
export interface DeptItem {
    id: number
    name: string
    code: string
    remark: string
    status: number
    created_time: string
    updated_time: string
    pid?: number
    sort?: number
}

// 部门列表响应
export interface DeptListResponse {
    list: DeptItem[]
    ids?: number[]
}

// 部门列表查询参数
export interface DeptListParams {
    name?: string
    code?: string
    status?: number
}

// 部门编辑参数
export interface DeptEditParams {
    id?: number
    name: string
    code: string
    remark?: string
    status: number
}

// 获取部门列表
export function getDeptList(params?: DeptListParams) {
    return http.get<DeptListResponse>('/dept/list', params)
}

// 编辑部门
export function editDept(data: DeptEditParams) {
    return http.post<any>('/dept/edit', data)
}

// 删除部门
export function deleteDept(id: number) {
    return http.post<any>('/dept/delete', { id })
}
