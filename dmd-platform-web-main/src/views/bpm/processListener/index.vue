<script lang="ts" setup>
import type { BpmProcessListenerApi } from '@/api/bpm/processListener';

import { BasicTable, TableAction, useTable } from '@/components/Table';
import { BasicModal, useModal } from '@/components/Modal';
import { IconEnum } from "@/enums/appEnum";
import { message } from 'ant-design-vue';
import { computed, nextTick, ref } from 'vue';
import {
  deleteProcessListener,
  getProcessListenerPage,
} from '@/api/bpm/processListener';
import { useI18n } from '@/hooks/web/useI18n';

import { useGridColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const { t } = useI18n();

const [registerModal, { openModal, setModalProps, closeModal }] = useModal();
const formRef = ref();
const isUpdate = ref(false);
const currentRecord = ref<BpmProcessListenerApi.ProcessListener>();
const getTitle = ref('创建流程表达式');

/** 刷新表格 */
function handleRefresh() {
  reload();
}

/** 创建流程监听器 */
function handleCreate() {
  getTitle.value = '创建流程监听器';
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

/** 编辑流程监听器 */
function handleEdit(row: BpmProcessListenerApi.ProcessListener) {
  getTitle.value = '编辑流程监听器';
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

/** 删除流程监听器 */
async function handleDelete(row: BpmProcessListenerApi.ProcessListener) {
  const hideLoading = message.loading({
    content: t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
  });
  try {
    await deleteProcessListener(row.id as number);
    message.success(t('ui.actionMessage.deleteSuccess', [row.name]));
    handleRefresh();
  } finally {
    hideLoading();
  }
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

const [registerTable, { reload }] = useTable({
  title: '流程监听器',
  api: async (params) => {
    const { data } = await getProcessListenerPage({
      pageNo: params.page,
      pageSize: params.pageSize,
      ...params,
    });
    return {
      list: data.list,
      total: data.total,
    };
  },
  columns: useGridColumns(),
  useSearchForm: true,
  formConfig: {
    schemas: useGridFormSchema(),
  },
  actionColumn: {
    width: 200,
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
  },
});
</script>

<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <TableAction
          :actions="[
            {
              label: '新增流程监听器',
              type: 'primary',
              icon: IconEnum.ADD,
              auth: ['bpm:process-listener:create'],
              onClick: handleCreate,
            },
          ]"
        />
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                label: t('common.edit'),
                type: 'link',
                icon: IconEnum.EDIT,
                auth: ['bpm:process-listener:update'],
                onClick: handleEdit.bind(null, record),
              },
              {
                label: t('common.delete'),
                type: 'link',
                danger: true,
                icon: IconEnum.DELETE,
                auth: ['bpm:process-listener:delete'],
                popConfirm: {
                  title: t('ui.actionMessage.deleteConfirm', [record.name]),
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