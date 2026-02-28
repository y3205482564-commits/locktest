<script lang="ts" setup>
import { h, onActivated } from 'vue';
import { Button, Input, Modal, message } from 'ant-design-vue';
import { BpmProcessInstanceStatus, columns, searchFormSchema } from './data';
import type { BpmProcessInstanceApi } from '@/api/bpm/processInstance';

import { BasicTable, TableAction, useRender, useTable } from '@/components/Table';
import { DocAlert } from '@/components/DocAlert';
import { DictTag } from '@/components/DictTag';
import { useGo } from '@/hooks/web/usePage';
import { getProcessDefinition } from '@/api/bpm/definition';
import {
  cancelProcessInstanceByStartUser,
  getProcessInstanceMyPage,
} from '@/api/bpm/processInstance';
import { DICT_TYPE } from '@/utils/dict';

defineOptions({ name: 'BpmProcessInstanceMy' });

const go = useGo();

const [registerTable, { reload }] = useTable({
  title: '我的流程',
  api: getProcessInstanceMyPage,
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
    width: 200,
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    // slots: { customRender: 'action' }
  },
});

/** 查看流程实例 */
function handleDetail(row: BpmProcessInstanceApi.ProcessInstance) {
  go({
    name: 'BpmProcessInstanceDetail',
    query: { id: row.id },
  });
}

/** 重新发起流程 */
async function handleCreate(row: BpmProcessInstanceApi.ProcessInstance) {
  // 如果是【业务表单】，不支持重新发起
  if (row?.id) {
    const processDefinitionDetail = await getProcessDefinition(
      row.processDefinitionId,
    );
    if (processDefinitionDetail.formType === 20) {
      message.error(
        '重新发起流程失败，原因：该流程使用业务表单，不支持重新发起',
      );
      return;
    }
  }
  // 跳转发起流程界面
  go({
    name: 'BpmProcessInstanceCreate',
    query: { processInstanceId: row?.id },
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
        await cancelProcessInstanceByStartUser(row.id, reason);
        message.success('取消成功');
        reload();
      } else {
        message.warning('请输入取消原因');
        return Promise.reject();
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
    <DocAlert
      title="流程发起、取消、重新发起"
      url="https://doc.iocoder.cn/bpm/process-instance"
    />

    <BasicTable @register="registerTable">

      <template #bodyCell="{ column, record }">
        <!-- 摘要列 -->
        <template v-if="column.dataIndex === 'summary'">
          <div
            v-if="record.summary && record.summary.length > 0"
            class="flex flex-col py-2"
          >
            <div v-for="(item, index) in record.summary" :key="index">
              <span class="text-gray-500">
                {{ item.key }} : {{ item.value }}
              </span>
            </div>
          </div>
          <div v-else>
            -
          </div>
        </template>
        <!-- 流程状态列（带任务信息） -->
        <template v-if="column.dataIndex === 'status'">
          <template
            v-if="
              record.status === BpmProcessInstanceStatus.RUNNING
                && record.tasks?.length > 0
            "
          >
            <!-- 单人审批 -->
            <template v-if="record.tasks.length === 1">
              <span>
                <Button type="link" @click="handleDetail(record)">
                  {{ record.tasks[0]?.assigneeUser?.nickname }}
                </Button>
                ({{ record.tasks[0]?.name }}) 审批中
              </span>
            </template>
            <!-- 多人审批 -->
            <template v-else>
              <span>
                <Button type="link" @click="handleDetail(record)">
                  {{ record.tasks[0]?.assigneeUser?.nickname }}
                </Button>
                等 {{ record.tasks.length }} 人 ({{ record.tasks[0]?.name }})审批中
              </span>
            </template>
          </template>
          <!-- 非审批中状态 -->
          <template v-else>
            <DictTag :type="DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS" :value="record.status" />
<!--            {{ useRender.renderDict(record.status, DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS) }}-->
          </template>
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
              {
                label: '重新发起',
                auth: 'bpm:process-instance:create',
                ifShow: record.status !== BpmProcessInstanceStatus.RUNNING,
                onClick: handleCreate.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </div>
</template>
