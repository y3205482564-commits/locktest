<script lang="ts" setup>
import { ref, unref } from 'vue'
import { formSchema } from './operationTagRecord.data'
import { useI18n } from '@/hooks/web/useI18n'
import { useMessage } from '@/hooks/web/useMessage'
import { BasicForm, useForm } from '@/components/Form'
import { BasicModal, useModalInner } from '@/components/Modal'
import { createOperationTagRecord, getOperationTagRecord, updateOperationTagRecord } from '@/api/room/operationTagRecord/operationTagRecord'

defineOptions({ name: 'DigitalCardOperationTagRecordModal' })

const emit = defineEmits(['success', 'register'])
const { t } = useI18n()
const { createMessage } = useMessage()
const isUpdate = ref(true)

// 注册表单
const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
  labelWidth: 120,
  baseColProps: { span: 24 },
  schemas: formSchema,
  showActionButtonGroup: false,
  actionColOptions: { span: 23 },
})

// 注册弹窗
const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
  resetFields()
  setModalProps({ confirmLoading: false })
  isUpdate.value = !!data?.isUpdate

  // 编辑场景：回显数据
  if (unref(isUpdate) && data.record?.id) {
    const res = await getOperationTagRecord(data.record.id)
    setFieldsValue({ ...res })
  }
})

/**
 * 提交表单
 */
async function handleSubmit() {
  try {
    const values = await validate()
    setModalProps({ confirmLoading: true })

    // 新增/编辑逻辑
    if (unref(isUpdate)) {
      await updateOperationTagRecord(values)
    } else {
      await createOperationTagRecord(values)
    }

    closeModal()
    emit('success')
    createMessage.success(t('common.saveSuccessText'))
  }
  finally {
    setModalProps({ confirmLoading: false })
  }
}
</script>

<template>
  <BasicModal
    v-bind="$attrs"
    :title="isUpdate ? t('action.edit') : t('action.create')"
    @register="registerModal"
    @ok="handleSubmit"
    destroyOnClose
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
