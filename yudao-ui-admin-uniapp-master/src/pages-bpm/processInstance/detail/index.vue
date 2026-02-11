<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="审批详情"
      left-arrow placeholder safe-area-inset-top fixed
      @click-left="handleBack"
    />

    <!-- 区域：流程信息（基本信息） -->
    <view class="mx-24rpx mt-24rpx overflow-hidden rounded-16rpx bg-white">
      <view class="p-24rpx">
        <!-- 标题和状态 -->
        <view class="mb-16rpx flex items-center justify-between">
          <text class="text-32rpx text-[#333] font-bold">{{ processInstance?.name }}</text>
          <wd-tag :type="getStatusType(processInstance?.status)">
            {{ getStatusText(processInstance?.status) }}
          </wd-tag>
        </view>
        <!-- 发起人信息 -->
        <view class="flex items-center">
          <view class="mr-12rpx h-64rpx w-64rpx flex items-center justify-center rounded-full bg-[#1890ff] text-white">
            {{ processInstance?.startUser?.nickname?.[0] || '?' }}
          </view>
          <view>
            <text class="text-28rpx text-[#333]">{{ processInstance?.startUser?.nickname }}</text>
            <text v-if="processInstance?.startUser?.deptName" class="ml-8rpx text-24rpx text-[#999]">
              {{ processInstance?.startUser?.deptName }}
            </text>
          </view>
        </view>
        <!-- 提交时间 -->
        <view class="mt-16rpx text-24rpx text-[#999]">
          提交于 {{ formatDateTime(processInstance?.startTime) }}
        </view>
      </view>
    </view>

    <!-- 标签页切换 -->
    <view class="mt-24rpx bg-white">
      <wd-tabs v-model="activeTab" @change="handleTabChange">
        <wd-tab title="审批详情" />
        <wd-tab title="流程图" />
        <wd-tab title="审批/流转记录" />
      </wd-tabs>
      
      <!-- 审批详情：传入字段权限，可编辑字段可在流程中修改 -->
      <view v-show="activeTab === 0" class="p-24rpx">
        <FormDetail
          ref="formDetailRef"
          :process-definition="processDefinition"
          :process-instance="processInstance"
          :activity-nodes="activityNodes"
          :form-fields-permission="formFieldsPermission"
        />
      </view>
      
      <!-- 流程图 -->
      <view v-show="activeTab === 1" class="p-24rpx">
        <view v-if="loading" class="flex items-center justify-center py-48rpx">
          <wd-loading type="spinner" color="#1890ff" size="48rpx" />
        </view>
        <view v-else-if="!processModelView" class="py-48rpx text-center text-[#999]">
          暂无流程图数据
        </view>
        <view v-else>
          <ProcessInstanceViewer :model-view="processModelView" :model-type="processDefinition?.modelType" />
        </view>
      </view>
      
      <!-- 流转记录 -->
      <view v-show="activeTab === 2" class="p-24rpx">
        <ProcessInstanceTimeline :activity-nodes="activityNodes" />
      </view>
    </view>

    <!-- 区域：底部操作栏（可提交流程表单可编辑字段的修改值） -->
    <ProcessInstanceOperationButton
      ref="operationButtonRef"
      :process-instance="processInstance"
      :get-form-variables="getFormVariablesFromForm"
    />
  </view>
</template>

<script lang="ts" setup>
import type { ProcessDefinition, ProcessInstance } from '@/api/bpm/processInstance'
import type { Task } from '@/api/bpm/task'
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'wot-design-uni'
import { getApprovalDetail, getProcessInstanceBpmnModelView } from '@/api/bpm/processInstance'
import { getTaskListByProcessInstanceId } from '@/api/bpm/task'
import { useUserStore } from '@/store'
import { navigateBackPlus } from '@/utils'
import { formatDateTime, formatPast } from '@/utils/date'
import { BpmModelType } from '@/utils/constants'
import FormDetail from './components/form-detail.vue'
import ProcessInstanceOperationButton from './components/operation-button.vue'
import ProcessInstanceViewer from './components/process-instance-viewer.vue'
import ProcessInstanceTimeline from './components/process-instance-timeline.vue'

