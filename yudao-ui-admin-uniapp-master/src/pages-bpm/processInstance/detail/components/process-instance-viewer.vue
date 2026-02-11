<!-- 流程实例查看器 -->
<template>
  <view class="process-instance-viewer">
    <!-- BPMN 流程图 -->
    <view v-if="modelType === BpmModelType.BPMN" class="bpmn-viewer">
      <view v-if="!modelView?.bpmnXml" class="text-center text-[#999] py-48rpx">
        暂无BPMN流程图数据
      </view>
      <view v-else class="bpmn-container">
        <text class="block text-24rpx text-[#666] mb-16rpx">BPMN流程图</text>
        <view class="bg-gray-100 p-16rpx rounded-8rpx">
          <text class="text-20rpx text-[#999]">BPMN流程图预览功能正在开发中...</text>
          <!-- TODO: 实现BPMN流程图渲染 -->
          <view class="mt-16rpx text-18rpx text-[#999] bg-white p-16rpx rounded-8rpx">
            <text>提示：移动端暂不支持完整的BPMN流程图渲染，</text>
            <text>请在PC端查看详细的流程图。</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 简易流程图 -->
    <view v-else-if="modelType === BpmModelType.SIMPLE" class="simple-viewer">
      <view v-if="!modelView?.simpleModel" class="text-center text-[#999] py-48rpx">
        暂无简易流程图数据
      </view>
      <view v-else class="simple-container">
        <text class="block text-24rpx text-[#666] mb-16rpx">简易流程图</text>
        <view class="bg-gray-100 p-16rpx rounded-8rpx">
          <text class="text-20rpx text-[#999]">简易流程图预览功能正在开发中...</text>
          <!-- TODO: 实现简易流程图渲染 -->
          <view class="mt-16rpx text-18rpx text-[#999] bg-white p-16rpx rounded-8rpx">
            <text>提示：移动端暂不支持完整的简易流程图渲染，</text>
            <text>请在PC端查看详细的流程图。</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 未知类型 -->
    <view v-else class="text-center text-[#999] py-48rpx">
      未知流程图类型
    </view>
  </view>
</template>

<script lang="ts" setup>
import { BpmModelType } from '@/utils/constants'

defineProps<{
  /** 模型视图数据 */
  modelView?: any
  /** 模型类型 */
  modelType?: number
}>()
</script>

<style scoped>
.process-instance-viewer {
  width: 100%;
}

.bpmn-container,
.simple-container {
  width: 100%;
}

.bpmn-container canvas,
.simple-container canvas {
  max-width: 100%;
  height: auto;
}
</style>