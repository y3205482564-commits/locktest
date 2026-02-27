<script lang="ts" setup>
import type { BpmProcessExpressionApi } from '@/api/bpm/processExpression';
import { BasicTable, TableAction, useTable } from '@/components/Table';
import { BasicModal, useModal } from '@/components/Modal';
import { IconEnum } from "@/enums/appEnum";
import { message } from 'ant-design-vue';
import { computed, nextTick, ref } from 'vue'
import {
  deleteProcessExpression,
  getProcessExpressionPage,
} from '@/api/bpm/processExpression';
import { useI18n } from '@/hooks/web/useI18n';

import { useGridColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

// 创建Form组件的ref
const formRef = ref();

const { t } = useI18n();

const [registerModal, { openModal, setModalProps, closeModal }] = useModal();

const getTitle = ref('创建流程表达式');
const isUpdate = ref(false);
const currentRecord = ref<BpmProcessExpressionApi.ProcessExpression>();

/** 刷新表格 */
function handleRefresh() {
  reload();
}

/** 创建流程表达式 */
function handleCreate() {
  getTitle.value = '创建流程表达式';
  isUpdate.value = false;
  currentRecord.value = undefined;
  openModal(true);
  // 重置表单
  nextTick(() => {
    if (formRef.value && formRef.value.resetFields) {
      formRef.value.resetFields();
    }
  });
}

/** 编辑流程表达式 */
function handleEdit(row: BpmProcessExpressionApi.ProcessExpression) {
  getTitle.value = '编辑流程表达式';
  isUpdate.value = true;
  currentRecord.value = row;
  openModal(true);
  // 重置表单并设置编辑数据
  nextTick(() => {
    if (formRef.value && formRef.value.resetFields) {
      formRef.value.resetFields();
    }
  });
}

/** 提交表单 */
async function handleSubmit() {
  // 调用Form组件的提交方法
  if (formRef.value && formRef.value.handleSubmit) {
    const success = await formRef.value.handleSubmit();
    if (success) {
      // 提交成功后关闭模态框
      closeModal();
    }
  }
}

/** 删除流程表达式 */
async function handleDelete(row: BpmProcessExpressionApi.ProcessExpression) {
  const hideLoading = message.loading({
    content: t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
  });
  try {
    await deleteProcessExpression(row.id as number);
    message.success(t('ui.actionMessage.deleteSuccess', [row.name]));
    handleRefresh();
  } finally {
    hideLoading();
  }
}

const [registerTable, { reload }] = useTable({
  title: '流程表达式',
  api: async (params: any) => {
    const res = await getProcessExpressionPage({
      pageNo: params.page,
      pageSize: params.pageSize,
      ...params,
    });
    return res;
  },
  columns: useGridColumns(),
  formConfig: {
    labelWidth: 100,
    schemas: useGridFormSchema(),
    autoSubmitOnEnter: true,
  },
  rowKey: 'id',
  useSearchForm: true,
  showTableSetting: true,
  bordered: true,
  actionColumn: {
    width: 140,
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
  },
});
</script>

<template>
  <div autoContentHeight>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          v-auth="['bpm:category:create']"
          type="primary"
          :pre-icon="IconEnum.ADD"
          @click="handleCreate"
        >
          {{ t("action.create") }}
        </a-button>
      </template>
        <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction
          :actions="[
            {
              label: '编辑',
              type: 'link',
              onClick: handleEdit.bind(null, record),
            },
            {
              label: '删除',
              type: 'link',
              popConfirm: {
                title: '确认删除流程表达式吗？',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
          />
        </template>
      </template>
    </BasicTable>
    <BasicModal @register="registerModal" :title="getTitle" :width="800" @ok="handleSubmit">
      <Form ref="formRef" :is-update="isUpdate" :record="currentRecord" @success="handleRefresh" />
    </BasicModal>
   </div>
</template>
