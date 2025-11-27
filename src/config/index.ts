/**
 * 系统全局配置
 */
import { MenuThemeEnum, MenuTypeEnum, SystemThemeEnum } from '@/enums/appEnum'

// 图片导入
import lightTheme from '@/assets/images/settings/theme_styles/light.png'
import darkTheme from '@/assets/images/settings/theme_styles/dark.png'
import systemTheme from '@/assets/images/settings/theme_styles/system.png'
import verticalLayout from '@/assets/images/settings/menu_layouts/vertical.png'
import horizontalLayout from '@/assets/images/settings/menu_layouts/horizontal.png'
import mixedLayout from '@/assets/images/settings/menu_layouts/mixed.png'
import dualColumnLayout from '@/assets/images/settings/menu_layouts/dual_column.png'
import designStyle from '@/assets/images/settings/menu_styles/design.png'
import darkStyle from '@/assets/images/settings/menu_styles/dark.png'
import lightStyle from '@/assets/images/settings/menu_styles/light.png'

const AppConfig = {
    // 系统信息
    systemInfo: {
        name: 'Weibaoshouyin'
    },
    // 系统主题列表
    settingThemeList: [
        {
            name: 'Light',
            theme: SystemThemeEnum.LIGHT,
            img: lightTheme
        },
        {
            name: 'Dark',
            theme: SystemThemeEnum.DARK,
            img: darkTheme
        },
        {
            name: 'System',
            theme: SystemThemeEnum.AUTO,
            img: systemTheme
        }
    ],
    // 菜单布局列表
    menuLayoutList: [
        { name: 'Left', value: MenuTypeEnum.LEFT, img: verticalLayout },
        { name: 'Top', value: MenuTypeEnum.TOP, img: horizontalLayout },
        { name: 'Mixed', value: MenuTypeEnum.TOP_LEFT, img: mixedLayout },
        { name: 'Dual Column', value: MenuTypeEnum.DUAL_MENU, img: dualColumnLayout }
    ],
    // 菜单主题列表
    menuThemeList: [
        {
            theme: MenuThemeEnum.DESIGN,
            background: '#FFFFFF',
            textColor: '#29343D',
            img: designStyle
        },
        {
            theme: MenuThemeEnum.DARK,
            background: '#191A23',
            textColor: '#BABBBD',
            img: darkStyle
        },
        {
            theme: MenuThemeEnum.LIGHT,
            background: '#ffffff',
            textColor: '#29343D',
            img: lightStyle
        }
    ],
    // 系统主色
    systemMainColor: [
        '#5D87FF',
        '#B48DF3',
        '#1D84FF',
        '#60C041',
        '#38C0FC',
        '#F9901F',
        '#FF80C8'
    ] as const
}

export default Object.freeze(AppConfig)
