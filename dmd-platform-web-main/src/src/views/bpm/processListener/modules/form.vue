<script lang="ts" setup>
import type { BpmProcessListenerApi } from '@/api/bpm/processListener';

import { computed, ref, watch } from 'vue';

import { useModalInner } from '@/components/Modal';
import { BasicForm, useForm } from '@/components/Form';

import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

import {
  createProcessListener,
  getProcessListener,
  updateProcessListener,
} from '@/api/bpm/processListener';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);
const { t } = useI18n();

// 表单相关
const [registerForm, { validate, resetFields, setFieldsValue }] = useForm({
  labelWidth: 100,
  schemas: useFormSchema(),
  showActionButtonGroup: false,
});

// 模态框相关
const [registerModal, { closeModal, setModalProps }] = useModalInner(async (data) => {
  // 重置表单
  await resetFields();
  
  // 设置模态框属性
  setModalProps({
    title: data?.id ? t('ui.actionTitle.edit', ['流程监听器']) : t('ui.actionTitle.create', ['流程监听器']),
  });
  
  // 如果是编辑模式，加载数据
  if (data?.id) {
    try {
      const processListenerData = await getProcessListener(data.id);
      await setFieldsValue(processListenerData);
    } catch (error) {
      console.error('加载流程监听器数据失败:', error);
    }
  }
});

// 提交表单
async function handleSubmit() {
  try {
    const values = await validate();
    
    // 判断是创建还是更新
    if (values.id) {
      await updateProcessListener(values as BpmProcessListenerApi.ProcessListener);
    } else {
      await createProcessListener(values as BpmProcessListenerApi.ProcessListener);
    }
    
    // 关闭模态框并提示成功
    closeModal();
    emit('success');
    message.success(t('ui.actionMessage.operationSuccess'));
  } catch (error) {
    console.error('提交表单失败:', error);
  }
}

// 暴露方法给父组件
defineExpose({
  handleSubmit,
});
</script>

<template>
  <BasicForm @register="registerForm" class="mx-4" />
</template>

<script lang="ts">
export default {
  name: 'ProcessListenerForm',
  emits: ['success'],
};
</script>
