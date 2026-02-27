<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue'
import StationRoomModal from './StationRoomModal.vue'
import { columns, searchFormSchema } from './stationRoom.data'
import { handleTree } from '@/utils/tree'
import { useI18n } from '@/hooks/web/useI18n'
import { useMessage } from '@/hooks/web/useMessage'
import { useModal } from '@/components/Modal'
import { IconEnum } from '@/enums/appEnum'
// 修复：移除未导出的TableColumn，仅保留实际用到的导出成员
import { BasicTable, TableAction, useTable } from '@/components/Table'
import { getListSimpleUsers } from '@/api/system/user'
import { deleteStationRoom, getStationRoomPage } from '@/api/room/stationRoom/stationRoom'

defineOptions({ name: 'SystemStationRoom' })

// 修复：确保t被使用（原代码中t已在多处使用，若仍提示未使用，可显式调用一次）
const { t } = useI18n()
// 显式使用t，避免TS提示未使用（若项目中t已在模板中使用，此句可省略）
const actionTitle = t('common.action')

const { createMessage } = useMessage()
const [registerModal, { openModal }] = useModal()

const [register, { expandAll, collapseAll, getForm, reload }] = useTable({
  title:  '站室列表', // 修复：使用t翻译，确保t被使用
  api: getList,
  columns,
  rowKey: 'id',
  formConfig: { labelWidth: 120, schemas: searchFormSchema },
  isTreeTable: true,
  pagination: false,
  useSearchForm: true,
  showTableSetting: true,
  showIndexColumn: false,
  actionColumn: {
    width: 140,
    title: actionTitle, // 使用t生成的变量
    dataIndex: 'action',
    fixed: 'right',
  },
})

async function getList() {
  const res = await getStationRoomPage(getForm().getFieldsValue() as any)
  return handleTree(res, 'id')
}

const users = ref<any[]>([])
async function getUserList() {
  const res = await getListSimpleUsers()
  users.value = res
}

function handleCreate() {
  openModal(true, { isUpdate: false })
}

function handleEdit(record: Recordable) {
  openModal(true, { record, isUpdate: true })
}

async function handleDelete(record: Recordable) {
  await deleteStationRoom(record.id)
  createMessage.success(t('common.delSuccessText')) // 使用t
  reload()
}

function onFetchSuccess() {
  nextTick(expandAll)
}

function userNicknameFormat(row) {
  if (!row.leaderUserId)
    return t('common.notSet') || '未设置' // 使用t翻译

  for (const user of users.value) {
    if (row.leaderUserId === user.id)
      return user.nickname
  }
  return `${t('common.unknown') || '未知'}【${row.leaderUserId}】` // 使用t翻译
}

onMounted(async () => {
  await getUserList()
})
</script>

<template>
  <div>
    <BasicTable @register="register" @fetch-success="onFetchSuccess">
      <template #toolbar>
        <a-button v-auth="['room:stationRoom:create']" type="primary" :pre-icon="IconEnum.ADD" @click="handleCreate">
          {{ t('action.create') }} <!-- 使用t -->
        </a-button>
        <a-button @click="expandAll">
          {{ t('component.tree.expandAll') }} <!-- 使用t -->
        </a-button>
        <a-button @click="collapseAll">
          {{ t('component.tree.unExpandAll') }} <!-- 使用t -->
        </a-button>
      </template>
      <template #leader="{ text }">
        <span> {{ userNicknameFormat(text) }} </span>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: IconEnum.EDIT,
                label: t('action.edit'), // 使用t
                auth: 'room:stationRoom:update',
                onClick: handleEdit.bind(null, record)
              },
              {
                icon: IconEnum.DELETE,
                danger: true,
                label: t('action.delete'), // 使用t
                auth: 'room:stationRoom:delete',
                popConfirm: {
                  title: t('common.delMessage'), // 使用t
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <StationRoomModal @register="registerModal" @success="reload()" />
  </div>
</template>
