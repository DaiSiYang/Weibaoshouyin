import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'

export interface WorkTab {
    path: string
    title: string
    icon?: string
    query?: Record<string, any>
    closable?: boolean
}

export const useWorktabStore = defineStore(
    'worktab',
    () => {
        // 已打开的标签页列表
        const tabs = ref<WorkTab[]>([
            { path: '/service-stats', title: '服务统计', icon: 'House', closable: false }
        ])

        // 当前激活的标签页
        const activeTab = ref('/service-stats')

        // 添加标签页
        const addTab = (tab: WorkTab) => {
            const exists = tabs.value.find((t) => t.path === tab.path)
            if (!exists) {
                tabs.value.push({ ...tab, closable: tab.closable !== false })
            }
            activeTab.value = tab.path
        }

        // 关闭标签页
        const removeTab = (path: string) => {
            const index = tabs.value.findIndex((t) => t.path === path)
            if (index === -1) return

            const tab = tabs.value[index]
            if (tab.closable === false) return

            tabs.value.splice(index, 1)

            // 如果关闭的是当前标签，跳转到相邻标签
            if (activeTab.value === path) {
                const newIndex = Math.min(index, tabs.value.length - 1)
                const newTab = tabs.value[newIndex]
                if (newTab) {
                    activeTab.value = newTab.path
                    router.push(newTab.path)
                }
            }
        }

        // 关闭左侧标签页
        const removeLeft = (path: string) => {
            const index = tabs.value.findIndex((t) => t.path === path)
            tabs.value = tabs.value.filter(
                (t, i) => i >= index || t.closable === false
            )
        }

        // 关闭右侧标签页
        const removeRight = (path: string) => {
            const index = tabs.value.findIndex((t) => t.path === path)
            tabs.value = tabs.value.filter(
                (t, i) => i <= index || t.closable === false
            )
        }

        // 关闭其他标签页
        const removeOthers = (path: string) => {
            tabs.value = tabs.value.filter(
                (t) => t.path === path || t.closable === false
            )
        }

        // 关闭所有标签页
        const removeAll = () => {
            const firstTab = tabs.value.find((t) => t.closable === false) || tabs.value[0]
            tabs.value = firstTab ? [firstTab] : []
            if (firstTab) {
                activeTab.value = firstTab.path
                router.push(firstTab.path)
            }
        }

        // 设置当前激活标签
        const setActiveTab = (path: string) => {
            activeTab.value = path
        }

        return {
            tabs,
            activeTab,
            addTab,
            removeTab,
            removeLeft,
            removeRight,
            removeOthers,
            removeAll,
            setActiveTab
        }
    },
    {
        persist: true
    }
)
