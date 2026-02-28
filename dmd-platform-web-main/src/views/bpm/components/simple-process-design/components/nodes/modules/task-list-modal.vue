<script lang="ts" setup>
import { ref } from 'vue';

import { useGridColumns } from './task-list-data';
import { BasicModal, useModalInner } from '@/components/Modal';
import { BasicTable, useTable } from '@/components/Table';

defineOptions({ name: 'TaskListModal' });

const taskList = ref<any[]>([]);

const [registerTable] = useTable({
  columns: useGridColumns(),
  dataSource: taskList,
  pagination: false,
  showIndexColumn: false,
  bordered: true,
  rowKey: 'id',
});

const [registerModal] = useModalInner((data: any[]) => {
  taskList.value = data || [];
});

defineExpose({ registerModal });
</script>

<template>
  <BasicModal :footer="null" width="75%" @register="registerModal">
    <BasicTable @register="registerTable" />
  </BasicModal>
</template>
