<script lang="ts" setup>
import { reactive } from "vue";
import CategoryModal from "./modules/form.vue";
import { columns, searchFormSchema } from "./data";
import { useI18n } from "@/hooks/web/useI18n";
import { useMessage } from "@/hooks/web/useMessage";
import { useModal } from "@/components/Modal";
import { IconEnum } from "@/enums/appEnum";
import { BasicTable, TableAction, useTable } from "@/components/Table";
import { deleteCategory, getCategoryPage } from "@/api/bpm/category";
import type { CategoryVO } from "@/api/bpm/category";

defineOptions({ name: "BpmCategory" });

const { t } = useI18n();
const { createMessage } = useMessage();
const [registerModal, { openModal }] = useModal();

const [registerTable, { reload }] = useTable({
  title: "流程分类列表",
  api: getCategoryPage,
  columns,
  formConfig: {
    labelWidth: 90,
    schemas: searchFormSchema,
  },
  useSearchForm: true,
  showTableSetting: true,
  showIndexColumn: false,
  actionColumn: {
    width: 140,
    title: t("common.action"),
    dataIndex: "action",
    fixed: "right",
  },
});

function handleCreate() {
  openModal(true, { isUpdate: false });
}

function handleEdit(record: CategoryVO) {
  openModal(true, { record, isUpdate: true });
}

async function handleDelete(record: CategoryVO) {
  await deleteCategory(record.id!);
  createMessage.success(t("common.delSuccessText"));
  reload();
}
</script>

<template>
  <div>
    <!-- <DocAlert title="工作流手册" url="https://doc.iocoder.cn/bpm/" /> -->
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
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: IconEnum.EDIT,
                label: t('action.edit'),
                auth: 'bpm:category:update',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: IconEnum.DELETE,
                danger: true,
                label: t('action.delete'),
                auth: 'bpm:category:delete',
                popConfirm: {
                  title: t('common.delMessage'),
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <CategoryModal @register="registerModal" @success="reload()" />
  </div>
</template>