const props = defineProps<{
  id: string // 流程实例的编号
  taskId?: string // 任务编号
}>()

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

const toast = useToast()
const processInstance = ref<ProcessInstance>()
const processDefinition = ref<ProcessDefinition>()
const processModelView = ref<any>(null)
const activityNodes = ref<any[]>([])
const loading = ref(false)
const activeTab = ref(0)
/** 表单字段权限（从审批详情返回，用于流程表单只读/可编辑/隐藏） */
const formFieldsPermission = ref<Record<string, string>>()
const formDetailRef = ref<InstanceType<typeof FormDetail>>()
const operationButtonRef = ref()

/** 供操作按钮在「通过」时收集可编辑表单字段值，随审批提交 */
function getFormVariablesFromForm(): Record<string, any> {
  return formDetailRef.value?.getFormVariables?.() ?? {}
}

/** 标签页切换 */
function handleTabChange(event: any) {
  activeTab.value = event.index
  // 切换到流程图标签时加载流程图数据
  if (event.index === 1 && !processModelView.value) {
    loadProcessModelView()
  }
}

/** 返回上一页 */
function handleBack() {
  navigateBackPlus('/pages/bpm/index')
}

/** 获取状态文本 */
function getStatusText(status?: number) {
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
  return map[status ?? 0] || '待审批'
}

/** 获取状态标签类型 */
function getStatusType(status?: number): 'default' | 'primary' | 'success' | 'warning' | 'danger' {
  if ([1, 6, 7].includes(status ?? 0)) {
    return 'primary'
  }
  if (status === 2) {
    return 'success'
  }
  if (status === 3) {
    return 'danger'
  }
  if (status === 4 || status === 5) {
    return 'warning'
  }
  return 'default'
}

/** 加载流程实例 */
async function loadProcessInstance() {
  const data = await getApprovalDetail({
    processInstanceId: props.id,
    taskId: props.taskId,
  })
  if (!data || !data.processInstance) {
    toast.show('查询不到审批详情信息')
    return
  }
  processInstance.value = data.processInstance
  processDefinition.value = data.processDefinition
  activityNodes.value = data.activityNodes || []
  formFieldsPermission.value = data.formFieldsPermission ?? undefined
  operationButtonRef.value?.init(data.processInstance, data.todoTask)
}

/** 加载流程模型视图 */
async function loadProcessModelView() {
  if (!props.id) return
  
  loading.value = true
  try {
    const data = await getProcessInstanceBpmnModelView(props.id)
    if (data) {
      processModelView.value = data
    }
  } catch (error) {
    toast.show('获取流程图失败')
  } finally {
    loading.value = false
  }
}

/** 初始化 */
onMounted(async () => {
  if (!props.id) {
    toast.show('参数错误')
    return
  }
  await loadProcessInstance()
})
</script>

<style scoped>
/* 主容器样式 */
.yd-page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 标签页样式 */
:deep(.wd-tabs) {
  background-color: white;
}

:deep(.wd-tab) {
  font-size: 26rpx;
}

:deep(.wd-tabs__active-bar) {
  height: 4rpx;
  background-color: #1890ff;
}

:deep(.wd-tab--active) {
  color: #1890ff;
  font-weight: bold;
}

/* 内容区域样式 */
.form-scroll-area {
  max-height: 70vh;
  overflow-y: auto;
}

/* 流程图容器样式 */
.bpmn-container,
.simple-container {
  background-color: white;
  border-radius: 8rpx;
  padding: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

/* 加载状态样式 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300rpx;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300rpx;
  color: #999;
  font-size: 24rpx;
}

/* 响应式设计 */
@media (max-width: 375px) {
  .node-title {
    font-size: 24rpx;
  }
  
  .node-status {
    font-size: 20rpx;
  }
  
  .timeline-content {
    padding: 12rpx;
  }
}
</style>
