import { createI18n } from 'vue-i18n'
import zh from './langs/zh.json'
import en from './langs/en.json'

// 从 localStorage 获取保存的语言设置
const getDefaultLanguage = (): string => {
    try {
        const userStore = localStorage.getItem('user')
        if (userStore) {
            const { language } = JSON.parse(userStore)
            if (language) return language
        }
    } catch (error) {
        console.warn('获取语言设置失败:', error)
    }
    return 'zh'
}

const i18n = createI18n({
    locale: getDefaultLanguage(),
    legacy: false,
    globalInjection: true,
    fallbackLocale: 'zh',
    messages: {
        zh,
        en
    }
})

export default i18n
