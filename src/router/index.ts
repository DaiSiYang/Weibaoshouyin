import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'
import { useUserStore } from '@/store/modules/user'

// 白名单路由（不需要登录）
const whiteList = ['/login', '/register', '/forget-password']

const routes: RouteRecordRaw[] = [
    // 登录页
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/auth/login/index.vue'),
        meta: { title: '登录', hideLayout: true }
    },
    // 注册页
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/auth/register/index.vue'),
        meta: { title: '注册', hideLayout: true }
    },
    // 忘记密码
    {
        path: '/forget-password',
        name: 'ForgetPassword',
        component: () => import('@/views/auth/forget-password/index.vue'),
        meta: { title: '忘记密码', hideLayout: true }
    },
    // 主布局
    {
        path: '/',
        component: Layout,
        redirect: '/service-stats',
        children: [
            // ========== 数据仪表 ==========
            {
                path: 'service-stats',
                name: 'ServiceStats',
                component: () => import('@/views/dashboard/index.vue'),
                meta: { title: '服务统计', icon: 'House', parent: '数据仪表', parentIcon: 'Odometer' }
            },
            {
                path: 'analysis',
                name: 'Analysis',
                component: () => import('@/views/dashboard/index.vue'),
                meta: { title: '分析统计', icon: 'DataAnalysis', parent: '数据仪表', parentIcon: 'Odometer' }
            },
            {
                path: 'business-stats',
                name: 'BusinessStats',
                component: () => import('@/views/dashboard/index.vue'),
                meta: { title: '商务统计', icon: 'Histogram', parent: '数据仪表', parentIcon: 'Odometer' }
            },
            // ========== 权限管理 ==========
            {
                path: 'assistants',
                name: 'Assistants',
                component: () => import('@/views/system/assistant/index.vue'),
                meta: { title: '协助人员', icon: 'UserFilled', parent: '权限管理', parentIcon: 'Lock' }
            },
            {
                path: 'roles',
                name: 'Roles',
                component: () => import('@/views/system/role/index.vue'),
                meta: { title: '角色管理', icon: 'Avatar', parent: '权限管理', parentIcon: 'Lock' }
            },
            {
                path: 'depts',
                name: 'Depts',
                component: () => import('@/views/system/dept/index.vue'),
                meta: { title: '部门管理', icon: 'OfficeBuilding', parent: '权限管理', parentIcon: 'Lock' }
            },
            // ========== 菜单管理 ==========
            {
                path: 'menu-manage',
                name: 'MenuManage',
                component: () => import('@/views/system/index.vue'),
                meta: { title: '菜单管理', icon: 'Grid' }
            },
            // ========== 应用安装 ==========
            {
                path: 'app-install',
                name: 'AppInstall',
                component: () => import('@/views/app-install/index.vue'),
                meta: { title: '应用安装', icon: 'Download' }
            },

            // ========== 业务协议 ==========
            {
                path: 'agreement',
                name: 'Agreement',
                component: () => import('@/views/document/index.vue'),
                meta: { title: '业务协议', icon: 'Document' }
            },
            // ========== 运营管理 ==========
            {
                path: 'operation',
                name: 'Operation',
                component: () => import('@/views/system/index.vue'),
                meta: { title: '运营管理', icon: 'Monitor' }
            },
            // ========== 奖励分成 ==========
            {
                path: 'reward',
                name: 'Reward',
                component: () => import('@/views/system/index.vue'),
                meta: { title: '奖励分成', icon: 'Present' }
            },
            // ========== 客服中心 ==========
            {
                path: 'customer-service',
                name: 'CustomerService',
                component: () => import('@/views/system/index.vue'),
                meta: { title: '客服中心', icon: 'Service' }
            },
            // ========== 个人中心 ==========
            {
                path: 'user-center',
                name: 'UserCenter',
                component: () => import('@/views/user-center/index.vue'),
                meta: { title: '个人中心', icon: 'UserFilled' }
            },
            // ========== 操作日志 ==========
            {
                path: 'operation-log',
                name: 'OperationLog',
                component: () => import('@/views/changelog/index.vue'),
                meta: { title: '操作日志', icon: 'Tickets' }
            },
            // ========== 运维监控 ==========
            {
                path: 'safeguard-monitor',
                name: 'SafeguardMonitor',
                component: () => import('@/views/safeguard/monitor/index.vue'),
                meta: { title: '运维监控', icon: 'Monitor', parent: '运维监控', parentIcon: 'View' }
            },
            {
                path: 'safeguard-security',
                name: 'SafeguardSecurity',
                component: () => import('@/views/safeguard/security/index.vue'),
                meta: { title: '接口安全', icon: 'Lock', parent: '运维监控', parentIcon: 'View' }
            },
            // ========== 系统管理 ==========
            {
                path: 'system',
                name: 'System',
                component: () => import('@/views/settings/index.vue'),
                meta: { title: '系统管理', icon: 'Setting' }
            }
        ]
    },
    // 404
    {
        path: '/:pathMatch(.*)*',
        redirect: '/service-stats'
    }
]

// 菜单配置（用于侧边栏显示，支持嵌套）
// 图标使用 assets/icon 目录下的图片
export const menuConfig = [
    {
        title: '数据仪表',
        icon: '数据仪表_3.png',
        children: [
            { path: '/service-stats', title: '服务统计', icon: '服务统计_3.png' },
            { path: '/analysis', title: '分析统计', icon: '分析统计_3.png' },
            { path: '/business-stats', title: '商务统计', icon: '商务统计_3.png' }
        ]
    },
    {
        title: '权限管理',
        icon: '权限管理_3.png',
        children: [
            { path: '/assistants', title: '协助人员', icon: '用户管理_3.png' },
            { path: '/roles', title: '角色管理', icon: '用户管理_3.png' },
            { path: '/depts', title: '部门管理', icon: '用户管理_3.png' }
        ]
    },
    { path: '/menu-manage', title: '菜单管理', icon: '菜单管理_3.png' },
    { path: '/app-install', title: '应用安装', icon: '应用安装_3.png' },
    { path: '/agreement', title: '业务协议', icon: '业务协议_3.png' },
    { path: '/operation', title: '运营管理', icon: '运营管理_3.png' },
    { path: '/reward', title: '奖励分成', icon: '奖励分成_3.png' },
    { path: '/customer-service', title: '客服中心', icon: '客服中心_3.png' },
    { path: '/user-center', title: '个人中心', icon: '个人中心_3.png' },
    { path: '/operation-log', title: '操作日志', icon: '操作日志_3.png' },
    {
        title: '运维监控',
        icon: '运维监控_3.png',
        children: [
            { path: '/safeguard-monitor', title: '运维监控', icon: '运维监控_3.png' },
            { path: '/safeguard-security', title: '接口安全', icon: '系统管理_3.png' }
        ]
    },
    { path: '/system', title: '系统管理', icon: '系统管理_3.png' }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 路由守卫
router.beforeEach((to, _from, next) => {
    const userStore = useUserStore()
    const token = userStore.token

    // 白名单路由直接放行
    if (whiteList.includes(to.path)) {
        if (token && to.path === '/login') {
            next('/')
            return
        }
        next()
        return
    }

    // 需要登录的页面
    if (token) {
        next()
    } else {
        next({
            path: '/login',
            query: { redirect: to.fullPath }
        })
    }
})

export default router
