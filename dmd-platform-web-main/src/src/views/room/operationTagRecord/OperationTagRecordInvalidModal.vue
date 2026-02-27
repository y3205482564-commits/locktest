<script lang="ts" setup>
import { ref, unref } from 'vue'
import { invalidFormSchema } from './operationTagRecord.data'
import { useI18n } from '@/hooks/web/useI18n'
import { useMessage } from '@/hooks/web/useMessage'
import { BasicForm, useForm } from '@/components/Form'
import { BasicModal, useModalInner } from '@/components/Modal'
import { getOperationTagRecord } from '@/api/room/operationTagRecord/operationTagRecord'
import { invalidOperationTagRecord } from '@/api/room/operationTagRecord/operationTagRecord'

defineOptions({ name: 'DigitalCardOperationTagRecordInvalidModal' })

const emit = defineEmits(['success', 'register'])
const { t } = useI18n()
const { createMessage } = useMessage()

// 注册表单
const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
  labelWidth: 120,
  baseColProps: { span: 24 },
  schemas: invalidFormSchema,
  showActionButtonGroup: false,
  actionColOptions: { span: 23 },
})

// 注册弹窗
const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
  resetFields()
  setModalProps({ confirmLoading: false })

  // 获取记录详情并回显
  if (data.record?.id) {
    const record = await getOperationTagRecord(data.record.id)
    setFieldsValue({
      id: record.id,
      tagId: record.tagId,
      usePerson: record.usePerson,
      remark: ''
    })
  }
})

/**
 * 提交作废操作
 */
async function handleSubmit() {
  try {
    const values = await validate()
    setModalProps({ confirmLoading: true })

    // 调用作废接口
    await invalidOperationTagRecord({
      id: values.id,
      remark: values.remark
    })

    closeModal()
    emit('success')
    createMessage.success('记录作废成功！')
  }
  finally {
    setModalProps({ confirmLoading: false })
  }
}
</script>

<template>
  <BasicModal
    v-bind="$attrs"
    title="操作牌记录作废"
    @register="registerModal"
    @ok="handleSubmit"
    destroyOnClose
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
