<script lang="ts" setup>
import {BasicTable, TableAction, useTable} from '@/components/Table';
import {useI18n} from '@/hooks/web/useI18n'
import {useRouter} from 'vue-router';

import {getTaskManagerPage} from '@/api/bpm/task';

import {useGridColumns, useGridFormSchema} from './data';

defineOptions({ name: 'BpmManagerTask' });

const router = useRouter();
const { t } = useI18n()

/** 查看历史 */
function handleHistory(row) {
  router.push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: row.processInstance.id,
    },
  });
}
const basicColumns = useGridColumns();
let tableFormScheme = useGridFormSchema();
const [registerTable] = useTable({
  columns: basicColumns,
  api: getTaskManagerPage,
  title: '流程任务',

  rowKey: 'id',

  showIndexColumn: false,

  useSearchForm: true,

  formConfig: {
    schemas: tableFormScheme,
    labelWidth: 100,
    autoSubmitOnEnter: true,
    showAdvancedButton: true,
    compact: true,
  },

  showTableSetting: true,

  bordered: true,

  striped: false,

  canResize: true,

  immediate: true,

  actionColumn: {
    width: 120,
    title: t('common.action'),
    dataIndex: 'action',
    fixed: 'right',
    slots: { customRender: 'action' },
  },

  scroll: { x: 1500 },
})

</script>

<template>
  <div>
<!--    <DocAlert title="工作流手册" url="https://doc.iocoder.cn/bpm/" />-->
    <BasicTable
        @register="registerTable"
        :title="'流程任务'"
    >
      <!-- 操作列插槽 -->
      <template #action="{ record }">
        <TableAction
            :actions="[
            {
                label: '历史',
                type: 'link',
                icon: 'ant-design:history-outlined',
                auth: ['bpm:task:query'],
                onClick: () => handleHistory(record),
          },
              ]"
        />
      </template>
    </BasicTable>
  </div>
</template>


