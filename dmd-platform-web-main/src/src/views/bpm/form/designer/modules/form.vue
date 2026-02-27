<script lang="ts" setup>
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';

// import type { FcDesigner } from '@form-create/antd-designer';
import type FcDesigner from '@form-create/antd-designer';
import { formSchema } from '../data';
import type { BpmFormApi } from '@/api/bpm/form';

import { BasicForm, useForm } from '@/components/Form';
import { encodeConf, encodeFields } from '@/components/form-create';
import { BasicModal, useModalInner } from '@/components/Modal';
import { createForm, updateForm } from '@/api/bpm/form';

const emit = defineEmits(['success']);

const formData = ref<BpmFormApi.Form | undefined>();
const editorAction = ref<string>();
const designerComponent = ref<InstanceType<typeof FcDesigner>>();

const getTitle = computed(() => {
  if (!formData.value?.id) {
    return '新增流程表单';
  }
  return editorAction.value === 'copy' ? '复制流程表单' : '编辑流程表单';
});

const [registerForm, { setFieldsValue, validate, resetFields }] = useForm({
  labelWidth: 100,
  schemas: formSchema,
  showActionButtonGroup: false,
});

const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data: any) => {
  resetFields();
  if (!data) {
    return;
  }
  // 设置表单设计器组件
  designerComponent.value = data.designer;
  formData.value = data.formConfig;
  editorAction.value = data.action;
  console.log('useModalInner::: ', data);
  // 如果是复制，表单名称后缀添加 _copy ，id 置空
  if (editorAction.value === 'copy' && formData.value) {
    formData.value = {
      ...formData.value,
      name: `${formData.value.name}_copy`,
      id: undefined,
    };
  }
  if (data.formConfig) {
    // 设置表单值
    if (formData.value) {
      await setFieldsValue({
        id: formData.value.id,
        name: formData.value.name,
        status: formData.value.status,
        remark: formData.value.remark,
      });
    }
  }
});

/** 提交表单 */
async function handleSubmit() {
  try {
    const data = await validate();
    setModalProps({ confirmLoading: true });
    // console.log('handleSubmit::: ', { data, designerComponent: designerComponent.value, formData: formData.value });
    // 编码表单配置和表单字段
    data.conf = encodeConf(designerComponent);
    data.fields = encodeFields(designerComponent);
    // 保存表单数据
    if (formData.value?.id) {
      await (editorAction.value === 'copy'
        ? createForm(data)
        : updateForm(data));
    } else {
      await createForm(data);
    }

    message.success('操作成功');
    closeModal();
    emit('success');
  } catch (e) {
    console.error('保存表单失败', e);
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
