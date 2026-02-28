<script lang="ts" setup>
import type { BpmOALeaveApi } from '@/api/bpm/oa/leave';

import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { PageWrapper } from '@/components/Page';
import { Description, useDescription } from '@/components/Description';

import { Spin } from 'ant-design-vue';

import { getLeave } from '@/api/bpm/oa/leave';

import { useDetailFormSchema } from './data';

const props = defineProps<{
  id: string;
}>();

const { query } = useRoute();

const loading = ref(false);
const formData = ref<BpmOALeaveApi.Leave>();
const queryId = computed(() => query.id as string);

const [registerDescription] = useDescription({
  bordered: true,
  column: 1,
  class: 'mx-4',
  schema: useDetailFormSchema(),
  data: formData,
});

/** 获取详情数据 */
async function getDetailData() {
  try {
    loading.value = true;
    formData.value = await getLeave(Number(props.id || queryId.value));
  } finally {
    loading.value = false;
  }
}

/** 初始化 */
onMounted(() => {
  getDetailData();
});
</script>

<template>
  <PageWrapper content-class="m-2">
    <Spin :spinning="loading" tip="加载中...">
      <Description @register="registerDescription" />
    </Spin>
  </PageWrapper>
</template>
