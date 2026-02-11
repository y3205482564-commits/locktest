<!-- 流程实例时间线 -->
<template>
  <view class="process-instance-timeline">
    <view v-if="!activityNodes || activityNodes.length === 0" class="text-center text-[#999] py-48rpx">
      暂无审批记录
    </view>
    <view v-else>
      <view v-for="(node, index) in activityNodes" :key="node.id || index" class="timeline-item">
        <!-- 时间线节点 -->
        <view class="timeline-node">
          <view class="node-dot" :class="getNodeStatusClass(node)"></view>
          <view v-if="index < activityNodes.length - 1" class="node-line"></view>
        </view>
        
        <!-- 节点内容 -->
        <view class="timeline-content">
          <view class="node-header">
            <text class="node-title">{{ node.name }}</text>
            <text v-if="node.status" class="node-status" :class="getNodeStatusTextClass(node.status)">
              {{ getNodeStatusText(node.status) }}
            </text>
          </view>
          
          <!-- 节点任务信息 -->
          <view v-if="node.tasks && node.tasks.length > 0" class="node-tasks">
            <view v-for="(task, taskIndex) in node.tasks" :key="task.id || taskIndex" class="task-item">
              <view class="task-header">
                <view class="task-user">
                  <view class="user-avatar">
                    {{ task.assigneeUser?.nickname?.[0] || '?' }}
                  </view>
                  <text class="user-name">{{ task.assigneeUser?.nickname || '未知用户' }}</text>
                </view>
                <text v-if="task.endTime" class="task-time">{{ formatPast(task.endTime) }}</text>
              </view>
              <view v-if="task.reason" class="task-reason">
                <text class="reason-label">审批意见：</text>
                <text class="reason-content">{{ task.reason }}</text>
              </view>
            </view>
          </view>
          
          <!-- 节点时间信息 -->
          <view v-if="node.startTime" class="node-time">
            <text class="time-text">{{ formatDateTime(node.startTime) }}</text>
            <text v-if="node.endTime" class="time-duration">
              (耗时 {{ getDuration(node.startTime, node.endTime) }})
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { formatDateTime, formatPast } from '@/utils/date'

const props = defineProps<{
  /** 审批节点信息 */
  activityNodes?: any[]
}>()

/** 获取节点状态文本 */
function getNodeStatusText(status?: number) {
  const map: Record<number, string> = {
    0: '待审批',
    1: '审批中',
    2: '审批通过',
    3: '审批不通过',
    4: '已取消',
    5: '已退回',
    6: '委派中',
    7: '审批通过中',
  }
  return map[status ?? 0] || '未知状态'
}

/** 获取节点状态样式 */
function getNodeStatusClass(node: any) {
  if (!node.status) return 'status-default'
  
  if ([1, 6, 7].includes(node.status)) {
    return 'status-running'
  }
  if (node.status === 2) {
    return 'status-success'
  }
  if (node.status === 3) {
    return 'status-error'
  }
  if (node.status === 4 || node.status === 5) {
    return 'status-warning'
  }
  return 'status-default'
}

/** 获取节点状态文本样式 */
function getNodeStatusTextClass(status?: number) {
  if (!status) return 'text-[#999]'
  
  if ([1, 6, 7].includes(status)) {
    return 'text-[#1890ff]'
  }
  if (status === 2) {
    return 'text-[#52c41a]'
  }
  if (status === 3) {
    return 'text-[#ff4d4f]'
  }
  if (status === 4 || status === 5) {
    return 'text-[#faad14]'
  }
  return 'text-[#999]'
}

/** 获取耗时 */
function getDuration(startTime: any, endTime: any) {
  if (!startTime || !endTime) return '0秒'
  
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()
  const duration = end - start
  
  const seconds = Math.floor(duration / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) {
    return `${days}天${hours % 24}小时`
  } else if (hours > 0) {
    return `${hours}小时${minutes % 60}分钟`
  } else if (minutes > 0) {
    return `${minutes}分钟${seconds % 60}秒`
  } else {
    return `${seconds}秒`
  }
}
</script>

<style scoped>
.process-instance-timeline {
  width: 100%;
}

.timeline-item {
  display: flex;
  margin-bottom: 32rpx;
}

.timeline-node {
  position: relative;
  width: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.node-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background-color: #d9d9d9;
  z-index: 1;
}

.node-line {
  width: 2rpx;
  flex: 1;
  background-color: #e5e5e5;
  position: absolute;
  top: 16rpx;
  bottom: 0;
  left: 19rpx;
}

.status-running {
  background-color: #1890ff;
}

.status-success {
  background-color: #52c41a;
}

.status-error {
  background-color: #ff4d4f;
}

.status-warning {
  background-color: #faad14;
}

.timeline-content {
  flex: 1;
  margin-left: 16rpx;
  background-color: #f5f5f5;
  padding: 16rpx;
  border-radius: 8rpx;
}

.node-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.node-title {
  font-size: 26rpx;
  font-weight: bold;
  color: #333;
}

.node-status {
  font-size: 22rpx;
}

.node-tasks {
  margin-bottom: 12rpx;
}

.task-item {
  margin-bottom: 16rpx;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid #e5e5e5;
}

.task-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.task-user {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background-color: #1890ff;
  color: white;
  font-size: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8rpx;
}

.user-name {
  font-size: 24rpx;
  color: #333;
}

.task-time {
  font-size: 20rpx;
  color: #999;
}

.task-reason {
  margin-top: 8rpx;
  padding: 12rpx;
  background-color: white;
  border-radius: 6rpx;
}

.reason-label {
  font-size: 22rpx;
  color: #666;
  margin-right: 8rpx;
}

.reason-content {
  font-size: 22rpx;
  color: #333;
  line-height: 1.4;
}

.node-time {
  margin-top: 12rpx;
  font-size: 20rpx;
  color: #999;
}

.time-duration {
  margin-left: 8rpx;
}
</style>