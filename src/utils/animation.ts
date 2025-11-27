/**
 * 主题切换动画工具
 * 使用 View Transition API 实现圆形扩散动画效果
 */

import { useSettingStore } from '@/store/modules/setting'

/**
 * 主题切换动画
 * @param e 鼠标点击事件
 */
export const themeAnimation = (e: MouseEvent) => {
    const x = e.clientX
    const y = e.clientY
    // 计算鼠标点击位置距离视窗的最大圆半径
    const endRadius = Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y)
    )

    // 设置 CSS 变量
    document.documentElement.style.setProperty('--x', x + 'px')
    document.documentElement.style.setProperty('--y', y + 'px')
    document.documentElement.style.setProperty('--r', endRadius + 'px')

    // 检查浏览器是否支持 View Transition API
    if (document.startViewTransition) {
        document.startViewTransition(() => toggleTheme())
    } else {
        toggleTheme()
    }
}

/**
 * 切换主题
 */
const toggleTheme = () => {
    const settingStore = useSettingStore()
    settingStore.toggleTheme()
}
