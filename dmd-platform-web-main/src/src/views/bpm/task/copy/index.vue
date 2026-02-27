<template>
  <div autoContentHeight>
<!--      <DocAlert-->
<!--          title="审批转办、委派、抄送"-->
<!--          url="https://doc.iocoder.cn/bpm/task-delegation-and-cc/"-->
<!--      />-->

    <BasicTable
        @register="registerTable"
    >
      <template #action="{ record }">
        <TableAction
            :actions="[
              {
                label: '详情',
                auth: ['bpm:task:query'],
                onClick: () => handleDetail(record),
              }
          ]"
        />
      </template>
      <!-- 如果有其他插槽内容可以在这里添加 -->
    </BasicTable>
  </div>
</template>

<script lang="ts" setup>
import {BasicTable, TableAction, useTable} from '@/components/Table';

import {getProcessInstanceCopyPage} from '@/api/bpm/processInstance';
import {useRouter} from 'vue-router';
// import { createViewButton } from '@/utils/tableAction';
// 导入你的列和表单配置
import {useColumns, useSearchForm} from './data';

const router = useRouter();

defineOptions({
  name: 'BpmCopyTask',
});
const [registerTable] = useTable({
  api: getProcessInstanceCopyPage,
  columns: useColumns(),
  rowKey: 'id',
  showIndexColumn: false,
  useSearchForm: true,
  formConfig: {
    schemas: useSearchForm(),
    labelWidth: 100,
    baseColProps: { span: 8 },
    autoSubmitOnEnter: true,
    showAdvancedButton: true,
    alwaysShowLines: 1,
  },
  // actionColumn: {
  //   width: 120,
  //   title: '操作',
  //   dataIndex: 'action',
  //   fixed: 'right',
  //   slots: { customRender: 'action' },
  // },
})

// 任务详情
function handleDetail(row) {
  const query = {
    id: row.processInstanceId,
    ...(row.activityId && { activityId: row.activityId }),
  };
  router.push({
    name: 'BpmProcessInstanceDetail',
    query,
  });
}

</script>
