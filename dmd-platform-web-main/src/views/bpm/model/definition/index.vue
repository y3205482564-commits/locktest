<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Button, Tooltip } from 'ant-design-vue';

import Detail from '../../form/modules/detail.vue';
import { columns } from './data';

import type { ProcessDefinitionVO } from '@/api/bpm/definition';

import { BasicTable, TableAction, useTable } from '@/components/Table';
import { DocAlert } from '@/components/DocAlert';
import { useModal } from '@/components/Modal';
import { useI18n } from '@/hooks/web/useI18n';
import { getProcessDefinitionPage } from '@/api/bpm/definition';

defineOptions({ name: 'BpmProcessDefinition' });

// BPM 模型表单类型常量
const BpmModelFormType = {
  NORMAL: 10,
  CUSTOM: 20,
};

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const [registerFormDetailModal, { openModal: openFormDetailModal }] = useModal();

const [registerTable, { reload }] = useTable({
  title: '流程定义列表',
  api: getProcessDefinitionPage,
  searchInfo: {
    key: route.query.key as string,
  },
  columns,
  rowKey: 'id',
  useSearchForm: false,
  showTableSetting: true,
  bordered: true,
  actionColumn: {
    width: 120,
    title: t('common.action'),
    dataIndex: 'action',
    fixed: 'right',
  },
});

/** 刷新表格 */
function handleRefresh() {
  reload();
}

/** 查看表单详情 */
async function handleFormDetail(row: any) {
  if (row.formType === BpmModelFormType.NORMAL) {
    openFormDetailModal(true, { id: row.formId });
  } else {
    await router.push({
      path: row.formCustomCreatePath,
    });
  }
}

/** 恢复流程模型 */
async function handleRecover(row: any) {
  await router.push({
    name: 'BpmModelUpdate',
    params: { id: row.id, type: 'definition' },
  });
}

/** 初始化 */
onMounted(() => {
  handleRefresh();
});
</script>

<template>
  <div>
    <DocAlert title="工作流手册" url="https://doc.iocoder.cn/bpm/" />
    <Detail @register="registerFormDetailModal" />
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'startUsers'">
          <template v-if="!record.startUsers || record.startUsers.length === 0">
            全部可见
          </template>
          <template v-else-if="record.startUsers.length === 1">
            {{ record.startUsers[0]!.nickname }}
          </template>
          <template v-else>
            <Tooltip
              placement="top"
              :title="record.startUsers.map((user: any) => user.nickname).join(',')"
            >
              {{ record.startUsers[0]!.nickname }}等
              {{ record.startUsers.length }} 人可见
            </Tooltip>
          </template>
        </template>
        <template v-if="column.dataIndex === 'formType'">
          <Button
            v-if="record.formType === BpmModelFormType.NORMAL"
            type="link"
            @click="handleFormDetail(record)"
          >
            <span>{{ record.formName }}</span>
          </Button>
          <Button
            v-else-if="record.formType === BpmModelFormType.CUSTOM"
            type="link"
            @click="handleFormDetail(record)"
          >
            <span>{{ record.formCustomCreatePath }}</span>
          </Button>
          <span v-else>暂无表单</span>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                label: '恢复',
                auth: 'bpm:model:update',
                onClick: handleRecover.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </div>
</template>
