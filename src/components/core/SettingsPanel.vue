<template>
  <el-drawer
    v-model="visible"
    size="300px"
    :with-header="false"
    :lock-scroll="true"
    modal-class="setting-modal"
  >
    <div class="settings-panel">
      <!-- 关闭按钮 -->
      <div class="panel-header">
        <div class="close-btn" @click="visible = false">
          <el-icon><Close /></el-icon>
        </div>
      </div>

      <!-- 主题风格 -->
      <SectionTitle :title="$t('setting.theme.title')" />
      <div class="setting-box-wrap">
        <div
          v-for="(item, index) in themeList"
          :key="item.theme"
          class="setting-item"
          @click="handleThemeChange(item.theme)"
        >
          <div class="box" :class="{ 'is-active': item.theme === systemThemeMode }">
            <img :src="item.img" :alt="item.name" />
          </div>
          <p class="name">{{ $t(`setting.theme.list[${index}]`) }}</p>
        </div>
      </div>

      <!-- 菜单布局 -->
      <SectionTitle :title="$t('setting.menuType.title')" />
      <div class="setting-box-wrap">
        <div
          v-for="(item, index) in layoutList"
          :key="item.value"
          class="setting-item"
          @click="handleLayoutChange(item.value)"
        >
          <div class="box" :class="{ 'is-active': item.value === menuType, 'mt-16': index > 2 }">
            <img :src="item.img" :alt="item.name" />
          </div>
          <p class="name">{{ $t(`setting.menuType.list[${index}]`) }}</p>
        </div>
      </div>

      <!-- 菜单风格 -->
      <SectionTitle :title="$t('setting.menuStyle.title')" />
      <div class="setting-box-wrap">
        <div
          v-for="item in menuThemeList"
          :key="item.theme"
          class="setting-item"
          @click="handleMenuStyleChange(item.theme)"
        >
          <div
            class="box"
            :class="{ 'is-active': item.theme === menuThemeType }"
            :style="{ cursor: menuStyleDisabled ? 'not-allowed' : 'pointer' }"
          >
            <img :src="item.img" :alt="item.theme" />
          </div>
        </div>
      </div>

      <!-- 系统主题色 -->
      <SectionTitle :title="$t('setting.color.title')" />
      <div class="color-list">
        <div
          v-for="color in colorList"
          :key="color"
          class="color-item"
          :style="{ backgroundColor: color }"
          :class="{ active: color === systemThemeColor }"
          @click="handleColorChange(color)"
        >
          <el-icon v-if="color === systemThemeColor" class="check"><Check /></el-icon>
        </div>
      </div>

      <!-- 盒子样式 -->
      <SectionTitle :title="$t('setting.box.title')" />
      <div class="box-style-wrap">
        <div
          class="box-style-item"
          :class="{ active: boxBorderMode }"
          @click="handleBoxStyleChange(true)"
        >
          {{ $t('setting.box.list[0]') }}
        </div>
        <div
          class="box-style-item"
          :class="{ active: !boxBorderMode }"
          @click="handleBoxStyleChange(false)"
        >
          {{ $t('setting.box.list[1]') }}
        </div>
      </div>

      <!-- 容器宽度 -->
      <SectionTitle :title="$t('setting.container.title')" />
      <div class="container-wrap">
        <div
          v-for="(option, index) in containerOptions"
          :key="option.value"
          class="container-item"
          :class="{ active: containerWidth === option.value }"
          @click="handleContainerChange(option.value)"
        >
          <el-icon class="container-icon">
            <component :is="option.icon" />
          </el-icon>
          <span>{{ $t(`setting.container.list[${index}]`) }}</span>
        </div>
      </div>

      <!-- 基础配置 -->
      <SectionTitle :title="$t('setting.basics.title')" />
      <div class="basic-settings">
        <div class="setting-row">
          <span>{{ $t('setting.basics.list.multiTab') }}</span>
          <el-switch v-model="showWorkTabVal" size="small" @change="handleWorkTabChange" />
        </div>
        <div class="setting-row">
          <span>{{ $t('setting.basics.list.accordion') }}</span>
          <el-switch v-model="uniqueOpenedVal" size="small" @change="handleUniqueOpenedChange" />
        </div>
        <div class="setting-row">
          <span>{{ $t('setting.basics.list.collapseSidebar') }}</span>
          <el-switch v-model="showMenuButtonVal" size="small" @change="handleMenuButtonChange" />
        </div>
        <div class="setting-row">
          <span>{{ $t('setting.basics.list.reloadPage') }}</span>
          <el-switch v-model="showRefreshButtonVal" size="small" @change="handleRefreshButtonChange" />
        </div>
        <div class="setting-row">
          <span>{{ $t('setting.basics.list.breadcrumb') }}</span>
          <el-switch v-model="showCrumbsVal" size="small" @change="handleCrumbsChange" />
        </div>
        <div class="setting-row">
          <span>{{ $t('setting.basics.list.language') }}</span>
          <el-switch v-model="showLanguageVal" size="small" @change="handleLanguageChange" />
        </div>
        <div class="setting-row">
          <span>{{ $t('setting.basics.list.progressBar') }}</span>
          <el-switch v-model="showNprogressVal" size="small" @change="handleNprogressChange" />
        </div>
        <div class="setting-row">
          <span>{{ $t('setting.basics.list.weakMode') }}</span>
          <el-switch v-model="colorWeakVal" size="small" @change="handleColorWeakChange" />
        </div>
        <div class="setting-row">
          <span>{{ $t('setting.basics.list.watermark') }}</span>
          <el-switch v-model="watermarkVisibleVal" size="small" @change="handleWatermarkChange" />
        </div>
        <div class="setting-row">
          <span>{{ $t('setting.basics.list.menuWidth') }}</span>
          <el-input-number
            v-model="menuWidthVal"
            :min="180"
            :max="320"
            :step="10"
            size="small"
            controls-position="right"
            style="width: 120px"
            @change="handleMenuWidthChange"
          />
        </div>
        <div class="setting-row">
          <span>{{ $t('setting.basics.list.tabStyle') }}</span>
          <el-select v-model="tabStyleVal" size="small" style="width: 120px" @change="handleTabStyleChange">
            <el-option :label="$t('setting.tabStyle.default')" value="default" />
            <el-option :label="$t('setting.tabStyle.card')" value="card" />
            <el-option :label="$t('setting.tabStyle.google')" value="google" />
            <el-option :label="$t('setting.tabStyle.simple')" value="simple" />
          </el-select>
        </div>
        <div class="setting-row">
          <span>{{ $t('setting.basics.list.pageTransition') }}</span>
          <el-select v-model="pageTransitionVal" size="small" style="width: 120px" @change="handlePageTransitionChange">
            <el-option :label="$t('setting.transition.list.none')" value="" />
            <el-option :label="$t('setting.transition.list.fade')" value="fade" />
            <el-option :label="$t('setting.transition.list.slideLeft')" value="slide-left" />
            <el-option :label="$t('setting.transition.list.slideBottom')" value="slide-bottom" />
            <el-option :label="$t('setting.transition.list.slideTop')" value="slide-top" />
          </el-select>
        </div>
        <div class="setting-row">
          <span>{{ $t('setting.basics.list.borderRadius') }}</span>
          <el-select v-model="customRadiusVal" size="small" style="width: 120px" @change="handleCustomRadiusChange">
            <el-option label="0" value="0" />
            <el-option label="0.25" value="0.25" />
            <el-option label="0.5" value="0.5" />
            <el-option label="0.75" value="0.75" />
            <el-option label="1" value="1" />
          </el-select>
        </div>
      </div>
    </div>
  </el-drawer>
