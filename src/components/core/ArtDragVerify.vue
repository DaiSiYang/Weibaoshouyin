<template>
  <div
    ref="dragVerifyRef"
    class="drag-verify"
    :style="dragVerifyStyle"
    @mousemove="dragMoving"
    @mouseup="dragFinish"
    @mouseleave="dragFinish"
    @touchmove="dragMoving"
    @touchend="dragFinish"
  >
    <!-- 进度条 -->
    <div
      ref="progressBarRef"
      class="progress-bar"
      :class="{ 'go-first': isOk }"
      :style="progressBarStyle"
    />

    <!-- 提示文本 -->
    <div ref="messageRef" class="text" :style="textStyle">
      {{ message }}
    </div>

    <!-- 滑块 -->
    <div
      ref="handlerRef"
      class="handler"
      :class="{ 'go-first': isOk }"
      :style="handlerStyle"
      @mousedown="dragStart"
      @touchstart="dragStart"
    >
      <el-icon v-if="!modelValue" class="icon"><DArrowRight /></el-icon>
      <el-icon v-else class="icon success"><Check /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, toRefs, onMounted, onBeforeUnmount } from 'vue'
import { DArrowRight, Check } from '@element-plus/icons-vue'

defineOptions({ name: 'ArtDragVerify' })

interface Props {
  modelValue: boolean
  width?: number | string
  height?: number
  text?: string
  successText?: string
  background?: string
  progressBarBg?: string
  completedBg?: string
  textColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  width: '100%',
  height: 40,
  text: '按住滑块拖动',
  successText: '验证成功',
  background: '#F1F1F4',
  progressBarBg: 'var(--el-color-primary)',
  completedBg: '#57D187',
  textColor: 'var(--el-text-color-regular)'
})

const emit = defineEmits(['update:modelValue', 'success'])

const state = reactive({
  isMoving: false,
  x: 0,
  isOk: false
})

const { isOk } = toRefs(state)

const dragVerifyRef = ref<HTMLElement>()
const messageRef = ref<HTMLElement>()
const handlerRef = ref<HTMLElement>()
const progressBarRef = ref<HTMLElement>()

const getNumericWidth = (): number => {
  if (typeof props.width === 'string') {
    return dragVerifyRef.value?.offsetWidth || 260
  }
  return props.width
}

const getStyleWidth = (): string => {
  if (typeof props.width === 'string') {
    return props.width
  }
  return props.width + 'px'
}

const handlerStyle = computed(() => ({
  left: '0',
  width: props.height + 'px',
  height: props.height + 'px',
  background: 'var(--el-bg-color)'
}))

const dragVerifyStyle = computed(() => ({
  width: getStyleWidth(),
  height: props.height + 'px',
  lineHeight: props.height + 'px',
  background: props.background,
  borderRadius: '8px'
}))

const progressBarStyle = computed(() => ({
  background: props.progressBarBg,
  height: props.height + 'px',
  borderRadius: '8px 0 0 8px'
}))

const textStyle = computed(() => ({
  fontSize: '13px',
  color: props.textColor
}))

const message = computed(() => {
  return props.modelValue ? props.successText : props.text
})

const dragStart = (e: MouseEvent | TouchEvent) => {
  if (!props.modelValue && handlerRef.value) {
    state.isMoving = true
    handlerRef.value.style.transition = 'none'
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX
    state.x = pageX - parseInt(handlerRef.value.style.left.replace('px', '') || '0', 10)
  }
}

const dragMoving = (e: MouseEvent | TouchEvent) => {
  if (state.isMoving && !props.modelValue && handlerRef.value && progressBarRef.value) {
    const numericWidth = getNumericWidth()
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX
    let _x = pageX - state.x

    if (_x > 0 && _x <= numericWidth - props.height) {
      handlerRef.value.style.left = _x + 'px'
      progressBarRef.value.style.width = _x + props.height / 2 + 'px'
    } else if (_x > numericWidth - props.height) {
      handlerRef.value.style.left = numericWidth - props.height + 'px'
      progressBarRef.value.style.width = numericWidth - props.height / 2 + 'px'
      passVerify()
    }
  }
}

const dragFinish = (e: MouseEvent | TouchEvent) => {
  if (state.isMoving && !props.modelValue && handlerRef.value && progressBarRef.value) {
    const numericWidth = getNumericWidth()
    const pageX = 'changedTouches' in e ? e.changedTouches[0].pageX : e.pageX
    let _x = pageX - state.x

    if (_x < numericWidth - props.height) {
      state.isOk = true
      handlerRef.value.style.left = '0'
      handlerRef.value.style.transition = 'all 0.2s'
      progressBarRef.value.style.width = '0'
      state.isOk = false
    } else {
      handlerRef.value.style.transition = 'none'
      handlerRef.value.style.left = numericWidth - props.height + 'px'
      progressBarRef.value.style.width = numericWidth - props.height / 2 + 'px'
      passVerify()
    }
    state.isMoving = false
  }
}

const passVerify = () => {
  emit('update:modelValue', true)
  state.isMoving = false
  if (progressBarRef.value) {
    progressBarRef.value.style.background = props.completedBg
  }
  if (messageRef.value) {
    messageRef.value.style.color = '#fff'
  }
  emit('success')
}

const reset = () => {
  if (handlerRef.value && progressBarRef.value && messageRef.value) {
    handlerRef.value.style.left = '0'
    progressBarRef.value.style.width = '0'
    progressBarRef.value.style.background = props.progressBarBg
    messageRef.value.style.color = props.textColor
    emit('update:modelValue', false)
    state.isOk = false
    state.isMoving = false
    state.x = 0
  }
}

defineExpose({ reset })
</script>

<style lang="scss" scoped>
.drag-verify {
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  text-align: center;
  border: 1px solid var(--el-border-color-light);
  user-select: none;

  .handler {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: move;
    border-radius: 8px;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);

    .icon {
      font-size: 18px;
      color: var(--el-text-color-secondary);
      
      &.success {
        color: #57D187;
      }
    }
  }

  .progress-bar {
    position: absolute;
    width: 0;
    transition: none;
  }

  .text {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
  }

  .go-first {
    left: 0 !important;
    width: 0 !important;
    transition: all 0.3s;
  }
}
</style>
