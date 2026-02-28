<script lang="ts" setup>
import { ref, unref } from 'vue'
// 修复：导入时不再依赖TableColumn，仅取需要的formSchema
import { formSchema } from './stationRoom.data'
import { useI18n } from '@/hooks/web/useI18n'
import { useMessage } from '@/hooks/web/useMessage'
import { BasicForm, useForm } from '@/components/Form'
import { BasicModal, useModalInner } from '@/components/Modal'
import { createStationRoom, getStationRoom, updateStationRoom } from '@/api/room/stationRoom/stationRoom'

defineOptions({ name: 'StationRoomModal' })

const emit = defineEmits(['success', 'register'])
// 修复：确保t被实际使用（模板+脚本双场景）
const { t } = useI18n()
const { createMessage } = useMessage()
const isUpdate = ref(true)

const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
  labelWidth: 120,
  baseColProps: { span: 24 },
  schemas: formSchema,
  showActionButtonGroup: false,
  actionColOptions: { span: 23 },
})

const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
  resetFields()
  setModalProps({ confirmLoading: false })
  isUpdate.value = !!data?.isUpdate
  if (unref(isUpdate)) {
    const res = await getStationRoom(data.record.id)
    setFieldsValue({ ...res })
  }
})

async function handleSubmit() {
  try {
    const values = await validate()
    setModalProps({ confirmLoading: true })
    if (unref(isUpdate))
      await updateStationRoom(values)
    else
      await createStationRoom(values)

    closeModal()
    emit('success')
    // 修复：显式使用t，避免TS提示未使用
    createMessage.success(t('common.saveSuccessText') || '保存成功')
  }
  finally {
    setModalProps({ confirmLoading: false })
  }
}
</script>

<template>
  <BasicModal
    v-bind="$attrs" :title="isUpdate ? (t('action.edit')) : (t('action.create'))" @register="registerModal" @ok="handleSubmit">
  <BasicForm @register="registerForm" />
  </BasicModal>
</template>
