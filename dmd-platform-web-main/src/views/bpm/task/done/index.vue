<script lang="ts" setup>
import { columns, searchFormSchema } from './done.data'
import { useGo } from '@/hooks/web/usePage'
import { useI18n } from '@/hooks/web/useI18n'
import { BasicTable, TableAction, useTable } from '@/components/Table'
import { IconEnum } from '@/enums/appEnum'
import { getTaskDonePage,BpmTaskApi,withdrawTask } from '@/api/bpm/task'
import { DocAlert } from '@/components/DocAlert'
import { useMessage } from '@/hooks/web/useMessage'
import { message} from 'ant-design-vue';
const { createMessage } = useMessage()
const go = useGo()
const { t } = useI18n()
defineOptions({ name: 'BpmDoneTask' })
const [registerTable, { reload }]= useTable({
  title: '审批列表', 
  api: getTaskDonePage,
  columns,
  formConfig: { labelWidth: 120, schemas: searchFormSchema },
  useSearchForm: true,
  showTableSetting: true,
  actionColumn: {
    width: 140,
    title: t('common.action'),
    dataIndex: 'action',
    fixed: 'right',
  },
})

// function openDetail(record: Recordable) {
//   console.info(record)
// }

// function handleAudit(record: Recordable) {
//   go({ name: 'BpmProcessInstanceDetail', query: { id: record.id } })
// }
/** 查看历史 */
function handleHistory(row: BpmTaskApi.TaskManager) {
  go({ name: 'BpmProcessInstanceDetail', query: {  id: row.processInstance.id,  taskId: row.id,} });
  // router.push({
  //   name: 'BpmProcessInstanceDetail',
  //   query: {
  //     id: row.processInstance.id,
  //     taskId: row.id,
  //   },
  // });
}

/** 撤回任务 */
async function handleWithdraw(row: BpmTaskApi.TaskManager) {
  const hideLoading = message.loading({ content: '正在撤回中...', duration: 0 });

  try {
    await withdrawTask(row.id);
    createMessage.success('撤回成功')
    reload();
  } finally {
    hideLoading();
  }
}


</script>

<template>
  <div>
    <DocAlert title="审批通过、不通过、驳回" url="https://doc.iocoder.cn/bpm/task-todo-done/" />
    <DocAlert title="审批加签、减签" url="https://doc.iocoder.cn/bpm/sign/" />
    <DocAlert
      title="审批转办、委派、抄送"
      url="https://doc.iocoder.cn/bpm/task-delegation-and-cc/"
    />
    <DocAlert title="审批加签、减签" url="https://doc.iocoder.cn/bpm/sign/" />

    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
                {
              label: '撤回',
              type: 'link',
              danger: true,
              icon: IconEnum.DELETE,
              popConfirm: {
                title: '确定要撤回该任务吗？',
                confirm: handleWithdraw.bind(null, record),
              },
            },   {
              label: '历史',
              type: 'link',
              icon: IconEnum.VIEW,
              onClick: handleHistory.bind(null, record),
            },
              // { icon: IconEnum.VIEW, label: t('action.detail'), onClick: openDetail.bind(null, record) },
              // { icon: IconEnum.VIEW, label: '流程', onClick: handleAudit.bind(null, record) },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </div>
</template>
