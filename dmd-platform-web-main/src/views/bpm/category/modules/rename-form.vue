<script lang="ts" setup>
import { ref, unref } from 'vue';
import { renameFormSchema } from '../data';
import { useI18n } from '@/hooks/web/useI18n';
import { useMessage } from '@/hooks/web/useMessage';
import { BasicForm, useForm } from '@/components/Form';
import { BasicModal, useModalInner } from '@/components/Modal';
import { getCategory, updateCategory } from '@/api/bpm/category';
import type { CategoryVO } from '@/api/bpm/category';

defineOptions({ name: 'RenameCategoryModal' });

const emit = defineEmits(['success', 'register']);
const { t } = useI18n();
const { createMessage } = useMessage();
const formData = ref<CategoryVO>();

const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
  labelWidth: 120,
  baseColProps: { span: 24 },
  schemas: renameFormSchema,
  showActionButtonGroup: false,
  actionColOptions: { span: 23 },
});

const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
  resetFields();
  setModalProps({ confirmLoading: false });
  if (data && data.id) {
    const res = await getCategory(data.id);
    formData.value = res;
    setFieldsValue({ name: res.name });
  }
});

async function handleSubmit() {
  try {
    const values = await validate();
    setModalProps({ confirmLoading: true });
    const data = {
      ...formData.value,
      ...values,
    } as CategoryVO;
    await updateCategory(data);

    closeModal();
    emit('success');
    createMessage.success(t('common.saveSuccessText'));
  } finally {
    setModalProps({ confirmLoading: false });
  }
}
</script>

<template>
  <BasicModal
    v-bind="$attrs" title="重命名流程分类" @register="registerModal"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
