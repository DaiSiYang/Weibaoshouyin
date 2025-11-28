import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { setElementThemeColor } from '@/utils/theme'
import { MenuTypeEnum, MenuThemeEnum, SystemThemeEnum, ContainerWidthEnum } from '@/enums/appEnum'
import AppConfig from '@/config'

export const useSettingStore = defineStore(
    'setting',
    () => {
        // ==================== 菜单相关 ====================
        const menuOpen = ref(true)
        const menuType = ref<MenuTypeEnum>(MenuTypeEnum.LEFT)
        const menuThemeType = ref<MenuThemeEnum>(MenuThemeEnum.DESIGN)
        const menuOpenWidth = ref(230)

        // ==================== 主题相关 ====================
        const isDark = ref(false)
        const systemThemeType = ref<SystemThemeEnum>(SystemThemeEnum.LIGHT)
        const systemThemeMode = ref<SystemThemeEnum>(SystemThemeEnum.LIGHT)
        const systemThemeColor = ref<string>(AppConfig.systemMainColor[0])

        // ==================== 界面配置 ====================
        const showWorkTab = ref(true)
        const showCrumbs = ref(true)
        const showNprogress = ref(true)
        const uniqueOpened = ref(true)
        const showMenuButton = ref(true)
        const showRefreshButton = ref(true)
        const showLanguage = ref(true)
        const colorWeak = ref(false)
        const watermarkVisible = ref(false)

        // ==================== 样式配置 ====================
        const boxBorderMode = ref(true)
        const containerWidth = ref<ContainerWidthEnum>(ContainerWidthEnum.FULL)
        const customRadius = ref('0.75')
        const pageTransition = ref('slide-left')
        const tabStyle = ref('default')

        // ==================== 系统主题监听 ====================
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleSystemThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
            if (systemThemeMode.value === SystemThemeEnum.AUTO) {
                applyTheme(e.matches)
            }
        }
        mediaQuery.addEventListener('change', handleSystemThemeChange)

        // ==================== 计算属性 ====================
        const getMenuOpenWidth = computed(() => menuOpenWidth.value + 'px')
        const getCustomRadius = computed(() => customRadius.value + 'rem')

        // ==================== 主题方法 ====================
        const applyTheme = (dark: boolean) => {
            isDark.value = dark
            systemThemeType.value = dark ? SystemThemeEnum.DARK : SystemThemeEnum.LIGHT
            const html = document.documentElement
            if (dark) {
                html.classList.add('dark')
            } else {
                html.classList.remove('dark')
            }
            setElementThemeColor(systemThemeColor.value, dark)
        }

        const setThemeType = (type: SystemThemeEnum) => {
            systemThemeMode.value = type
            if (type === SystemThemeEnum.AUTO) {
                applyTheme(mediaQuery.matches)
            } else {
                applyTheme(type === SystemThemeEnum.DARK)
            }
        }

        const toggleTheme = () => {
            if (systemThemeMode.value === SystemThemeEnum.AUTO) {
                setThemeType(isDark.value ? SystemThemeEnum.LIGHT : SystemThemeEnum.DARK)
            } else {
                setThemeType(isDark.value ? SystemThemeEnum.LIGHT : SystemThemeEnum.DARK)
            }
        }

        // ==================== 菜单方法 ====================
        const setMenuOpen = (open: boolean) => {
            menuOpen.value = open
        }

        const setMenuType = (type: MenuTypeEnum) => {
            menuType.value = type
        }

        const setMenuThemeType = (theme: MenuThemeEnum) => {
            menuThemeType.value = theme
        }

        const setMenuWidth = (width: number) => {
            menuOpenWidth.value = width
        }

        // ==================== 主题色方法 ====================
        const setThemeColor = (color: string) => {
            systemThemeColor.value = color
            setElementThemeColor(color, isDark.value)
        }

        // ==================== 界面配置方法 ====================
        const setShowWorkTab = (show: boolean) => {
            showWorkTab.value = show
        }

        const setShowCrumbs = (show: boolean) => {
            showCrumbs.value = show
        }

        const setShowNprogress = (show: boolean) => {
            showNprogress.value = show
        }

        const setUniqueOpened = (unique: boolean) => {
            uniqueOpened.value = unique
        }

        const setShowMenuButton = (show: boolean) => {
            showMenuButton.value = show
        }

        const setShowRefreshButton = (show: boolean) => {
            showRefreshButton.value = show
        }

        const setShowLanguage = (show: boolean) => {
            showLanguage.value = show
        }

        const setColorWeak = (weak: boolean) => {
            colorWeak.value = weak
            document.documentElement.classList.toggle('color-weak', weak)
        }

        const setWatermarkVisible = (visible: boolean) => {
            watermarkVisible.value = visible
        }

        // ==================== 样式配置方法 ====================
        const setBoxBorderMode = (mode: boolean) => {
            boxBorderMode.value = mode
        }

        const setContainerWidth = (width: ContainerWidthEnum) => {
            containerWidth.value = width
        }

        const setCustomRadius = (radius: string) => {
            customRadius.value = radius
            document.documentElement.style.setProperty('--custom-radius', `${radius}rem`)
        }

        const setPageTransition = (transition: string) => {
            pageTransition.value = transition
        }

        const setTabStyle = (style: string) => {
            tabStyle.value = style
        }

        // ==================== 初始化 ====================
        const initTheme = () => {
            if (systemThemeMode.value === SystemThemeEnum.AUTO) {
                applyTheme(mediaQuery.matches)
            } else {
                applyTheme(systemThemeMode.value === SystemThemeEnum.DARK)
            }
            // 初始化自定义圆角
            document.documentElement.style.setProperty('--custom-radius', `${customRadius.value}rem`)
            // 初始化色弱模式
            if (colorWeak.value) {
                document.documentElement.classList.add('color-weak')
            }
        }

        return {
            // 状态
            menuOpen,
            menuType,
            menuThemeType,
            menuOpenWidth,
            isDark,
            systemThemeType,
            systemThemeMode,
            systemThemeColor,
            showWorkTab,
            showCrumbs,
            showNprogress,
            uniqueOpened,
            showMenuButton,
            showRefreshButton,
            showLanguage,
            colorWeak,
            watermarkVisible,
            boxBorderMode,
            containerWidth,
            customRadius,
            pageTransition,
            tabStyle,
            // 计算属性
            getMenuOpenWidth,
            getCustomRadius,
            // 方法
            setMenuOpen,
            setMenuType,
            setMenuThemeType,
            setMenuWidth,
            setThemeType,
            toggleTheme,
            setThemeColor,
            setShowWorkTab,
            setShowCrumbs,
            setShowNprogress,
            setUniqueOpened,
            setShowMenuButton,
            setShowRefreshButton,
            setShowLanguage,
            setColorWeak,
            setWatermarkVisible,
            setBoxBorderMode,
            setContainerWidth,
            setCustomRadius,
            setPageTransition,
            setTabStyle,
            initTheme
        }
    },
    {
        persist: true
    }
)
