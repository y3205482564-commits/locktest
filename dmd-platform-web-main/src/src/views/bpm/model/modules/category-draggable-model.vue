<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

import { cloneDeep, isEqual } from 'lodash-es';
import { useDebounceFn } from '@vueuse/core';
import {
  Button,
  Card,
  Collapse,
  Dropdown,
  Menu,
  Table,
  Tag,
  Tooltip,
  message,
} from 'ant-design-vue';

import CategoryRenameForm from '../../category/modules/rename-form.vue';
import FormCreateDetail from '../../form/modules/detail.vue';

import type { ModelCategoryInfo, ModelVO } from '@/api/bpm/model';

import { deleteCategory } from '@/api/bpm/category';
import {
  cleanModel,
  deleteModel,
  deployModel,
  updateModelSortBatch,
  updateModelState,
} from '@/api/bpm/model';
import { Icon } from '@/components/Icon';
import { useModal } from '@/components/Modal';
import { useI18n } from '@/hooks/web/useI18n';
import { useMessage } from '@/hooks/web/useMessage';
import { usePermission } from '@/hooks/web/usePermission';
import { useUserStoreWithOut } from '@/store/modules/user';
import { formatToDateTime } from '@/utils/dateUtil';

const props = defineProps<{
  categoryInfo: ModelCategoryInfo
  isCategorySorting: boolean
  isFirst?: boolean
}>();

const emit = defineEmits(['success']);

// BPM 模型表单类型常量
const BpmModelFormType = {
  NORMAL: 10,
  CUSTOM: 20,
};

const { t } = useI18n();
const { createConfirm } = useMessage();
const router = useRouter();
const userStore = useUserStoreWithOut();
const userId = userStore.getUserInfo?.user?.id;

const [registerCategoryRenameModal, { openModal: openCategoryRenameModal }] = useModal();
const [registerFormDetailModal, { openModal: openFormDetailModal }] = useModal();

const isModelSorting = ref(false);
const originalData = ref<ModelVO[]>([]);
const modelList = ref<ModelVO[]>([]);
const isExpand = ref(props.isFirst); // 根据是否为第一个分类, 来设置初始展开状态

/** 解决 v-model 问题，使用计算属性 */
const expandKeys = computed(() => (isExpand.value ? ['1'] : []));

const { hasPermission } = usePermission();
/** 权限校验 */
const hasPermiUpdate = computed(() => hasPermission('bpm:model:update'));
const hasPermiDelete = computed(() => hasPermission('bpm:model:delete'));
const hasPermiDeploy = computed(() => hasPermission('bpm:model:deploy'));

/** 处理模型的排序 */
function handleModelSort() {
  // 保存初始数据
  if (props.categoryInfo.modelList && props.categoryInfo.modelList.length > 0) {
    originalData.value = cloneDeep(props.categoryInfo.modelList);
    modelList.value = cloneDeep(props.categoryInfo.modelList);
  }
  // 展开数据
  isExpand.value = true;
  isModelSorting.value = true;
  // 注意：拖拽排序功能需要安装 @vueuse/integrations sortablejs 依赖
  message.info('模型排序模式已开启（拖拽功能需要安装额外依赖）');
}

/** 处理模型的排序提交 */
async function handleModelSortSubmit() {
  if (!modelList.value || modelList.value.length === 0) {
    message.error('排序数据异常，请重试');
    return;
  }

  const hideLoading = message.loading({ content: '正在保存排序...', duration: 0 });
  try {
    const ids = modelList.value.map((item) => item.id);
    await updateModelSortBatch(ids);
    isModelSorting.value = false;
    message.success('排序模型成功');
    emit('success');
  } catch (error) {
    console.error('排序保存失败', error);
  } finally {
    hideLoading();
  }
}

/** 处理模型的排序取消 */
function handleModelSortCancel() {
  if (originalData.value && originalData.value.length > 0) {
    modelList.value = cloneDeep(originalData.value);
  }
  isModelSorting.value = false;
}

/** 处理下拉菜单命令 */
function handleCommand(command: string) {
  if (command === 'renameCategory') {
    openCategoryRenameModal(true, props.categoryInfo);
  } else if (command === 'deleteCategory') {
    handleDeleteCategory();
  }
}

