<template>
  <div class="page-container">
    <h1>{{ $t('menus.dashboard') }}</h1>
    <p>这里是仪表盘内容区域</p>
  </div>
</template>

<style scoped lang="scss">
.page-container {
  h1 {
    font-size: 24px;
    margin-bottom: 16px;
    color: var(--el-text-color-primary);
  }

  p {
    color: var(--el-text-color-secondary);
  }
}
</style>
