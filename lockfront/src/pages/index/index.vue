<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    <view class="nav-list">
      <view class="nav-item" @click="navigateToBlueLock">
        <text class="nav-text">智能锁开锁页面</text>
        <text class="nav-arrow">→</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: 'UniApp 项目首页',
    }
  },
  onLoad() {},
  methods: {
    navigateToBlueLock() {
      uni.navigateTo({
        url: '/pages/blueLock/blueLock'
      })
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

.nav-list {
  width: 100%;
  max-width: 600rpx;
}

.nav-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 40rpx;
  margin-bottom: 20rpx;
  background: #fff;
  border-radius: 10rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.nav-item:active {
  background: #f5f5f5;
  transform: scale(0.98);
}

.nav-text {
  font-size: 32rpx;
  color: #333;
}

.nav-arrow {
  font-size: 32rpx;
  color: #999;
}
</style>
