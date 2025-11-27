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
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/dashboard/index.vue'),
                meta: { title: '仪表盘', icon: 'DataLine' }
            },
            {
                path: 'user-center',
                name: 'UserCenter',
                component: () => import('@/views/user-center/index.vue'),
                meta: { title: '用户中心', icon: 'User' }
            },
            {
                path: 'system',
                name: 'System',
                component: () => import('@/views/system/index.vue'),
                meta: { title: '组件中心', icon: 'Grid' }
            },
            {
                path: 'function',
                name: 'Function',
                component: () => import('@/views/function/index.vue'),
                meta: { title: '功能示例', icon: 'Menu' }
            },
            {
                path: 'settings',
                name: 'Settings',
                component: () => import('@/views/settings/index.vue'),
                meta: { title: '点赞管理', icon: 'User' }
            },
            {
                path: 'document',
                name: 'Document',
                component: () => import('@/views/document/index.vue'),
                meta: { title: '文章管理', icon: 'Document' }
            },
            {
                path: 'safeguard',
                name: 'Safeguard',
                component: () => import('@/views/safeguard/index.vue'),
                meta: { title: '维护页面', icon: 'Setting' }
            },
            {
                path: 'result',
                name: 'Result',
                component: () => import('@/views/result/index.vue'),
                meta: { title: '结果页面', icon: 'CircleCheck' }
            },
            {
                path: 'exception',
                name: 'Exception',
                component: () => import('@/views/exception/index.vue'),
                meta: { title: '异常页面', icon: 'CircleClose' }
            },
            {
                path: 'version',
                name: 'Version',
                component: () => import('@/views/version/index.vue'),
                meta: { title: 'v2.6.1 版本', icon: 'Tickets' }
            },
            {
                path: 'help',
                name: 'Help',
                component: () => import('@/views/help/index.vue'),
                meta: { title: '帮助文档', icon: 'Document' }
            },
            {
                path: 'changelog',
                name: 'Changelog',
                component: () => import('@/views/changelog/index.vue'),
                meta: { title: '更新日志', icon: 'Notebook' }
            }
        ]
    },
    // 404
    {
        path: '/:pathMatch(.*)*',
        redirect: '/dashboard'
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
