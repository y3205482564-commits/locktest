<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      :title="processDefinition?.name || '表单填写'"
      left-arrow placeholder safe-area-inset-top fixed
      @click-left="handleBack"
    />

    <!-- 表单内容 -->
    <scroll-view
      scroll-y
      class="h-[calc(100vh-120rpx)]"
      v-loading="loading"
    >
      <view class="p-30rpx">
        <!-- 流程名称 -->
        <view class="text-28rpx font-bold mb-20rpx text-[#333]">流程：{{ processDefinition?.name }}</view>
        <wd-divider class="my-20rpx" />

        <!-- 表单渲染区域 -->
        <view v-if="formConfig.rule.length > 0">
          <!-- TODO: 实现表单渲染 -->
          <view class="mb-30rpx">
            <text class="text-26rpx text-[#666]">表单渲染功能开发中...</text>
          </view>
        </view>
        
        <!-- 审批节点预览 -->
        <view class="mt-40rpx">
          <view class="text-28rpx font-bold mb-20rpx text-[#333]">审批流程</view>
          <view class="bg-white rounded-16rpx p-24rpx">
            <view v-for="(node, index) in activityNodes" :key="node.id" class="flex items-start mb-20rpx last:mb-0">
              <!-- 节点图标 -->
              <view class="relative">
                <view class="w-16rpx h-16rpx rounded-full bg-[#4A7FEB] flex items-center justify-center mr-20rpx mt-10rpx"></view>
                <!-- 连接线 -->
                <view v-if="index < activityNodes.length - 1" class="absolute left-8rpx top-24rpx w-1rpx h-100% bg-[#E5E5E5]"></view>
              </view>
              <!-- 节点信息 -->
              <view class="flex-1">
                <view class="text-26rpx font-medium text-[#333]">{{ node.name }}</view>
                <view v-if="node.candidateStrategyName" class="text-24rpx text-[#999] mt-4rpx">{{ node.candidateStrategyName }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部提交按钮 -->
    <view class="fixed bottom-0 left-0 right-0 bg-white p-30rpx border-t border-[#F0F0F0]">
      <wd-button type="primary" block @click="handleSubmit" :loading="submitting">发起流程</wd-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { ProcessDefinition } from '@/api/bpm/definition'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useToast } from 'wot-design-uni'
import * as ProcessInstanceApi from '@/api/bpm/processInstance'
import * as DefinitionApi from '@/api/bpm/definition'

const toast = useToast()

const loading = ref(true)
const submitting = ref(false)
const processDefinition = ref<ProcessDefinition | null>(null)
const formConfig = ref({
  rule: [],
  option: {},
  value: {}
})
const activityNodes = ref<any[]>([])
const bpmnXML = ref<string | null>(null)
const simpleJson = ref<string | undefined>(null)

// 获取路由参数
const onLoadCallback = (options: any) => {
  const processDefinitionId = options.processDefinitionId
  if (processDefinitionId) {
    loadProcessInfo(processDefinitionId)
  } else {
    toast.show('参数错误')
    uni.navigateBack()
  }
}

onLoad(onLoadCallback)

/** 加载流程信息 */
async function loadProcessInfo(processDefinitionId: string) {
  loading.value = true
  try {
    // 1. 获取流程定义详情
    const definitionDetail = await DefinitionApi.getProcessDefinition(processDefinitionId)
    processDefinition.value = definitionDetail
    
    // 2. 获取表单配置
    if (definitionDetail.formConf && definitionDetail.formFields) {
      // TODO: 解析表单配置，实际项目中需要根据表单配置渲染表单
      formConfig.value = {
        rule: [], // 实际项目中需要解析表单字段
        option: JSON.parse(definitionDetail.formConf || '{}'),
        value: {}
      }
    }
    
    // 3. 获取审批节点信息
    await getApprovalDetail(processDefinitionId)
    
    // 4. 获取流程图数据
    bpmnXML.value = definitionDetail.bpmnXml
    simpleJson.value = definitionDetail.simpleModel
  } catch (error) {
    console.error('加载流程信息失败:', error)
    toast.show('加载流程信息失败')
  } finally {
    loading.value = false
  }
}

/** 获取审批详情 */
async function getApprovalDetail(processDefinitionId: string) {
  try {
    const data = await ProcessInstanceApi.getApprovalDetail({
      processDefinitionId,
      activityId: 'StartUserNode', // 发起人节点ID
      processVariablesStr: JSON.stringify({})
    })
    
    if (data) {
      activityNodes.value = data.activityNodes || []
    }
  } catch (error) {
    console.error('获取审批详情失败:', error)
  }
}

/** 返回上一页 */
function handleBack() {
  uni.navigateBack()
}

/** 提交表单 */
async function handleSubmit() {
  if (!processDefinition.value) {
    return
  }
  
  submitting.value = true
  try {
    // TODO: 实际项目中需要进行表单验证
    
    // 提交流程实例
    await ProcessInstanceApi.createProcessInstance({
      processDefinitionId: processDefinition.value.id,
      variables: formConfig.value.value,
      startUserSelectAssignees: {}
    })
    
    toast.show('发起流程成功')
    
    // 返回流程列表页
    uni.redirectTo({
      url: '/pages-bpm/processInstance/list/index'
    })
  } catch (error: any) {
    console.error('发起流程失败:', error)
    toast.show(error.msg || '发起流程失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
</style>