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
        redirect: '/dashboard/service-stats',
        children: [
            // 数据仪表（父菜单）
            {
                path: 'dashboard',
                name: 'Dashboard',
                redirect: '/dashboard/service-stats',
                meta: { title: '数据仪表', icon: 'Odometer' },
                children: [
                    {
                        path: 'service-stats',
                        name: 'ServiceStats',
                        component: () => import('@/views/dashboard/index.vue'),
                        meta: { title: '服务统计', icon: 'House' }
                    },
                    {
                        path: 'analysis',
                        name: 'Analysis',
                        component: () => import('@/views/dashboard/index.vue'),
                        meta: { title: '分析统计', icon: 'DataAnalysis' }
                    },
                    {
                        path: 'business-stats',
                        name: 'BusinessStats',
                        component: () => import('@/views/dashboard/index.vue'),
                        meta: { title: '商务统计', icon: 'Histogram' }
                    }
                ]
            },
            // 权限管理
            {
                path: 'permission',
                name: 'Permission',
                component: () => import('@/views/system/index.vue'),
                meta: { title: '权限管理', icon: 'Lock' }
            },
            // 菜单管理
            {
                path: 'menu-manage',
                name: 'MenuManage',
                component: () => import('@/views/system/index.vue'),
                meta: { title: '菜单管理', icon: 'Grid' }
            },
            // 应用安装
            {
                path: 'app-install',
                name: 'AppInstall',
                component: () => import('@/views/system/index.vue'),
                meta: { title: '应用安装', icon: 'Download' }
            },
            // 用户管理（父菜单）
            {
                path: 'user-manage',
                name: 'UserManage',
                redirect: '/user-manage/users',
                meta: { title: '用户管理', icon: 'User' },
                children: [
                    {
                        path: 'users',
                        name: 'Users',
                        component: () => import('@/views/system/index.vue'),
                        meta: { title: '用户列表', icon: 'User' }
                    },
                    {
                        path: 'roles',
                        name: 'Roles',
                        component: () => import('@/views/system/index.vue'),
                        meta: { title: '角色管理', icon: 'Avatar' }
                    }
                ]
            },
            // 业务协议
            {
                path: 'agreement',
                name: 'Agreement',
                component: () => import('@/views/document/index.vue'),
                meta: { title: '业务协议', icon: 'Document' }
            },
            // 运营管理
            {
                path: 'operation',
                name: 'Operation',
                component: () => import('@/views/system/index.vue'),
                meta: { title: '运营管理', icon: 'Monitor' }
            },
            // 奖励分成
            {
                path: 'reward',
                name: 'Reward',
                component: () => import('@/views/system/index.vue'),
                meta: { title: '奖励分成', icon: 'Present' }
            },
            // 客服中心
            {
                path: 'customer-service',
                name: 'CustomerService',
                component: () => import('@/views/system/index.vue'),
                meta: { title: '客服中心', icon: 'Service' }
            },
            // 个人中心
            {
                path: 'user-center',
                name: 'UserCenter',
                component: () => import('@/views/user-center/index.vue'),
                meta: { title: '个人中心', icon: 'UserFilled' }
            },
            // 操作日志
            {
                path: 'operation-log',
                name: 'OperationLog',
                component: () => import('@/views/changelog/index.vue'),
                meta: { title: '操作日志', icon: 'Tickets' }
            },
            // 运维监控
            {
                path: 'monitor',
                name: 'Monitor',
                component: () => import('@/views/safeguard/index.vue'),
                meta: { title: '运维监控', icon: 'View' }
            },
            // 系统管理
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
        redirect: '/dashboard/service-stats'
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    const token = userStore.token

    // 白名单路由直接放行
    if (whiteList.includes(to.path)) {
        // 已登录访问登录页，跳转到首页
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
        // 未登录，跳转到登录页，并记录原路径
        next({
            path: '/login',
            query: { redirect: to.fullPath }
        })
    }
})

export default router
