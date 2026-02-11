<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="表单详情"
      left-arrow placeholder safe-area-inset-top fixed
      @click-left="handleBack"
    />

    <!-- 表单基本信息（与 PC 端一致） -->
    <view class="mx-24rpx mt-24rpx bg-white rounded-16rpx overflow-hidden">
      <view class="p-24rpx">
        <view class="flex justify-between items-center mb-16rpx">
          <text class="text-32rpx font-bold text-[#333]">{{ formData.name }}</text>
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="formData.status" />
        </view>
        <view class="mb-12rpx flex items-center text-24rpx text-[#666]">
          <text class="mr-8rpx shrink-0 text-[#999]">编号：</text>
          <text>{{ formId }}</text>
        </view>
        <view class="mb-12rpx flex items-center text-24rpx text-[#666]">
          <text class="mr-8rpx shrink-0 text-[#999]">创建时间：</text>
          <text>{{ formatDateTime(formData.createTime) }}</text>
        </view>
        <view class="mb-12rpx flex items-center text-24rpx text-[#666]">
          <text class="mr-8rpx shrink-0 text-[#999]">备注：</text>
          <text>{{ formData.remark || '无备注' }}</text>
        </view>
      </view>
    </view>

    <!-- 表单字段：与审批详情共用同一套 FormDetail，仅传 conf+fields、无 formVariables，全部只读 -->
    <view class="mt-24rpx">
      <FormDetail
        v-if="processDefinition"
        :process-definition="processDefinition"
        :process-instance="processInstance"
      />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useToast } from 'wot-design-uni'
import { getForm } from '@/api/bpm/form'
import FormDetail from '@/pages-bpm/processInstance/detail/components/form-detail.vue'
import { BpmModelFormType } from '@/utils/constants'
import { DICT_TYPE } from '@/utils/constants'
import { formatDateTime } from '@/utils/date'

const formId = ref<number>(0)

const formData = ref({
  name: '',
  status: 0,
  createTime: '',
  remark: ''
})

/** 供 FormDetail 使用：与审批详情一致的数据结构，此处无流程实例数据故 formVariables 为空 */
const processDefinition = ref<{
  formType: number
  formConf: string
  formFields: string[]
} | null>(null)

const processInstance = ref<{ formVariables: Record<string, any> }>({
  formVariables: {}
})

const toast = useToast()

function handleBack() {
  uni.navigateBack()
}

/** 加载表单数据，并构造与 PC 端一致的 formConf/formFields，供 FormDetail 渲染（只读预览） */
async function loadFormData(id: number) {
  if (!id) {
    toast.show('缺少表单编号')
    return
  }
  try {
    const data = await getForm(id)
    formData.value = {
      name: data.name,
      status: data.status,
      createTime: data.createTime,
      remark: data.remark
    }
    const conf = data.conf ?? (data as any).formConf
    const fields = data.fields ?? (data as any).formFields
    processDefinition.value = {
      formType: BpmModelFormType.NORMAL,
      formConf: conf,
      formFields: fields ?? []
    }
    processInstance.value = { formVariables: {} }
  } catch (error) {
    toast.show('加载表单数据失败')
    console.error('加载表单数据失败:', error)
  }
}

onLoad((options: any) => {
  const id = options?.id != null ? Number(options.id) : 0
  formId.value = id
  loadFormData(id)
})
</script>

<style scoped>
.yd-page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>
