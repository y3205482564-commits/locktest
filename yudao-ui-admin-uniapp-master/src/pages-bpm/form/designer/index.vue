<template>
  <view class="yd-page-container">
    <wd-navbar
      title="表单设计"
      left-arrow placeholder safe-area-inset-top fixed
      @click-left="handleBack"
    />
    <view class="tip-box">
      <wd-status-tip image="network" tip="请使用PC端进行表单设计与新建" />
    </view>
  </view>
</template>

<script lang="ts" setup>
function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped>
.yd-page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}
.tip-box {
  padding: 48rpx 24rpx;
}
</style>
