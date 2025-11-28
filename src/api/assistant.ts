/**
 * 协助人员管理 API
 */
import http from '@/utils/http'

// 协助人员项类型
export interface AssistantItem {
    id: number
    real_name: string          // 协助姓名
    role_id: number            // 角色ID
    role_name: string          // 角色名称
    username: string           // 登录账号
    email: string              // 通知邮箱
    mobile: string             // 手机号
    last_active_at: string     // 最后活跃时间
    remark: string             // 备注
    status: number             // 使用状态 1-启用 2-停用
    created_time: string       // 创建时间
    updated_time: string       // 更新时间
}

// 列表响应
export interface AssistantListResponse {
    list: AssistantItem[]
    page: number
    page_size: number
    pagination: boolean
    page_count: number
    total_count: number
}

// 列表查询参数
export interface AssistantListParams {
    page?: number
    page_size?: number
    pagination?: boolean
    name?: string              // 角色名称/姓名搜索
    status?: number            // 状态筛选
    role_id?: number           // 角色筛选
}

// 新增/编辑协助人员参数（同一个接口）
export interface AssistantEditParams {
    id?: number                // 管理员ID（编辑时必填）
    dept_id: number            // 部门ID
    role_id: number            // 角色ID
    mobile?: string            // 手机号码
    code?: string              // 验证码
    username: string           // 帐号
    real_name: string          // 人员姓名
    password?: string          // 登录密码
    s_password?: string        // 二级密码
    email?: string             // 通知邮箱
}

// 修改手机号参数
export interface UpdateMobileParams {
    id: number
    mobile: string
    code: string
}

// 修改登录密码参数
export interface UpdatePasswordParams {
    id: number
    type: 1 | 2                // 验证方式：1-短信验证，2-旧密码验证
    password?: string          // 新密码
    old_password?: string      // 旧密码（type=2 时需要）
    code?: string              // 验证码（type=1 时需要）
}

// 修改二级密码参数
export interface UpdateSecondaryPasswordParams {
    id: number
    s_password: string
}

// 修改安全密钥参数
export interface UpdateSecureKeyParams {
    id: number
    secure_key: string
}

// 获取协助人员列表
export function getAssistantList(params?: AssistantListParams) {
    return http.get<AssistantListResponse>('/admin/list', params)
}

// 新增/编辑协助人员（同一个接口，有id为编辑，无id为新增）
export function editAssistant(data: AssistantEditParams) {
    return http.post<any>('/admin/edit', data)
}

// 修改手机号
export function updateAssistantMobile(data: UpdateMobileParams) {
    return http.post<any>('/admin/edit/mobile', data)
}

// 修改登录密码
export function updateAssistantPassword(data: UpdatePasswordParams) {
    return http.post<any>('/admin/edit/login_pw', data)
}

// 修改二级密码
export function updateAssistantSecondaryPassword(data: UpdateSecondaryPasswordParams) {
    return http.post<any>('/admin/edit/second_pw', data)
}

// 修改安全密钥
export function updateAssistantSecureKey(data: UpdateSecureKeyParams) {
    return http.post<any>('/admin/edit/secret', data)
}

// 启用/停用协助人员（只需传 id，后端自动切换状态）
export function toggleAssistantStatus(id: number) {
    return http.post<any>('/admin/enable', { id })
}

// 删除协助人员
export function deleteAssistant(id: number) {
    return http.post<any>('/admin/delete', { id })
}

// 发送新增协助人员验证码
export function sendRegisterVerifyCode(phone: string) {
    return http.get<{ verify_code: string }>('/sms/register_verify_code', { phone })
}

// 发送更换绑定手机验证码
export function sendBindMobileVerifyCode(phone: string) {
    return http.get<{ verify_code: string }>('/sms/bind_mobile_verify_code', { phone })
}

// 发送修改登录密码验证码
export function sendPasswordVerifyCode(phone: string) {
    return http.get<{ verify_code: string }>('/sms/ud_login_pw_verify_code', { phone })
}
