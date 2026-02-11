<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      :title="isApprove ? '审批同意' : '审批拒绝'"
      left-arrow placeholder safe-area-inset-top fixed
      @click-left="handleBack"
    />

    <view class="p-24rpx">
      <!-- 节点/办理表单（与 PC 端「填写表单【formName】」一致，直接展示在页面内） -->
      <view v-if="taskFormDefinition" class="mb-24rpx rounded-16rpx overflow-hidden bg-white">
        <view class="px-24rpx pt-24rpx pb-12rpx">
          <text class="text-28rpx font-bold text-[#333]">填写表单【{{ taskFormName }}】</text>
        </view>
        <view class="px-24rpx pb-24rpx">
          <FormDetail
            ref="taskFormDetailRef"
            :process-definition="taskFormDefinition"
            :process-instance="taskFormInstance"
            :form-fields-permission="taskFormFieldsPermission"
          />
        </view>
      </view>

      <!-- 审批意见 -->
      <wd-form ref="formRef" :model="formData" :rules="formRules">
        <wd-cell-group border>
          <wd-textarea
            v-model="formData.reason"
            prop="reason"
            :label="isApprove ? '审批意见：' : '审批意见：'"
            label-width="180rpx"
            :placeholder="isApprove ? '请输入审批意见' : '请输入审批意见'"
            :maxlength="500"
            show-word-limit
            clearable
          />
        </wd-cell-group>
      </wd-form>

      <!-- 提交按钮 -->
      <view class="mt-48rpx">
        <wd-button
          :type="isApprove ? 'primary' : 'error'"
          block
          :loading="formLoading"
          :disabled="formLoading"
          @click="handleSubmit"
        >
          {{ isApprove ? '同意' : '拒绝' }}
        </wd-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'wot-design-uni/components/wd-form/types'
import { computed, onMounted, reactive, ref } from 'vue'
import { useToast } from 'wot-design-uni'
import { approveTask, rejectTask } from '@/api/bpm/task'
import { navigateBackPlus } from '@/utils'
import { BpmModelFormType } from '@/utils/constants'
import { FieldPermissionType } from '@/utils/constants'
import {
  getPendingFormVariables,
  clearPendingFormVariables,
  getPendingTaskForm,
  clearPendingTaskForm,
} from '../process-instance-form-store'
import FormDetail from '../components/form-detail.vue'

const props = defineProps<{
  processInstanceId?: string
  taskId?: string
  pass?: string
}>()

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

const taskId = computed(() => props.taskId || '')
const processInstanceId = computed(() => props.processInstanceId)
const isPass = computed(() => props.pass !== 'false')
const toast = useToast()
const formLoading = ref(false)
const formData = reactive({
  reason: '',
})

/** 审批意见与 PC 端一致：非必填 */
const formRules = {
  reason: [],
}

const formRef = ref<FormInstance>()
const taskFormDetailRef = ref<InstanceType<typeof FormDetail>>()

/** 节点表单（从 store 取出，与 PC 端弹窗内表单一致） */
const taskFormDefinition = ref<{
  formType: number
  formConf: string
  formFields: string[]
} | null>(null)
const taskFormInstance = ref<{ formVariables: Record<string, any> }>({ formVariables: {} })
const taskFormFieldsPermission = ref<Record<string, string>>({})
const taskFormName = ref('')

/** 根据 formFields 解析出所有字段的 prop，并设为可编辑（与 PC 办理表单一致） */
function buildTaskFormFieldsPermission(formFields: string[] | undefined): Record<string, string> {
  if (!formFields?.length) return {}
  const perm: Record<string, string> = {}
  formFields.forEach((f: any) => {
    try {
      const field = typeof f === 'string' ? JSON.parse(f) : f
      const prop = field?.prop ?? field?.field
      if (prop) perm[prop] = FieldPermissionType.WRITE
    } catch (_) {}
  })
  return perm
}

/** 是否为同意操作 */
const isApprove = computed(() => isPass.value)

function handleBack() {
  navigateBackPlus(`/pages-bpm/processInstance/detail/index?id=${processInstanceId.value}&taskId=${taskId.value}`)
}

/** 提交审批：合并流程表单变量 + 节点表单变量（与 PC 一致） */
async function handleSubmit() {
  if (formLoading.value) return
  const { valid } = await formRef.value!.validate()
  if (!valid) return

  formLoading.value = true
  try {
    if (isApprove.value) {
      const mainVars = getPendingFormVariables()
      const taskVars = taskFormDetailRef.value?.getFormVariables?.() ?? {}
      const variables = { ...mainVars, ...taskVars }
      await approveTask({
        id: taskId.value as string,
        reason: formData.reason,
        variables: Object.keys(variables).length > 0 ? variables : undefined,
      })
      clearPendingFormVariables()
      clearPendingTaskForm()
    } else {
      await rejectTask({
        id: taskId.value as string,
        reason: formData.reason,
      })
    }
    toast.success('审批成功')
    setTimeout(() => {
      uni.redirectTo({
        url: `/pages-bpm/processInstance/detail/index?id=${processInstanceId.value}&taskId=${taskId.value}`,
      })
    }, 1000)
  } finally {
    formLoading.value = false
  }
}

onMounted(() => {
  if (!props.taskId || !props.processInstanceId) {
    toast.show('参数错误')
    return
  }
  // 仅「同意」时展示节点/办理表单（与 PC 端点击「通过」后弹窗内的表单一致）
  if (isPass.value) {
    const taskForm = getPendingTaskForm()
    if (taskForm?.formConf && taskForm?.formFields?.length) {
      taskFormName.value = taskForm.formName || '节点表单'
      taskFormDefinition.value = {
        formType: BpmModelFormType.NORMAL,
        formConf: taskForm.formConf,
        formFields: taskForm.formFields,
      }
      taskFormInstance.value = { formVariables: taskForm.formVariables ?? {} }
      taskFormFieldsPermission.value = buildTaskFormFieldsPermission(taskForm.formFields)
    }
  }
})
</script>
