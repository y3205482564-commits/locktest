<script lang="ts" setup>
import { h, onActivated } from 'vue';
import { Button, Input, Modal, message } from 'ant-design-vue';
import { BpmProcessInstanceStatus, columns, searchFormSchema } from './data';
import type { BpmProcessInstanceApi } from '@/api/bpm/processInstance';

import { BasicTable, TableAction, useTable } from '@/components/Table';
import { DocAlert } from '@/components/DocAlert';
import { useGo } from '@/hooks/web/usePage';
import {
  cancelProcessInstanceByAdmin,
  getProcessInstanceManagerPage,
} from '@/api/bpm/processInstance';

defineOptions({ name: 'BpmProcessInstanceManager' });

const go = useGo();

const [registerTable, { reload }] = useTable({
  title: '流程实例',
  api: getProcessInstanceManagerPage,
  columns,
  formConfig: {
    labelWidth: 100,
    schemas: searchFormSchema,
    autoSubmitOnEnter: true,
  },
  rowKey: 'id',
  useSearchForm: true,
  showTableSetting: true,
  bordered: true,
  actionColumn: {
    width: 180,
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
  },
});

/** 查看任务详情 */
function handleTaskDetail(
  row: BpmProcessInstanceApi.ProcessInstance,
  task: BpmProcessInstanceApi.Task,
) {
  go({
    name: 'BpmProcessInstanceDetail',
    query: { id: row.id, taskId: task.id },
  });
}

/** 查看流程实例 */
function handleDetail(row: BpmProcessInstanceApi.ProcessInstance) {
  go({
    name: 'BpmProcessInstanceDetail',
    query: { id: row.id },
  });
}

/** 取消流程实例 */
function handleCancel(row: BpmProcessInstanceApi.ProcessInstance) {
  let reason = '';
  Modal.confirm({
    title: '取消流程',
    content: h('div', {}, [
      h('p', {}, '请输入取消原因'),
      h(Input.TextArea, {
        placeholder: '请输入取消原因',
        rows: 2,
        onChange: (e: any) => {
          reason = e.target.value;
        },
      }),
    ]),
    async onOk() {
      if (reason) {
        await cancelProcessInstanceByAdmin(row.id, reason);
        message.success('取消成功');
        reload();
      } else {
        message.warning('请输入取消原因');
        return Promise.reject(new Error('请输入取消原因'));
      }
    },
  });
}

/** 激活时刷新 */
onActivated(() => {
  reload();
});
</script>

<template>
  <div>
    <DocAlert title="工作流手册" url="https://doc.iocoder.cn/bpm" />

    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <!-- 当前审批任务列 -->
        <template v-if="column.dataIndex === 'tasks'">
          <template v-if="record.tasks && record.tasks.length > 0">
            <Button
              v-for="task in record.tasks"
              :key="task.id"
              type="link"
              @click="handleTaskDetail(record, task)"
            >
              {{ task.name }}
            </Button>
          </template>
          <span v-else>-</span>
        </template>
        <!-- 操作列 -->
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                label: '详情',
                auth: 'bpm:process-instance:query',
                onClick: handleDetail.bind(null, record),
              },
              {
                label: '取消',
                danger: true,
                auth: 'bpm:process-instance:cancel',
                ifShow: record.status === BpmProcessInstanceStatus.RUNNING,
                onClick: handleCancel.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </div>
</template>
