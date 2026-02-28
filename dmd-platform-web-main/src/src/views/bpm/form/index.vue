<!-- 流程管理-流程表单 -->
<script lang="ts" setup>
import {onActivated} from "vue";
import {message} from "ant-design-vue";
import {columns, searchFormSchema} from "./data";
import Detail from "./modules/detail.vue";

import {BasicTable, TableAction, useTable} from "@/components/Table";
import {useI18n} from "@/hooks/web/useI18n";
import {useModal} from "@/components/Modal";
import {useGo} from "@/hooks/web/usePage";
import type {BpmFormApi} from "@/api/bpm/form";
import {deleteForm, getFormPage} from "@/api/bpm/form";

defineOptions({ name: "BpmForm" });

const { t } = useI18n();
const go = useGo();

const [registerDetailModal, { openModal: openDetailModal }] = useModal();

const [registerTable, { reload }] = useTable({
  title: "流程表单",
  api: getFormPage,
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
    width: 240,
    title: "操作",
    dataIndex: "action",
    fixed: "right",
  },
});

/** 新增表单 */
function handleCreate() {
  go({
    name: "BpmFormEditor",
    query: {
      type: "create",
    },
  });
}

/** 编辑表单 */
function handleEdit(row: BpmFormApi.Form) {
  go({
    name: "BpmFormEditor",
    query: {
      id: row.id,
      type: "edit",
    },
  });
}

/** 复制表单 */
function handleCopy(row: BpmFormApi.Form) {
  go({
    name: "BpmFormEditor",
    query: {
      copyId: row.id,
      type: "copy",
    },
  });
}

/** 删除表单 */
async function handleDelete(row: BpmFormApi.Form) {
  const hideLoading = message.loading({
    content: `正在删除 ${row.name}...`,
    duration: 0,
  });
  try {
    await deleteForm(row.id!);
    message.success(`删除 ${row.name} 成功`);
    reload();
  } finally {
    hideLoading();
  }
}

/** 查看表单详情 */
function handleDetail(row: BpmFormApi.Form) {
  openDetailModal(true, row);
}

/** 激活时 */
onActivated(() => {
  reload();
});
</script>

<template>
  <div>
<!--    <DocAlert-->
<!--      title="审批接入（流程表单）"-->
<!--      url="https://doc.iocoder.cn/bpm/use-bpm-form/"-->
<!--    />-->

    <!-- 详情弹窗 -->
    <Detail @register="registerDetailModal" />

    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          v-auth="['bpm:form:create']"
          type="primary"
          @click="handleCreate"
        >
          新增流程表单
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                label: '复制',
                auth: 'bpm:form:update',
                onClick: handleCopy.bind(null, record),
              },
              {
                label: '编辑',
                auth: 'bpm:form:update',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '详情',
                auth: 'bpm:form:query',
                onClick: handleDetail.bind(null, record),
              },
            ]"
            :drop-down-actions="[
              {
                label: '删除',
                danger: true,
                auth: 'bpm:form:delete',
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
