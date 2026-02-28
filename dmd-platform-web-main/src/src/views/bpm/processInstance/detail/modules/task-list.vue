<script lang="ts" setup>
import { nextTick, ref } from 'vue';
import { Button } from 'ant-design-vue';

import type { BasicColumn } from '@/components/Table';
import type { BpmTaskApi } from '@/api/bpm/task';

import { Icon } from '@/components/Icon';
import { BasicModal, useModal } from '@/components/Modal';
import { BasicTable, useRender, useTable } from '@/components/Table';
import { getTaskListByProcessInstanceId } from '@/api/bpm/task';
import { setConfAndFields2 } from '@/components/form-create';
import { DICT_TYPE } from '@/utils/dict';
import { formatToDateTime } from '@/utils/dateUtil';

defineOptions({
  name: 'BpmProcessInstanceTaskList',
});

const props = defineProps<{
  id: string
  loading: boolean
}>();

/** 表单类型定义 */
interface TaskForm {
  rule: any[]
  option: Record<string, any>
  value: Record<string, any>
}

/** 获取表格列配置 */
function getTableColumns(): BasicColumn[] {
  return [
    {
      dataIndex: 'name',
      title: '审批节点',
      width: 150,
    },
    {
      dataIndex: 'approver',
      title: '审批人',
      width: 180,
      customRender: ({ record }) => {
        return record.assigneeUser?.nickname || record.ownerUser?.nickname;
      },
    },
    {
      dataIndex: 'createTime',
      title: '开始时间',
      width: 180,
      customRender: ({ text }) => {
        return text ? formatToDateTime(text) : '';
      },
    },
    {
      dataIndex: 'endTime',
      title: '结束时间',
      width: 180,
      customRender: ({ text }) => {
        return text ? formatToDateTime(text) : '';
      },
    },
    {
      dataIndex: 'status',
      title: '审批状态',
      width: 150,
      customRender: ({ text }) => {
        return useRender.renderDict(text, DICT_TYPE.BPM_TASK_STATUS);
      },
    },
    {
      dataIndex: 'reason',
      title: '审批建议',
      width: 200,
      slots: { customRender: 'reason' },
    },
    {
      dataIndex: 'durationInMillis',
      title: '耗时',
      width: 180,
      customRender: ({ text }) => {
        if (!text) {
          return '';
        }
        // 毫秒转为可读格式
        const seconds = Math.floor(text / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0) {
          return `${days}天${hours % 24}小时`;
        }
        if (hours > 0) {
          return `${hours}小时${minutes % 60}分钟`;
        }
        if (minutes > 0) {
          return `${minutes}分钟`;
        }
        return `${seconds}秒`;
      },
    },
  ];
}

const formRef = ref<any>();
const taskForm = ref<TaskForm>({
  rule: [],
  option: {},
  value: {},
});

const [registerModal, { openModal }] = useModal();

const [registerTable, { reload }] = useTable({
  api: async () => {
    const data = await getTaskListByProcessInstanceId(props.id);
    return { list: data, total: data.length };
  },
  columns: getTableColumns(),
  pagination: false,
  bordered: true,
  useSearchForm: false,
  showTableSetting: false,
  canResize: false,
});

/** 刷新表格 */
function handleRefresh() {
  reload();
}

/** 显示表单详情 */
async function handleShowFormDetail(row: BpmTaskApi.TaskManager) {
  // 设置表单配置和表单字段
  taskForm.value = {
    rule: [],
    option: {},
    value: row,
  };
  setConfAndFields2(
    taskForm,
    row.formConf,
    row.formFields || [],
    row.formVariables || {},
  );

  // 打开弹窗
  openModal(true);
  // 等待表单渲染
  await nextTick();
  // 获取表单 API 实例
  const formApi = formRef.value?.fapi;
  if (!formApi) {
    return;
  }
  // 设置表单不可编辑
  formApi.btn.show(false);
  formApi.resetBtn.show(false);
  formApi.disabled(true);
}

defineExpose({
  refresh: handleRefresh,
});
</script>

<template>
  <div class="h-full flex flex-col">
    <BasicTable @register="registerTable">
      <template #reason="{ record }">
        <div class="flex flex-wrap items-center justify-center">
          <span v-if="record.reason">{{ record.reason }}</span>
          <span v-else>-</span>
          <Button
            v-if="record.formId > 0"
            type="primary"
            size="small"
            ghost
            class="ml-1"
            @click="handleShowFormDetail(record)"
          >
            <Icon icon="lucide:file-text" />
            <span class="text-xs !ml-0.5">查看表单</span>
          </Button>
        </div>
      </template>
    </BasicTable>
    <BasicModal
      title="查看表单"
      width="800px"
      :show-cancel-btn="false"
      :show-ok-btn="false"
      @register="registerModal"
    >
      <form-create
        ref="formRef"
        v-model="taskForm.value"
        :option="taskForm.option"
        :rule="taskForm.rule"
      />
    </BasicModal>
  </div>
</template>
