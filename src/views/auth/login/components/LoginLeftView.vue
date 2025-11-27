<template>
  <div class="login-left-view">
    <!-- Logo -->
    <div class="logo">
      <ArtLogo :size="46" />
      <h1 class="title">{{ AppConfig.systemInfo.name }}</h1>
    </div>

    <!-- 中间图标 -->
    <div class="left-img">
      <ThemeSvg :src="loginIcon" size="100%" />
    </div>

    <!-- 底部文字 -->
    <div class="text-wrap">
      <h1>{{ $t('login.leftView.title') }}</h1>
      <p>{{ $t('login.leftView.subTitle') }}</p>
    </div>

    <!-- 几何装饰元素 -->
    <div class="geometric-decorations">
      <div class="geo-element circle-outline"></div>
      <div class="geo-element square-rotated"></div>
      <div class="geo-element circle-small"></div>
      <div class="geo-element square-bottom-right"></div>
      <div class="geo-element bg-bubble"></div>
      <div class="geo-element circle-top-right" @click="handleThemeClick"></div>
      <div class="geo-element dot dot-1"></div>
      <div class="geo-element dot dot-2"></div>
      <div class="geo-element dot dot-3"></div>
      <div class="squares-group">
        <i class="geo-element square square-blue"></i>
        <i class="geo-element square square-pink"></i>
        <i class="geo-element square square-purple"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ArtLogo from '@/components/core/ArtLogo.vue'
import ThemeSvg from '@/components/core/ThemeSvg.vue'
import AppConfig from '@/config'
import { themeAnimation } from '@/utils/animation'
import loginIcon from '@/assets/images/svg/login_icon.svg'

const handleThemeClick = (e: MouseEvent) => {
  themeAnimation(e)
}
</script>

<style lang="scss" scoped>
$primary-light-7: var(--el-color-primary-light-7);
$primary-light-8: var(--el-color-primary-light-8);
$primary-light-9: var(--el-color-primary-light-9);
$primary-base: var(--el-color-primary);

.login-left-view {
  position: relative;
  width: 60vw;
  height: 100%;
  padding: 15px;
  overflow: hidden;
  background-color: var(--el-color-primary-light-9);

  @media (max-width: 1180px) {
    display: none;
  }

  .logo {
    position: relative;
    z-index: 100;
    display: flex;
    align-items: center;

    .title {
      margin-left: 10px;
      font-size: 20px;
      font-weight: 500;
      color: var(--el-text-color-primary);
    }
  }

  .left-img {
    position: absolute;
    inset: 0 0 10%;
    z-index: 10;
    width: 40%;
    margin: auto;
    animation: slideInLeft 0.6s ease-out;
  }

  .text-wrap {
    position: absolute;
    bottom: 80px;
    width: 100%;
    text-align: center;
    animation: slideInLeft 0.6s ease-out;

    h1 {
      font-size: 24px;
      font-weight: 500;
      color: var(--el-text-color-primary);
    }

    p {
      margin-top: 10px;
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }
}

// 几何装饰
.geometric-decorations {
  .geo-element {
    position: absolute;
    animation: fadeIn 0.8s ease-out forwards;
  }

  .circle-outline {
    top: 10%;
    left: 25%;
    width: 42px;
    height: 42px;
    border: 2px solid $primary-light-8;
    border-radius: 50%;
  }

  .square-rotated {
    top: 50%;
    left: 16%;
    width: 60px;
    height: 60px;
    background-color: var(--el-color-primary-light-8);
    transform: rotate(-25deg);
  }

  .circle-small {
    bottom: 26%;
    left: 30%;
    width: 18px;
    height: 18px;
    background-color: $primary-light-8;
    border-radius: 50%;
  }

  .circle-top-right {
    top: 3%;
    right: 3%;
    z-index: 100;
    width: 50px;
    height: 50px;
    cursor: pointer;
    background: var(--el-color-primary-light-7);
    border-radius: 50%;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 0 36px #fffc00;
      background: linear-gradient(to right, #fcbb04, #fffc00);
    }
  }

  .square-bottom-right {
    right: 10%;
    bottom: 10%;
    width: 50px;
    height: 50px;
    background-color: $primary-light-8;
    transform: rotate(45deg);
  }

  .bg-bubble {
    top: -120px;
    right: -120px;
    width: 360px;
    height: 360px;
    background-color: var(--el-color-primary-light-8);
    border-radius: 50%;
  }

  .dot {
    width: 14px;
    height: 14px;
    background-color: $primary-light-7;
    border-radius: 50%;

    &.dot-1 {
      top: 140px;
      left: 100px;
    }

    &.dot-2 {
      top: 140px;
      right: 120px;
    }

    &.dot-3 {
      top: 46%;
      right: 22%;
      background-color: $primary-light-8;
    }
  }

  .squares-group {
    position: absolute;
    bottom: 18px;
    left: 20px;
    width: 140px;
    height: 140px;

    .square {
      position: absolute;
      display: block;
      border-radius: 8px;

      &.square-blue {
        top: 12px;
        left: 30px;
        z-index: 2;
        width: 50px;
        height: 50px;
        background-color: rgba(var(--el-color-primary-rgb), 0.3);
        transform: rotate(-10deg);
      }

      &.square-pink {
        top: 30px;
        left: 48px;
        z-index: 1;
        width: 70px;
        height: 70px;
        background-color: rgba(var(--el-color-primary-rgb), 0.15);
        transform: rotate(10deg);
      }

      &.square-purple {
        top: 66px;
        left: 86px;
        z-index: 3;
        width: 32px;
        height: 32px;
        background-color: rgba(var(--el-color-primary-rgb), 0.45);
      }
    }
  }
}

// 暗色主题
.dark .login-left-view {
  background-color: var(--el-bg-color);

  .geometric-decorations {
    .circle-top-right {
      box-shadow: 0 0 25px #333 inset;

      &:hover {
        box-shadow: 0 40px 25px #ddd inset;
        background: var(--el-color-primary-light-8);
      }
    }
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
