# 维保收银系统

基于 Art Design Pro 风格的后台管理系统

## 功能特性

✅ **完整的布局系统**
- 侧边栏菜单（支持折叠/展开）
- 顶部导航栏
- 响应式布局

✅ **顶部栏功能**
- 🔍 全局搜索（快捷键 ⌘K）
- 🌐 中英文切换
- 🌓 亮色/暗色主题切换（带圆形扩散动画）
- 🔔 通知中心（带红点提示）
- 💬 消息中心（带红点提示）
- ⚙️ 系统设置
- 🖥️ 全屏切换
- 👤 用户菜单（个人中心、文档、GitHub、锁屏、退出登录）

✅ **主题系统**
- 🎨 圆形扩散动画（基于 View Transition API）
- 🎯 点击位置智能识别
- 🌈 自动生成主题色系列（9个亮度级别）
- 💾 主题设置自动持久化
- 🔄 平滑过渡效果

✅ **动画效果**
- 图标 Hover 动画（上下浮动、旋转、抖动）
- 主题切换圆形扩散动画
- 菜单折叠/展开动画
- 页面切换过渡动画

✅ **技术栈**
- Vue 3.5 + Composition API
- TypeScript 5.6
- Element Plus 2.11（UI组件库）
- Vue Router 4.5（路由）
- Pinia 3.0（状态管理）
- Vue I18n 9.14（国际化）
- VueUse（工具函数）
- Sass（样式预处理）

## 安装依赖

```bash
npm install
# 或使用国内镜像
npm install --registry=https://registry.npmmirror.com
```

## 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 构建生产版本

```bash
npm run build
```

## 项目结构

```
src/
├── layout/                 # 布局组件
│   ├── index.vue          # 主布局
│   └── components/        # 布局子组件
│       └── HeaderBar.vue  # 顶部栏
├── views/                 # 页面视图
│   ├── dashboard/        # 仪表盘
│   ├── user-center/      # 用户中心
│   ├── system/           # 组件中心
│   └── ...
├── router/               # 路由配置
├── store/                # 状态管理
│   └── modules/
│       ├── user.ts       # 用户状态
│       └── setting.ts    # 设置状态
├── locales/              # 国际化
│   └── langs/
│       ├── zh.json       # 中文
│       └── en.json       # 英文
└── styles/               # 全局样式
```

## 主要功能说明

### 1. 侧边栏菜单
- 点击左上角 Logo 返回首页
- 点击顶部栏的折叠按钮可以收起/展开菜单
- 菜单项自动高亮当前页面

### 2. 主题切换
- 点击顶部栏的太阳/月亮图标切换亮色/暗色主题
- 主题设置会自动保存到本地存储

### 3. 语言切换
- 点击顶部栏的语言图标切换中英文
- 支持中文和英文两种语言
- 语言设置会自动保存

### 4. 用户菜单
- 点击头像打开下拉菜单
- 包含个人中心、文档、GitHub、锁屏、退出登录等功能

### 5. 通知和消息
- 顶部栏显示通知和消息数量
- 点击可查看详情（功能开发中）

## 开发说明

### 添加新页面

1. 在 `src/views/` 下创建新的页面组件
2. 在 `src/router/index.ts` 中添加路由配置
3. 在 `src/locales/langs/` 中添加对应的翻译文本

### 修改主题色

在 `src/store/modules/setting.ts` 中修改 `systemThemeColor` 的默认值

### 自定义菜单图标

在路由配置的 `meta.icon` 中指定 Element Plus 图标名称

## 注意事项

1. 项目使用 Vue 3 Composition API，需要熟悉 `<script setup>` 语法
2. 使用了 `unplugin-auto-import`，Vue API 和 Element Plus 组件会自动导入
3. 暗色主题通过给 `html` 元素添加 `dark` class 实现
4. 所有状态通过 Pinia 管理，并自动持久化到 localStorage

## 参考项目

本项目参考了 [Art Design Pro](https://github.com/Daymychen/art-design-pro) 的设计风格和功能实现。
