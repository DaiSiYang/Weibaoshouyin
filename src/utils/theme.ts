/**
 * 主题切换工具函数
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
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
    )

    // 设置CSS变量
    document.documentElement.style.setProperty('--x', x + 'px')
    document.documentElement.style.setProperty('--y', y + 'px')
    document.documentElement.style.setProperty('--r', endRadius + 'px')

    // 使用 View Transition API（如果支持）
    const doc = document as any
    if (doc.startViewTransition) {
        doc.startViewTransition(() => toggleTheme())
    } else {
        // 降级处理：直接切换主题
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

/**
 * 颜色处理工具
 */

/**
 * 将hex颜色转换为RGB数组
 */
export function hexToRgb(hexColor: string): number[] {
    const cleanHex = hexColor.replace(/^#/, '')
    let hex = cleanHex

    // 处理缩写形式 (#FFF -> #FFFFFF)
    if (hex.length === 3) {
        hex = hex.split('').map(char => char.repeat(2)).join('')
    }

    const hexPairs = hex.match(/../g)
    if (!hexPairs) {
        throw new Error('Invalid hex color format')
    }

    return hexPairs.map(hexPair => parseInt(hexPair, 16))
}

/**
 * 将RGB颜色转换为hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (value: number) => {
        const hex = value.toString(16)
        return hex.length === 1 ? `0${hex}` : hex
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * 颜色混合
 */
export function colourBlend(color1: string, color2: string, ratio: number): string {
    const validRatio = Math.max(0, Math.min(1, Number(ratio)))

    const rgb1 = hexToRgb(color1)
    const rgb2 = hexToRgb(color2)

    const blendedRgb = rgb1.map((value1, index) => {
        const value2 = rgb2[index]
        return Math.round(value1 * (1 - validRatio) + value2 * validRatio)
    })

    return rgbToHex(blendedRgb[0], blendedRgb[1], blendedRgb[2])
}

/**
 * 获取变浅的颜色
 */
export function getLightColor(color: string, level: number, isDark: boolean = false): string {
    if (isDark) {
        return getDarkColor(color, level)
    }

    const rgb = hexToRgb(color)
    const lightRgb = rgb.map(value => Math.floor((255 - value) * level + value))

    return rgbToHex(lightRgb[0], lightRgb[1], lightRgb[2])
}

/**
 * 获取变深的颜色
 */
export function getDarkColor(color: string, level: number): string {
    const rgb = hexToRgb(color)
    const darkRgb = rgb.map(value => Math.floor(value * (1 - level)))

    return rgbToHex(darkRgb[0], darkRgb[1], darkRgb[2])
}

/**
 * 设置 Element Plus 主题颜色
 */
export function setElementThemeColor(color: string, isDark: boolean = false): void {
    const elStyle = document.documentElement.style

    elStyle.setProperty('--el-color-primary', color)

    // 生成浅色系列
    for (let i = 1; i <= 9; i++) {
        elStyle.setProperty(
            `--el-color-primary-light-${i}`,
            getLightColor(color, i / 10, isDark)
        )
    }

    // 生成深色系列
    for (let i = 1; i <= 9; i++) {
        elStyle.setProperty(
            `--el-color-primary-dark-${i}`,
            getDarkColor(color, i / 10)
        )
    }
}
