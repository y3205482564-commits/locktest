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

        <!-- 审批详情功能框：与审批详情页一致的表单展示/编辑，按权限可编辑 -->
        <view v-if="processDefinitionForForm" class="mb-30rpx rounded-16rpx overflow-hidden bg-white">
          <view class="px-24rpx pt-24rpx pb-12rpx">
            <text class="text-28rpx font-bold text-[#333]">表单填写</text>
          </view>
          <view class="px-24rpx pb-24rpx">
            <FormDetail
              ref="formDetailRef"
              :process-definition="processDefinitionForForm"
              :process-instance="processInstanceForForm"
              :activity-nodes="activityNodes"
              :form-fields-permission="formFieldsPermission"
            />
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
import { BpmModelFormType } from '@/utils/constants'
import { FieldPermissionType } from '@/utils/constants'
import * as ProcessInstanceApi from '@/api/bpm/processInstance'
import * as DefinitionApi from '@/api/bpm/definition'
import FormDetail from '../detail/components/form-detail.vue'

const toast = useToast()

const loading = ref(true)
const submitting = ref(false)
const processDefinition = ref<ProcessDefinition | null>(null)
const activityNodes = ref<any[]>([])
const bpmnXML = ref<string | null>(null)
const simpleJson = ref<string | undefined>(null)

/** 供 FormDetail 使用：流程定义（表单类型、conf、fields） */
const processDefinitionForForm = ref<{
  formType: number
  formConf: string
  formFields: string | string[]
} | null>(null)
/** 发起时无实例数据，表单值为空，由用户填写 */
const processInstanceForForm = ref<{ formVariables: Record<string, any> }>({ formVariables: {} })
/** 表单字段权限：来自审批详情接口；发起时若无则默认全部可编辑 */
const formFieldsPermission = ref<Record<string, string>>({})

const formDetailRef = ref<InstanceType<typeof FormDetail>>()

/** 从 formFields 解析出所有字段 prop，并设为可编辑（发起时后端未返回权限时的兜底） */
function buildAllWritePermission(formFields: string | string[] | undefined): Record<string, string> {
  if (!formFields) return {}
  try {
    const arr = typeof formFields === 'string' ? JSON.parse(formFields) : formFields
    const list = Array.isArray(arr) ? arr : []
    const perm: Record<string, string> = {}
    list.forEach((f: any) => {
      const field = typeof f === 'string' ? JSON.parse(f) : f
      const prop = field?.prop ?? field?.field
      if (prop) perm[prop] = FieldPermissionType.WRITE
    })
    return perm
  } catch {
    return {}
  }
}

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

    // 2. 获取审批详情（发起人节点）：用于审批节点列表 + 表单字段权限）
    const data = await ProcessInstanceApi.getApprovalDetail({
      processDefinitionId,
      activityId: 'StartUserNode',
      processVariablesStr: JSON.stringify({})
    })

    if (data) {
      activityNodes.value = data.activityNodes || []
      // 使用接口返回的字段权限；若无则发起时默认全部可编辑
      if (data.formFieldsPermission && Object.keys(data.formFieldsPermission).length > 0) {
        formFieldsPermission.value = data.formFieldsPermission
      } else {
        formFieldsPermission.value = buildAllWritePermission(definitionDetail.formFields)
      }
    }

    // 3. 流程表单：与审批详情页一致的「审批详情」展示与编辑
    if (definitionDetail.formType === BpmModelFormType.NORMAL && definitionDetail.formConf && definitionDetail.formFields) {
      processDefinitionForForm.value = {
        formType: BpmModelFormType.NORMAL,
        formConf: definitionDetail.formConf,
        formFields: definitionDetail.formFields
      }
      processInstanceForForm.value = { formVariables: {} }
    } else {
      processDefinitionForForm.value = null
    }

    // 4. 流程图数据
    bpmnXML.value = definitionDetail.bpmnXml
    simpleJson.value = definitionDetail.simpleModel
  } catch (error) {
    console.error('加载流程信息失败:', error)
    toast.show('加载流程信息失败')
  } finally {
    loading.value = false
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
    const variables = formDetailRef.value?.getFormVariables?.() ?? {}
    await ProcessInstanceApi.createProcessInstance({
      processDefinitionId: processDefinition.value.id,
      variables,
      startUserSelectAssignees: {}
    })

    toast.show('发起流程成功')

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
