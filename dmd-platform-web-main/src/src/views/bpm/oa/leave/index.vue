<script lang="ts" setup>
import type { BpmOALeaveApi } from '@/api/bpm/oa/leave';

import { h } from 'vue';

import { message, Textarea, Button } from 'ant-design-vue';

import { DocAlert } from '@/components/DocAlert';
import { BasicTable, TableAction, useTable } from '@/components/Table';
import { BpmTaskStatusEnum } from '@/enums';
import { useModal } from '@/components/Modal';
import { getLeavePage } from '@/api/bpm/oa/leave';
import { cancelProcessInstanceByStartUser } from '@/api/bpm/processInstance';
import { router } from '@/router';

import { columns, searchFormSchema } from './leave.data';
import { useGridColumns, useGridFormSchema } from './data';
defineOptions({ name: 'BpmOALeave' });

const [registerModal, { openModal }] = useModal();

/** 刷新表格 */
function handleRefresh() {
  reload();
}

/** 创建请假 */
function handleCreate() {
  router.push({
    name: 'OALeaveCreate',
    query: {
      formType: 'create',
    },
  });
}

/** 取消请假 */
function handleCancel(row: BpmOALeaveApi.Leave) {
  openModal(true, {
    title: '取消流程',
    content: '请输入取消原因',
    component: () => {
      return h(Textarea, {
        placeholder: '请输入取消原因',
        allowClear: true,
        rows: 2,
        rules: [{ required: true, message: '请输入取消原因' }],
      });
    },
    async onOk(value: string) {
      if (!value) {
        message.error('请输入取消原因');
        return false;
      }
      const hideLoading = message.loading({
        content: '正在取消中...',
        duration: 0,
      });
      try {
        await cancelProcessInstanceByStartUser(row.id, value);
        message.success('取消成功');
        handleRefresh();
      } catch {
        return false;
      } finally {
        hideLoading();
      }
    },
  });
}

/** 查看请假详情 */
function handleDetail(row: BpmOALeaveApi.Leave) {
  router.push({
    name: 'OALeaveDetail',
    query: { id: row.id },
  });
}

/** 审批进度 */
function handleProgress(row: BpmOALeaveApi.Leave) {
  router.push({
    name: 'BpmProcessInstanceDetail',
    query: { id: row.processInstanceId },
  });
}

const [registerTable, { reload }] = useTable({
  title: '请假列表',
  api: async (params: any) => {
    const res = await getLeavePage({
      pageNo: params.page,
      pageSize: params.pageSize,
      ...params,
    });
    return res;
  },
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
    width: 220,
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
  },
});
</script>

<template>
  <div>
    <DocAlert
      title="审批接入（业务表单）"
      url="https://doc.iocoder.cn/bpm/use-business-form/"
    />

    <BasicTable @register="registerTable">
      <template #toolbar>
        <Button type="primary" @click="handleCreate">
          发起请假
        </Button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                label: '详情',
                type: 'link',
                onClick: handleDetail.bind(null, record),
              },
              {
                label: '审批进度',
                type: 'link',
                onClick: handleProgress.bind(null, record),
              },
              {
                label: '取消',
                type: 'link',
                danger: true,
                ifShow: record.result === BpmTaskStatusEnum.RUNNING,
                onClick: handleCancel.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </div>
</template>
