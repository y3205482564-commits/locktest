<script lang="ts" setup>
import { h, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Modal, Textarea, message } from 'ant-design-vue';

import { useGridColumns, useGridFormSchema } from './data';
import { BasicTable, TableAction, useTable } from '@/components/Table';
import { PageWrapper } from '@/components/Page';
import { getProcessDefinition } from '@/api/bpm/definition';
import {
  cancelProcessInstanceByAdmin,
  getProcessInstanceManagerPage,
} from '@/api/bpm/processInstance';
import { parseFormFields } from '@/views/bpm/components/simple-process-design';

import type { BpmProcessInstanceApi } from '@/api/bpm/processInstance';

defineOptions({ name: 'BpmProcessInstanceReport' });

const router = useRouter();
const { query } = useRoute();
const processDefinitionId = query.processDefinitionId as string;

const formFields = ref<any[]>([]);

const [registerTable, { reload, setColumns, getForm }] = useTable({
  api: getProcessInstanceManagerPage,
  searchInfo: {
    processDefinitionKey: query.processDefinitionKey,
  },
  beforeFetch: (params) => {
    // 处理 formFieldsParams，需要 JSON 序列化
    if (params.formFieldsParams && typeof params.formFieldsParams === 'object') {
      params.formFieldsParams = JSON.stringify(params.formFieldsParams);
    }
    return params;
  },
  columns: useGridColumns(),
  rowKey: 'id',
  showIndexColumn: false,
  useSearchForm: true,
  formConfig: {
    schemas: useGridFormSchema(),
    labelWidth: 100,
    autoSubmitOnEnter: true,
  },
  showTableSetting: true,
  actionColumn: {
    width: 180,
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
  },
});

/** 解析表单字段 */
function parseFormCreateFields(formFieldsData?: string[]) {
  const result: Array<Record<string, any>> = [];
  if (formFieldsData) {
    formFieldsData.forEach((fieldStr: string) => {
      try {
        const parsed = JSON.parse(fieldStr);
        // 使用 parseFormFields 解析表单字段
        parseFormFields(parsed, result);
      } catch (error) {
        console.error('解析表单字段失败', error);
      }
    });
  }
  return result;
}

/** 获取流程定义 */
async function getProcessDefinitionData() {
  const processDefinition = await getProcessDefinition(processDefinitionId);
  if (processDefinition?.formFields) {
    formFields.value = parseFormCreateFields(processDefinition.formFields);
  }
}

/** 刷新表格 */
function handleRefresh() {
  reload();
}

/** 查看详情 */
function handleDetail(row: BpmProcessInstanceApi.ProcessInstance) {
  router.push({
    name: 'BpmProcessInstanceDetail',
    query: { id: row.id },
  });
}

/** 取消流程实例 */
function handleCancel(row: BpmProcessInstanceApi.ProcessInstance) {
  Modal.confirm({
    title: '取消流程',
    content: h('div', {}, [
      h(Textarea, {
        placeholder: '请输入取消原因',
        allowClear: true,
        rows: 2,
        id: 'cancelReason',
      }),
    ]),
    onOk: async () => {
      const reasonInput = document.getElementById('cancelReason') as HTMLTextAreaElement;
      const reason = reasonInput?.value;
      if (reason) {
        await cancelProcessInstanceByAdmin(row.id, reason);
        message.success('取消成功');
        handleRefresh();
      }
    },
  });
}

/** 初始化 */
onMounted(async () => {
  // 获取流程定义
  await getProcessDefinitionData();
  // 更新表单配置、表格列配置
  getForm().updateSchema(useGridFormSchema(formFields.value));
  setColumns(useGridColumns(formFields.value));
});
</script>

<template>
  <PageWrapper>
    <BasicTable title="流程实例列表" @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                label: '详情',
                onClick: handleDetail.bind(null, record),
                auth: 'bpm:process-instance:query',
              },
              {
                label: '取消',
                danger: true,
                auth: 'bpm:process-instance:cancel',
                ifShow: record.status === 1,
                onClick: handleCancel.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