</template>


<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Close, Check, FullScreen, Crop } from '@element-plus/icons-vue'
import { useSettingStore } from '@/store/modules/setting'
import { MenuTypeEnum, MenuThemeEnum, SystemThemeEnum, ContainerWidthEnum } from '@/enums/appEnum'
import AppConfig from '@/config'

// SectionTitle 组件
const SectionTitle = {
  props: ['title'],
  template: `<p class="section-title">{{ title }}</p>`
}

const visible = defineModel<boolean>({ default: false })

const settingStore = useSettingStore()
const {
  systemThemeMode,
  systemThemeColor,
  menuType,
  menuThemeType,
  showWorkTab,
  showCrumbs,
  showNprogress,
  uniqueOpened,
  showMenuButton,
  showRefreshButton,
  showLanguage,
  colorWeak,
  watermarkVisible,
  menuOpenWidth,
  boxBorderMode,
  containerWidth,
  customRadius,
  pageTransition,
  tabStyle,
  isDark
} = storeToRefs(settingStore)

// 配置列表
const themeList = AppConfig.settingThemeList
const layoutList = AppConfig.menuLayoutList
const menuThemeList = AppConfig.menuThemeList
const colorList = AppConfig.systemMainColor

// 容器宽度选项
const containerOptions = [
  { value: ContainerWidthEnum.FULL, icon: FullScreen },
  { value: ContainerWidthEnum.BOXED, icon: Crop }
]

