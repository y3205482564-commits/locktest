<script lang="ts" setup>
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import { formSchema } from '../data';
import type { BpmUserGroupApi } from '@/api/bpm/userGroup';

import { BasicForm, useForm } from '@/components/Form';
import { BasicModal, useModalInner } from '@/components/Modal';
import {
  createUserGroup,
  getUserGroup,
  updateUserGroup,
} from '@/api/bpm/userGroup';

const emit = defineEmits(['success', 'register']);

const isUpdate = ref(false);
const formData = ref<BpmUserGroupApi.UserGroup>();

const getTitle = computed(() => {
  return isUpdate.value ? '编辑用户分组' : '新增用户分组';
});

const [registerForm, { setFieldsValue, validate, resetFields }] = useForm({
  labelWidth: 100,
  schemas: formSchema,
  showActionButtonGroup: false,
});

const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data: any) => {
  resetFields();
  isUpdate.value = data?.isUpdate || false;

  if (data?.isUpdate && data?.record?.id) {
    setModalProps({ confirmLoading: true });
    try {
      formData.value = await getUserGroup(data.record.id);
      // 设置表单值
      await setFieldsValue({
        id: formData.value.id,
        name: formData.value.name,
        description: formData.value.description,
        userIds: formData.value.userIds,
        status: formData.value.status,
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  } else {
    formData.value = undefined;
  }
});

/** 提交表单 */
async function handleSubmit() {
  try {
    const values = await validate() as any;
    setModalProps({ confirmLoading: true });

    // 保存表单数据
    if (isUpdate.value && formData.value?.id) {
      values.id = formData.value.id;
      await updateUserGroup(values);
    } else {
      await createUserGroup(values);
    }

    message.success('操作成功');
    closeModal();
    emit('success');
  } catch (e) {
    console.error('保存用户分组失败', e);
  } finally {
    setModalProps({ confirmLoading: false });
  }
}
</script>

<template>
  <BasicModal
    :title="getTitle"
    width="500px"
    @register="registerModal"
    @ok="handleSubmit"
  >
    <BasicForm class="mx-4" @register="registerForm" />
  </BasicModal>
</template>
