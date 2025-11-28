<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    destroy-on-close
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :label-width="labelWidth"
    >
      <el-form-item
        v-for="field in fields"
        :key="field.prop"
        :label="field.label"
        :prop="field.prop"
      >
        <!-- 输入框 -->
        <el-input
          v-if="field.type === 'input' || !field.type"
          v-model="formData[field.prop]"
          :placeholder="field.placeholder || `请输入${field.label}`"
          :disabled="field.disabled"
          clearable
        />

        <!-- 文本域 -->
        <el-input
          v-else-if="field.type === 'textarea'"
          v-model="formData[field.prop]"
          type="textarea"
          :rows="field.rows || 3"
          :placeholder="field.placeholder || `请输入${field.label}`"
          :disabled="field.disabled"
        />

        <!-- 下拉选择 -->
        <el-select
          v-else-if="field.type === 'select'"
          v-model="formData[field.prop]"
          :placeholder="field.placeholder || `请选择${field.label}`"
          :disabled="field.disabled"
          :style="{ width: field.width || '100%' }"
          clearable
        >
          <el-option
            v-for="opt in field.options"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>

        <!-- 开关 -->
        <el-switch
          v-else-if="field.type === 'switch'"
          v-model="formData[field.prop]"
          :disabled="field.disabled"
        />

        <!-- 数字输入 -->
        <el-input-number
          v-else-if="field.type === 'number'"
          v-model="formData[field.prop]"
          :min="field.min"
          :max="field.max"
          :disabled="field.disabled"
          :style="{ width: field.width || '100%' }"
        />

        <!-- 日期选择 -->
        <el-date-picker
          v-else-if="field.type === 'date'"
          v-model="formData[field.prop]"
          type="date"
          :placeholder="field.placeholder || `请选择${field.label}`"
          :disabled="field.disabled"
          :style="{ width: field.width || '100%' }"
        />

        <!-- 单选 -->
        <el-radio-group
          v-else-if="field.type === 'radio'"
          v-model="formData[field.prop]"
          :disabled="field.disabled"
        >
          <el-radio
            v-for="opt in field.options"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 自定义插槽 -->
      <slot name="form-extra" :data="formData"></slot>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

export interface FormField {
  prop: string
  label: string
  type?: 'input' | 'textarea' | 'select' | 'switch' | 'number' | 'date' | 'radio'
  placeholder?: string
  disabled?: boolean
  options?: { label: string; value: any }[]
  rows?: number
  min?: number
  max?: number
  width?: string
}

interface Props {
  modelValue: boolean
  title?: string
  width?: string
  labelWidth?: string
  fields: FormField[]
  rules?: FormRules
  data?: Record<string, any>
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '表单',
  width: '500px',
  labelWidth: '80px',
  rules: () => ({}),
  data: () => ({}),
  loading: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: Record<string, any>]
  'close': []
}>()

const visible = ref(props.modelValue)
const formRef = ref<FormInstance>()
const formData = reactive<Record<string, any>>({})

// 同步 v-model
watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    // 打开时初始化表单数据
    Object.keys(formData).forEach(key => delete formData[key])
    Object.assign(formData, props.data)
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

// 关闭
const handleClose = () => {
  visible.value = false
  emit('close')
}

// 提交
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate()
  emit('submit', { ...formData })
}

// 暴露方法
defineExpose({
  formRef,
  formData
})
</script>
