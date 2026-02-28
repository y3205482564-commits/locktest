<script lang="ts" setup>
import { ref } from 'vue';

import { useGridColumns } from './process-instance-data';
import { BasicModal, useModalInner } from '@/components/Modal';
import { BasicTable, useTable } from '@/components/Table';

defineOptions({ name: 'ProcessInstanceModal' });

const instanceList = ref<any[]>([]);

const [registerTable] = useTable({
  columns: useGridColumns(),
  dataSource: instanceList,
  pagination: false,
  showIndexColumn: false,
  bordered: true,
  rowKey: 'id',
});

const [registerModal] = useModalInner((data: any[]) => {
  instanceList.value = data || [];
});
</script>

<template>
  <BasicModal :footer="null" width="75%" @register="registerModal">
    <BasicTable @register="registerTable" />
  </BasicModal>
</template>
