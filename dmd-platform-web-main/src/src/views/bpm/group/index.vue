<script lang="ts" setup>
import {message} from "ant-design-vue";

import {columns, searchFormSchema} from './data';
import Form from './modules/form.vue';
import {BasicTable, TableAction, useTable} from '@/components/Table';
import {useModal} from '@/components/Modal';
import {deleteUserGroup, getUserGroupPage} from '@/api/bpm/userGroup';

defineOptions({ name: "BpmGroup" });

const [registerFormModal, { openModal }] = useModal();

const [registerTable, { reload }] = useTable({
  title: '用户分组',
  api: getUserGroupPage,
  columns,
  formConfig: {
    labelWidth: 90,
    schemas: searchFormSchema,
    autoSubmitOnEnter: true,
  },
  rowKey: "id",
  useSearchForm: true,
  showTableSetting: true,
  bordered: true,
  actionColumn: {
    width: 180,
    title: "操作",
    dataIndex: "action",
    fixed: "right",
  },
});

/** 创建用户分组 */
function handleCreate() {
  openModal(true, { isUpdate: false });
}

/** 编辑用户分组 */
function handleEdit(row: any) {
  openModal(true, { isUpdate: true, record: row });
}

/** 删除用户分组 */
async function handleDelete(row: any) {
  const hideLoading = message.loading({
    content: `正在删除 ${row.name}...`,
    duration: 0,
  });
  try {
    await deleteUserGroup(row.id as number);
    message.success(`删除 ${row.name} 成功`);
    reload();
  } finally {
    hideLoading();
  }
}
</script>

<template>
  <div>
<!--    <DocAlert title="工作流手册" url="https://doc.iocoder.cn/bpm/" />-->

    <!-- 表单弹窗 -->
    <Form @register="registerFormModal" @success="reload" />

    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          v-auth="['bpm:user-group:create']"
          type="primary"
          @click="handleCreate"
        >
          新增用户分组
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                label: '编辑',
                auth: 'bpm:user-group:update',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                danger: true,
                auth: 'bpm:user-group:delete',
                popConfirm: {
                  title: `确定删除 ${record.name} 吗?`,
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </div>
</template>