/** 删除流程分类 */
async function handleDeleteCategory() {
  if (props.categoryInfo.modelList.length > 0) {
    message.warning('该分类下仍有流程定义,不允许删除');
    return;
  }

  createConfirm({
    title: '删除确认',
    content: `确定要删除[${props.categoryInfo.name}]吗？`,
    iconType: 'warning',
    async onOk() {
      const hideLoading = message.loading({ content: `正在删除分类: "${props.categoryInfo.name}"...`, duration: 0 });
      try {
        await deleteCategory(props.categoryInfo.id);
        message.success(t('common.delSuccessText'));
        emit('success');
      } finally {
        hideLoading();
      }
    },
  });
}

/** 处理表单详情点击 */
async function handleFormDetail(row: any) {
  if (row.formType === BpmModelFormType.NORMAL) {
    openFormDetailModal(true, { id: row.formId });
  } else {
    await router.push({ path: row.formCustomCreatePath });
  }
}

/** 判断是否是流程管理员 */
function isManagerUser(row: any) {
  return row.managerUserIds && row.managerUserIds.includes(userId);
}

/** 模型操作 */
async function modelOperation(type: string, id: number) {
  await router.push({
    name: 'BpmModelUpdate',
    params: { id, type },
  });
}

/** 发布流程 */
async function handleDeploy(row: any) {
  createConfirm({
    title: '发布确认',
    content: `确认要发布[${row.name}]流程吗？`,
    iconType: 'info',
    async onOk() {
      const hideLoading = message.loading({ content: `正在发布流程: "${row.name}"...`, duration: 0 });
      try {
        await deployModel(row.id);
        message.success(`发布[${row.name}]流程成功`);
        emit('success');
      } finally {
        hideLoading();
      }
    },
  });
}

/** '更多'操作按钮 */
function handleModelCommand(command: string, row: any) {
  switch (command) {
    case 'handleChangeState':
      handleChangeState(row);
      break;
    case 'handleClean':
      handleClean(row);
      break;
    case 'handleCopy':
      modelOperation('copy', row.id);
      break;
    case 'handleDefinitionList':
      handleDefinitionList(row);
      break;
    case 'handleDelete':
      handleDelete(row);
      break;
    case 'handleReport':
      handleReport(row);
      break;
    default:
      break;
  }
}

/** 更新状态操作 */
async function handleChangeState(row: any) {
  const state = row.processDefinition.suspensionState;
  const newState = state === 1 ? 2 : 1;
  const statusState = state === 1 ? '停用' : '启用';
  createConfirm({
    title: '状态变更',
    content: `确认要${statusState}流程: "${row.name}" 吗？`,
    iconType: 'warning',
    async onOk() {
      const hideLoading = message.loading({ content: `正在${statusState}流程: "${row.name}"...`, duration: 0 });
      try {
        await updateModelState(row.id, newState);
        message.success(`${statusState} 流程: "${row.name}" 成功`);
        emit('success');
      } finally {
        hideLoading();
      }
    },
  });
}

/** 清理流程操作 */
async function handleClean(row: any) {
  createConfirm({
    title: '清理确认',
    content: `确认要清理流程: "${row.name}" 吗？`,
    iconType: 'warning',
    async onOk() {
      const hideLoading = message.loading({ content: `正在清理流程: "${row.name}"...`, duration: 0 });
      try {
        await cleanModel(row.id);
        message.success(`清理流程: "${row.name}" 成功`);
        emit('success');
      } finally {
        hideLoading();
      }
    },
  });
}

/** 删除流程操作 */
async function handleDelete(row: any) {
  createConfirm({
    title: '删除确认',
    content: `确认要删除流程: "${row.name}" 吗？`,
    iconType: 'error',
    async onOk() {
      const hideLoading = message.loading({ content: t('ui.actionMessage.deleting', [row.name]), duration: 0 });
      try {
        await deleteModel(row.id);
        message.success(`删除流程: "${row.name}" 成功`);
        emit('success');
      } finally {
        hideLoading();
      }
    },
  });
}

/** 跳转到指定流程定义列表 */
function handleDefinitionList(row: any) {
  router.push({
    name: 'BpmProcessDefinition',
    query: { key: row.key },
  });
}

/** 跳转到流程报表页面 */
function handleReport(row: any) {
  router.push({
    name: 'BpmProcessInstanceReport',
    query: {
      processDefinitionId: row.processDefinition.id,
      processDefinitionKey: row.key,
    },
  });
}

/** 更新 modelList 模型列表 */
const updateModelList = useDebounceFn(() => {
  const newModelList = props.categoryInfo.modelList;
  if (!isEqual(modelList.value, newModelList)) {
    modelList.value = cloneDeep(newModelList);
    isModelSorting.value = false;
  }
}, 100);

