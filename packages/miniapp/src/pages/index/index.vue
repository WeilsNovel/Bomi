<template>
  <view class="index-page" :style="rootStyle">
    <view class="index-page__logo" :style="{ borderColor: THEME_COLOR_CONFIG.PRIMARY }">
      <text class="index-page__app-name" :style="{ color: THEME_COLOR_CONFIG.PRIMARY }">
        {{ DEFAULT_TEXT_CONFIG.APP_NAME }}
      </text>
    </view>
    <text class="index-page__stage" :style="{ color: THEME_COLOR_CONFIG.DEFAULT }">
      {{ PAGE_PARAMS.STAGE_LABEL }}
    </text>
  </view>
</template>

<script setup lang="ts">
import { DEFAULT_TEXT_CONFIG, THEME_COLOR_CONFIG, SIZE_CONFIG } from '@/config/constants';

/** 页面私有业务参数（第四层，仅本页生效） */
const PAGE_PARAMS = {
  /** Stage 标识文案 */
  STAGE_LABEL: 'Stage 1 · 小程序脚手架已就绪',
};

/** 页面根容器样式（间距引用 SIZE_CONFIG，避免硬编码尺寸） */
const rootStyle = {
  padding: `${SIZE_CONFIG.PAGE_PADDING}rpx`,
};
</script>

<style lang="scss" scoped>
.index-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;

  &__logo {
    width: 160rpx;
    height: 160rpx;
    border: 2rpx solid;
    border-radius: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32rpx;
  }

  &__app-name {
    font-size: 36rpx;
    font-weight: 600;
  }

  &__stage {
    font-size: 28rpx;
  }
}
</style>