// 菜单风格禁用状态
const menuStyleDisabled = computed(() => {
  return menuType.value === MenuTypeEnum.TOP || 
         menuType.value === MenuTypeEnum.DUAL_MENU || 
         isDark.value
})

// 本地状态（用于 switch 绑定）
const showWorkTabVal = ref(showWorkTab.value)
const showCrumbsVal = ref(showCrumbs.value)
const showNprogressVal = ref(showNprogress.value)
const uniqueOpenedVal = ref(uniqueOpened.value)
const showMenuButtonVal = ref(showMenuButton.value)
const showRefreshButtonVal = ref(showRefreshButton.value)
const showLanguageVal = ref(showLanguage.value)
const colorWeakVal = ref(colorWeak.value)
const watermarkVisibleVal = ref(watermarkVisible.value)
const menuWidthVal = ref(menuOpenWidth.value)
const tabStyleVal = ref(tabStyle.value)
const pageTransitionVal = ref(pageTransition.value)
const customRadiusVal = ref(customRadius.value)

// 同步 store 状态到本地
watch(showWorkTab, (val) => (showWorkTabVal.value = val))
watch(showCrumbs, (val) => (showCrumbsVal.value = val))
watch(showNprogress, (val) => (showNprogressVal.value = val))
watch(uniqueOpened, (val) => (uniqueOpenedVal.value = val))
watch(showMenuButton, (val) => (showMenuButtonVal.value = val))
watch(showRefreshButton, (val) => (showRefreshButtonVal.value = val))
watch(showLanguage, (val) => (showLanguageVal.value = val))
watch(colorWeak, (val) => (colorWeakVal.value = val))
watch(watermarkVisible, (val) => (watermarkVisibleVal.value = val))
watch(menuOpenWidth, (val) => (menuWidthVal.value = val))
watch(tabStyle, (val) => (tabStyleVal.value = val))
watch(pageTransition, (val) => (pageTransitionVal.value = val))
watch(customRadius, (val) => (customRadiusVal.value = val))

// 处理函数
const handleThemeChange = (theme: SystemThemeEnum) => {
  settingStore.setThemeType(theme)
}

const handleLayoutChange = (layout: MenuTypeEnum) => {
  settingStore.setMenuType(layout)
}

const handleMenuStyleChange = (theme: MenuThemeEnum) => {
  if (menuStyleDisabled.value) return
  settingStore.setMenuThemeType(theme)
}

const handleColorChange = (color: string) => {
  settingStore.setThemeColor(color)
}

const handleBoxStyleChange = (mode: boolean) => {
  settingStore.setBoxBorderMode(mode)
}

const handleContainerChange = (width: ContainerWidthEnum) => {
  settingStore.setContainerWidth(width)
}

const handleWorkTabChange = (val: boolean) => {
  settingStore.setShowWorkTab(val)
}

const handleCrumbsChange = (val: boolean) => {
  settingStore.setShowCrumbs(val)
}

const handleNprogressChange = (val: boolean) => {
  settingStore.setShowNprogress(val)
}

const handleUniqueOpenedChange = (val: boolean) => {
  settingStore.setUniqueOpened(val)
}

const handleMenuButtonChange = (val: boolean) => {
  settingStore.setShowMenuButton(val)
}