/** 监听分类信息和排序状态变化 */
watchEffect(() => {
  if (props.categoryInfo?.modelList) {
    updateModelList();
  }
  if (props.isCategorySorting) {
    isExpand.value = false;
  }
});

/** 处理重命名成功 */
function handleRenameSuccess() {
  emit('success');
}
</script>

<template>
  <div>
    <Card
      :body-style="{ padding: 0 }"
      class="category-draggable-model mb-5 rounded-lg transition-all duration-300 ease-in-out hover:shadow-xl"
    >
      <div class="h-12 flex items-center">
        <!-- 头部：分类名 -->
        <div class="flex items-center">
          <Tooltip v-if="isCategorySorting" title="拖动排序">
            <Icon icon="ant-design:drag-outlined" class="drag-handle ml-2.5 cursor-move text-2xl text-gray-500" />
          </Tooltip>
          <div class="ml-4 mr-2 text-lg font-medium">
            {{ categoryInfo.name }}
          </div>
          <div class="text-gray-500">
            ({{ categoryInfo.modelList?.length || 0 }})
          </div>
        </div>

        <!-- 头部：操作 -->
        <div v-show="!isCategorySorting" class="flex flex-1 items-center">
          <div
            v-if="categoryInfo.modelList.length > 0"
            class="ml-3 flex cursor-pointer items-center transition-transform duration-300"
            :class="isExpand ? 'rotate-180' : 'rotate-0'"
            @click="isExpand = !isExpand"
          >
            <Icon icon="ant-design:down-outlined" class="text-xl text-gray-400" />
          </div>

          <div class="ml-auto flex items-center" :class="isModelSorting ? 'mr-4' : 'mr-8'">
            <template v-if="!isModelSorting">
              <Button
                v-if="categoryInfo.modelList.length > 0"
                type="link"
                size="small"
                class="flex items-center text-sm"
                @click.stop="handleModelSort"
              >
                <template #icon>
                  <Icon icon="ant-design:sort-ascending-outlined" />
                </template>
                排序
              </Button>
              <Dropdown placement="bottom" arrow>
                <Button type="link" size="small" class="flex items-center text-sm">
                  <template #icon>
                    <Icon icon="ant-design:setting-outlined" />
                  </template>
                  分类
                </Button>
                <template #overlay>
                  <Menu @click="(e) => handleCommand(e.key as string)">
                    <Menu.Item key="renameCategory">
                      重命名
                    </Menu.Item>
                    <Menu.Item key="deleteCategory">
                      删除分类
                    </Menu.Item>
                  </Menu>
                </template>
              </Dropdown>
            </template>

            <template v-else>
              <Button class="mr-2" @click.stop="handleModelSortCancel">
                取 消
              </Button>
              <Button type="primary" @click.stop="handleModelSortSubmit">
                保存排序
              </Button>
            </template>
          </div>
        </div>
      </div>

      <!-- 模型列表 -->
      <Collapse
        :active-key="expandKeys"
        :bordered="false"
        class="collapse-no-padding bg-transparent"
      >
        <Collapse.Panel
          v-show="isExpand"
          key="1"
          :show-arrow="false"
          class="border-0 bg-transparent p-0"
        >
          <Table
            v-if="modelList && modelList.length > 0"
            :columns="[
              { title: '流程名称', dataIndex: 'name', key: 'name', width: 200 },
              { title: '可见范围', dataIndex: 'startUserIds', key: 'startUserIds', width: 150 },
              { title: '流程类型', dataIndex: 'type', key: 'type', width: 120 },
              { title: '表单信息', dataIndex: 'formType', key: 'formType', width: 150 },
              { title: '最后发布', dataIndex: 'deploymentTime', key: 'deploymentTime', width: 280 },
              { title: '操作', key: 'action', width: 150, fixed: 'right' },
            ]"
            :data-source="modelList"
            :pagination="false"
            row-key="id"
            size="small"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'name'">
                <div class="flex items-center overflow-hidden">
                  <div
                    v-if="!record.icon"
                    class="mr-2.5 h-9 w-9 flex flex-shrink-0 items-center justify-center rounded bg-blue-500 text-white"
                  >
                    <span class="text-xs">{{ record.name.substring(0, 2) }}</span>
                  </div>
                  <img v-else :src="record.icon" class="mr-2.5 h-9 w-9 shrink-0 rounded" alt="图标">
                  <div class="min-w-0 overflow-hidden">
                    <Tooltip :title="record.name">
                      <span class="truncate">{{ record.name }}</span>
                    </Tooltip>
                  </div>
                </div>
              </template>
              <template v-if="column.key === 'startUserIds'">
                <span v-if="!record.startUsers?.length && !record.startDepts?.length">
                  全部可见
                </span>
                <span v-else-if="record.startUsers?.length === 1">
                  {{ record.startUsers[0].nickname }}
                </span>
                <span v-else-if="record.startDepts?.length === 1">
                  {{ record.startDepts[0].name }}
                </span>
                <span v-else-if="record.startDepts?.length > 1">
                  <Tooltip :title="record.startDepts.map((dept: any) => dept.name).join('、')">
                    {{ record.startDepts[0].name }}等 {{ record.startDepts.length }} 个部门可见
                  </Tooltip>
                </span>
                <span v-else-if="record.startUsers?.length > 1">
                  <Tooltip :title="record.startUsers.map((user: any) => user.nickname).join('、')">
                    {{ record.startUsers[0].nickname }}等 {{ record.startUsers.length }} 人可见
                  </Tooltip>
                </span>
              </template>
              <template v-if="column.key === 'formType'">
                <Button
                  v-if="record.formType === BpmModelFormType.NORMAL"
                  type="link"
                  @click="handleFormDetail(record)"
                >
                  {{ record.formName }}
                </Button>
                <Button
                  v-else-if="record.formType === BpmModelFormType.CUSTOM"
                  type="link"
                  @click="handleFormDetail(record)"
                >
                  {{ record.formCustomCreatePath }}
                </Button>
                <span v-else>暂无表单</span>
              </template>
              <template v-if="column.key === 'deploymentTime'">
                <div class="flex items-center justify-center">
                  <span v-if="record.processDefinition" class="w-36">
                    {{ formatToDateTime(record.processDefinition.deploymentTime) }}
                  </span>
                  <Tag v-if="record.processDefinition">
                    v{{ record.processDefinition.version }}
                  </Tag>
                  <Tag v-else color="warning">
                    未部署
                  </Tag>
                  <Tag
                    v-if="record.processDefinition?.suspensionState === 2"
                    color="warning"
                    class="ml-2.5"
                  >
                    已停用
                  </Tag>
                </div>
              </template>
              <template v-if="column.key === 'action'">
                <div class="flex items-center space-x-0">
                  <Button
                    type="link"
                    size="small"
                    class="px-1"
                    :disabled="!isManagerUser(record) && !hasPermiUpdate"
                    @click="modelOperation('update', record.id)"
                  >
                    修改
                  </Button>
                  <Button
                    type="link"
                    size="small"
                    class="px-1"
                    :disabled="!isManagerUser(record) && !hasPermiDeploy"
                    @click="handleDeploy(record)"
                  >
                    发布
                  </Button>
                  <Dropdown placement="bottomRight" arrow>
                    <Button type="link" size="small" class="px-1">
                      更多
                    </Button>
                    <template #overlay>
                      <Menu @click="(e) => handleModelCommand(e.key as string, record)">
                        <Menu.Item key="handleCopy">
                          复制
                        </Menu.Item>
                        <Menu.Item key="handleDefinitionList">
                          历史
                        </Menu.Item>
                        <Menu.Item key="handleReport" :disabled="!isManagerUser(record)">
                          报表
                        </Menu.Item>
                        <Menu.Item
                          v-if="record.processDefinition"
                          key="handleChangeState"
                          :disabled="!isManagerUser(record)"
                        >
                          {{ record.processDefinition.suspensionState === 1 ? '停用' : '启用' }}
                        </Menu.Item>
                        <Menu.Item key="handleClean" danger :disabled="!isManagerUser(record)">
                          清理
                        </Menu.Item>
                        <Menu.Item key="handleDelete" danger :disabled="!isManagerUser(record) && !hasPermiDelete">
                          删除
                        </Menu.Item>
                      </Menu>
                    </template>
                  </Dropdown>
                </div>
              </template>
            </template>
          </Table>
        </Collapse.Panel>
      </Collapse>
    </Card>

    <!-- 重命名分类弹窗 -->
    <CategoryRenameForm @register="registerCategoryRenameModal" @success="handleRenameSuccess" />
    <!-- 流程表单详情对话框 -->
    <FormCreateDetail @register="registerFormDetailModal" />
  </div>
</template>

<style scoped>
/* :deep() 实现样式穿透 */
.collapse-no-padding :deep(.ant-collapse-header),
.collapse-no-padding :deep(.ant-collapse-content-box) {
  padding: 0;
}
</style>
