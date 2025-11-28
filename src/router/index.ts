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
                path: 'permission',
                name: 'Permission',
                component: () => import('@/views/system/index.vue'),
                meta: { title: '权限管理', icon: 'Lock' }
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
                component: () => import('@/views/system/index.vue'),
                meta: { title: '应用安装', icon: 'Download' }
            },
            // ========== 用户管理 ==========
            {
                path: 'users',
                name: 'Users',
                component: () => import('@/views/system/index.vue'),
                meta: { title: '用户列表', icon: 'User', parent: '用户管理', parentIcon: 'User' }
            },
            {
                path: 'roles',
                name: 'Roles',
                component: () => import('@/views/system/role/index.vue'),
                meta: { title: '角色管理', icon: 'Avatar', parent: '用户管理', parentIcon: 'User' }
            },
            {
                path: 'depts',
                name: 'Depts',
                component: () => import('@/views/system/dept/index.vue'),
                meta: { title: '部门管理', icon: 'OfficeBuilding', parent: '用户管理', parentIcon: 'User' }
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
                path: 'monitor',
                name: 'Monitor',
                component: () => import('@/views/safeguard/index.vue'),
                meta: { title: '运维监控', icon: 'View' }
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
export const menuConfig = [
    {
        title: '数据仪表',
        icon: 'Odometer',
        children: [
            { path: '/service-stats', title: '服务统计', icon: 'House' },
            { path: '/analysis', title: '分析统计', icon: 'DataAnalysis' },
            { path: '/business-stats', title: '商务统计', icon: 'Histogram' }
        ]
    },
    { path: '/permission', title: '权限管理', icon: 'Lock' },
    { path: '/menu-manage', title: '菜单管理', icon: 'Grid' },
    { path: '/app-install', title: '应用安装', icon: 'Download' },
    {
        title: '用户管理',
        icon: 'User',
        children: [
            { path: '/users', title: '用户列表', icon: 'User' },
            { path: '/roles', title: '角色管理', icon: 'Avatar' },
            { path: '/depts', title: '部门管理', icon: 'OfficeBuilding' }
        ]
    },
    { path: '/agreement', title: '业务协议', icon: 'Document' },
    { path: '/operation', title: '运营管理', icon: 'Monitor' },
    { path: '/reward', title: '奖励分成', icon: 'Present' },
    { path: '/customer-service', title: '客服中心', icon: 'Service' },
    { path: '/user-center', title: '个人中心', icon: 'UserFilled' },
    { path: '/operation-log', title: '操作日志', icon: 'Tickets' },
    { path: '/monitor', title: '运维监控', icon: 'View' },
    { path: '/system', title: '系统管理', icon: 'Setting' }
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
