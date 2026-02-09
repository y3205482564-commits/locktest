<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    <view class="button-area">
      <button class="lock-button" @click="goToLockPage">智能锁开锁</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: '智能锁管理系统',
    }
  },
  onLoad() {},
  methods: {
    goToLockPage() {
      uni.navigateTo({
        url: '/pages/lock/blueLock'
      });
    }
  },
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40rpx;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
  margin-bottom: 80rpx;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}

.button-area {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 40rpx;
}

.lock-button {
  width: 80%;
  height: 100rpx;
  line-height: 100rpx;
  background-color: #007aff;
  color: #ffffff;
  border-radius: 50rpx;
  font-size: 32rpx;
  border: none;
  box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.3);
}

.lock-button:active {
  background-color: #0051d5;
  opacity: 0.9;
}
</style>
