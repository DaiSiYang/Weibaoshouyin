<template>
  <div class="page-container">
    <h1>{{ $t('menus.dashboard') }}</h1>
    <p>这里是仪表盘内容区域</p>
  </div>
</template>


<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import {testsecondary} from "@/api/home"
import {onMounted} from "vue";


const fetchData = async () => {
  try {
    const response = await testsecondary();
    console.log('API Response:', response);
  } catch (error) {
    console.error('API Error:', error);
  }
};

onMounted(() => {
  fetchData();
});


</script>

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