const handleRefreshButtonChange = (val: boolean) => {
  settingStore.setShowRefreshButton(val)
}

const handleLanguageChange = (val: boolean) => {
  settingStore.setShowLanguage(val)
}

const handleColorWeakChange = (val: boolean) => {
  settingStore.setColorWeak(val)
}

const handleWatermarkChange = (val: boolean) => {
  settingStore.setWatermarkVisible(val)
}

const handleMenuWidthChange = (val: number) => {
  settingStore.setMenuWidth(val)
}

const handleTabStyleChange = (val: string) => {
  settingStore.setTabStyle(val)
}

const handlePageTransitionChange = (val: string) => {
  settingStore.setPageTransition(val)
}

const handleCustomRadiusChange = (val: string) => {
  settingStore.setCustomRadius(val)
}
</script>


<style lang="scss" scoped>
.settings-panel {
  padding: 0 5px;
}

.panel-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;

  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.2s;

    &:hover {
      background: var(--el-fill-color);
    }

    .el-icon {
      font-size: 18px;
      color: var(--el-text-color-secondary);
    }
  }
}

.section-title {
  position: relative;
  margin: 28px 0 20px;
  font-size: 14px;
  color: var(--el-text-color-primary);
  text-align: center;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 50px;
    border-bottom: 1px solid var(--el-border-color-light);
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }
}

// 设置项容器
.setting-box-wrap {
  display: flex;
  flex-wrap: wrap;
  width: calc(100% + 15px);
  margin-bottom: 10px;

  .setting-item {
    box-sizing: border-box;
    width: calc(33.333% - 15px);
    margin-right: 15px;
    margin-bottom: 10px;
    text-align: center;
    cursor: pointer;

    .box {
      position: relative;
      box-sizing: border-box;
      display: flex;
      height: 52px;
      overflow: hidden;
      border: 2px solid var(--el-border-color);
      border-radius: 8px;
      box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
      transition: all 0.2s;

      &.mt-16 {
        margin-top: 16px;
      }

      &.is-active {
        border-color: var(--el-color-primary);
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .name {
      margin-top: 6px;
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }
}

// 颜色选择
.color-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 10px;

  .color-item {
    width: 23px;
    height: 23px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    &:hover {
      transform: scale(1.1);
    }

    &.active {
      box-shadow: 0 0 0 2px var(--el-bg-color), 0 0 0 4px currentColor;
    }

    .check {
      color: #fff;
      font-size: 14px;
    }
  }
}

// 盒子样式
.box-style-wrap {
  display: flex;
  padding: 4px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  margin-bottom: 10px;

  .box-style-item {
    flex: 1;
    height: 34px;
    line-height: 34px;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s;
    user-select: none;

    &:hover {
      color: var(--el-text-color-primary);
    }

    &.active {
      background: var(--el-bg-color);
      color: var(--el-text-color-primary);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  }
}

// 容器宽度
.container-wrap {
  display: flex;
  gap: 14px;
  margin-bottom: 10px;

  .container-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    border: 2px solid var(--el-border-color);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: var(--el-color-primary-light-5);
    }

    &.active {
      border-color: var(--el-color-primary);
      color: var(--el-color-primary);
    }

    .container-icon {
      margin-right: 8px;
      font-size: 18px;
    }

    span {
      font-size: 14px;
    }
  }
}

// 基础配置
.basic-settings {
  .setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;

    span {
      font-size: 14px;
      color: var(--el-text-color-regular);
    }
  }
}
</style>

<style lang="scss">
// 全局样式 - 抽屉背景
.setting-modal {
  background: transparent !important;

  .el-drawer {
    background: rgba(255, 255, 255, 0.8) !important;
    backdrop-filter: blur(10px);
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.1) !important;
  }

  .el-drawer__body {
    padding: 16px;

    &::-webkit-scrollbar {
      width: 0 !important;
    }
  }
}

.dark .setting-modal {
  .el-drawer {
    background: rgba(0, 0, 0, 0.8) !important;
  }
}

// 色弱模式
html.color-weak {
  filter: grayscale(100%);
}
</style>
