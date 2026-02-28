<script lang="ts" setup>
import { ref } from 'vue';
import { Spin } from 'ant-design-vue';

import FormCreate from '@form-create/ant-design-vue';
import { BasicModal, useModalInner } from '@/components/Modal';

import { getForm } from '@/api/bpm/form';
import { setConfAndFields2 } from '@/components/form-create';
</script>

<script lang="ts">
const formConfig = ref<any>({
});
const loading = ref(false);

const [registerModal, { setModalProps }] = useModalInner(async (data: any) => {
  if (!data || !data.id) {
    return;
  }
  loading.value = true;
  setModalProps({ confirmLoading: true });
  try {
    // 设置表单配置
    formConfig.value = await getForm(data.id);
    setConfAndFields2(
      formConfig.value,
      formConfig.value.conf,
      formConfig.value.fields,
    );
  } finally {
    loading.value = false;
    setModalProps({ confirmLoading: false });
  }
});

export default {
  components: { BasicModal },
};
</script>

<template>
  <BasicModal
    title="流程表单详情"
    :show-ok-btn="false"
    width="50%"
    @register="registerModal"
  >
    <Spin :spinning="loading">
      <FormCreate :option="formConfig.option" :rule="formConfig.rule" />
    </Spin>
  </BasicModal>
</template>
