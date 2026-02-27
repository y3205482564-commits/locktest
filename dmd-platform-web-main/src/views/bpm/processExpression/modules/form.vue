<script lang="ts" setup>
import type { BpmProcessExpressionApi } from '@/api/bpm/processExpression';

import { computed, ref,unref } from 'vue';
import { BasicForm, useForm } from '@/components/Form';

import { message } from 'ant-design-vue';

import {
  createProcessExpression,
  getProcessExpression,
  updateProcessExpression,
} from '@/api/bpm/processExpression';
import { useI18n } from '@/hooks/web/useI18n';

import { useFormSchema } from '../data';

const { t } = useI18n();

const emit = defineEmits(['success']);
const formData = ref<BpmProcessExpressionApi.ProcessExpression>();

// 定义props接收父组件传递的数据
const props = defineProps<{
  isUpdate?: boolean;
  record?: BpmProcessExpressionApi.ProcessExpression;
}>();

const isUpdate = ref(props.isUpdate || false);

const [registerForm, { validate, setFieldsValue, resetFields }] = useForm({
  labelWidth: 100,
  schemas: useFormSchema(),
  showActionButtonGroup: false,
  baseColProps: { span: 24 },
  actionColOptions: { span: 23 },
});

// 监听props变化，设置表单数据
import { watch } from 'vue';
watch(() => props.record, (newRecord) => {
  if (newRecord && props.isUpdate) {
    formData.value = newRecord;
    setFieldsValue({
      ...newRecord,
    });
  }
}, { immediate: true });

// 定义可以被父组件调用的方法
defineExpose({
  handleSubmit,
  resetFields: () => {
    resetFields();
    isUpdate.value = props.isUpdate || false;
    
    if (props.isUpdate && props.record) {
      formData.value = props.record;
      setFieldsValue({
        ...formData.value,
      });
    }
  }
});

async function handleSubmit() {
  try {
    const values = await validate();
    
    if (unref(isUpdate)) {
      await updateProcessExpression(values as BpmProcessExpressionApi.ProcessExpression);
    } else {
      await createProcessExpression(values as BpmProcessExpressionApi.ProcessExpression);
    }
    
    emit('success');
    message.success(t('ui.actionMessage.operationSuccess'));
    return true; // 返回成功状态
  } catch (error) {
    console.error('表单提交失败:', error);
    return false; // 返回失败状态
  }
}
</script>

<template>
  <BasicForm @register="registerForm" />
</template>
