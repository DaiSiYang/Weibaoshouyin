<template>
  <el-config-provider :locale="locales[language]">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from './store/modules/user'
import { useSettingStore } from './store/modules/setting'
import zh from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

const userStore = useUserStore()
const settingStore = useSettingStore()
const { language } = storeToRefs(userStore)

const locales = {
  zh: zh,
  en: en
}

// 初始化主题
settingStore.initTheme()
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  overflow: hidden;
}
</style>
