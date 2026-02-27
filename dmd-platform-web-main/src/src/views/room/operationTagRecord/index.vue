<script lang="ts" setup>
import OperationTagRecordModal from './OperationTagRecordModal.vue'
import OperationTagRecordReturnModal from './OperationTagRecordReturnModal.vue'
import OperationTagRecordInvalidModal from './OperationTagRecordInvalidModal.vue'
import { columns, searchFormSchema } from './operationTagRecord.data'
import { useI18n } from '@/hooks/web/useI18n'
import { useMessage } from '@/hooks/web/useMessage'
import { useModal } from '@/components/Modal'
import { IconEnum } from '@/enums/appEnum'
import { BasicTable, TableAction, useTable } from '@/components/Table'
import type { OperationTagRecordExportReqVO } from '@/api/room/operationTagRecord/operationTagRecord'
import { deleteOperationTagRecord, exportOperationTagRecord, getOperationTagRecordPage } from '@/api/room/operationTagRecord/operationTagRecord'

defineOptions({ name: 'DigitalCardOperationTagRecord' })

const { t } = useI18n()
const { createConfirm, createMessage } = useMessage()

// 注册弹窗
const [registerModal, { openModal }] = useModal()
const [registerReturnModal, { openModal: openReturnModal }] = useModal()
const [registerInvalidModal, { openModal: openInvalidModal }] = useModal()

// 注册表格
const [registerTable, { getForm, reload }] = useTable({
  title: '操作牌领用归还记录',
  api: getOperationTagRecordPage,
  columns,
  formConfig: { labelWidth: 120, schemas: searchFormSchema },
  useSearchForm: true,
  showTableSetting: true,
  showIndexColumn: false,
  actionColumn: {
    width: 180,
    title: t('common.action'),
    dataIndex: 'action',
    fixed: 'right',
  },
})

/**
 * 新增记录
 */
function handleCreate() {
  openModal(true, { isUpdate: false })
}

/**
 * 编辑记录
 */
function handleEdit(record: Recordable) {
  openModal(true, { record, isUpdate: true })
}

/**
 * 标记归还
 */
function handleReturn(record: Recordable) {
  openReturnModal(true, { record })
}

/**
 * 作废记录
 */
function handleInvalid(record: Recordable) {
  openInvalidModal(true, { record })
}

/**
 * 导出记录
 */
async function handleExport() {
  createConfirm({
    title: t('common.exportTitle'),
    iconType: 'warning',
    content: t('common.exportMessage'),
    async onOk() {
      await exportOperationTagRecord(getForm().getFieldsValue() as OperationTagRecordExportReqVO)
      createMessage.success(t('common.exportSuccessText'))
    },
  })
}

/**
 * 删除记录
 */
async function handleDelete(record: Recordable) {
  await deleteOperationTagRecord(record.id)
  createMessage.success(t('common.delSuccessText'))
  reload()
}
</script>

<template>
  <div>
    <BasicTable @register="registerTable">
      <!-- 工具栏 -->
      <template #toolbar>
        <a-button v-auth="['room:operationTagRecord:create']" type="primary" :pre-icon="IconEnum.ADD" @click="handleCreate">
          {{ t('action.create') }}
        </a-button>
        <a-button v-auth="['room:operationTagRecord:export']" :pre-icon="IconEnum.EXPORT" @click="handleExport">
          {{ t('action.export') }}
        </a-button>
      </template>

      <!-- 单元格自定义渲染 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              { icon: IconEnum.EDIT, label: t('action.edit'), auth: 'room:operationTagRecord:update', onClick: handleEdit.bind(null, record) },
            ]"
            :drop-down-actions="[
              // 归还操作（仅未归还记录显示）
              {
                // icon: IconEnum.CHECK,
                label: '标记归还',
                auth: 'room:operationTagRecord:update',
                onClick: handleReturn.bind(null, record),
                ifShow: () => record.status === 1
              },
              // 作废操作（仅未作废记录显示）
              {
                // icon: IconEnum.CLOSE,
                label: '作废记录',
                auth: 'room:operationTagRecord:update',
                onClick: handleInvalid.bind(null, record),
                ifShow: () => record.status !== 3
              },
              // 删除操作
              {
                icon: IconEnum.DELETE,
                danger: true,
                label: t('action.delete'),
                auth: 'room:operationTagRecord:delete',
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

    <!-- 新增/编辑弹窗 -->
    <OperationTagRecordModal @register="registerModal" @success="reload()" />
    <!-- 归还弹窗 -->
    <OperationTagRecordReturnModal @register="registerReturnModal" @success="reload()" />
    <!-- 作废弹窗 -->
    <OperationTagRecordInvalidModal @register="registerInvalidModal" @success="reload()" />
  </div>
</template>
