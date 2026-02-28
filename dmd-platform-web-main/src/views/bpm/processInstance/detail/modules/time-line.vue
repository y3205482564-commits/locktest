<!-- 审批详情的右侧：审批流 -->
<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Avatar, Button, Image, Timeline, Tooltip } from 'ant-design-vue';

import type { BpmProcessInstanceApi } from '@/api/bpm/processInstance';

import { Icon } from '@/components/Icon';
import { BasicModal, useModal } from '@/components/Modal';
import { formatToDateTime } from '@/utils/dateUtil';
import { isEmpty } from '@/utils/is';

defineOptions({ name: 'BpmProcessInstanceTimeline' });

const props = withDefaults(
  defineProps<{
    activityNodes: BpmProcessInstanceApi.ApprovalNodeInfo[]
    enableApproveUserSelect?: boolean
    showStatusIcon?: boolean
  }>(),
  {
    showStatusIcon: true,
    enableApproveUserSelect: false,
  },
);

const emit = defineEmits<{
  selectUserConfirm: [activityId: string, userList: any[]]
}>();

// BPM 节点类型枚举
const BpmNodeTypeEnum = {
  START_USER_NODE: 0,
  CONDITION_BRANCH_NODE: 1,
  PARALLEL_BRANCH_NODE: 2,
  INCLUSIVE_BRANCH_NODE: 3,
  CONDITION_NODE: 4,
  COPY_TASK_NODE: 5,
  USER_TASK_NODE: 10,
  TRANSACTOR_NODE: 12,
  DELAY_TIMER_NODE: 13,
  TRIGGER_NODE: 14,
  CHILD_PROCESS_NODE: 15,
  ROUTER_BRANCH_NODE: 16,
  END_EVENT_NODE: 50,
};

// BPM 任务状态枚举
const BpmTaskStatusEnum = {
  NOT_START: -1,
  WAIT: 0,
  RUNNING: 1,
  APPROVE: 2,
  REJECT: 3,
  CANCEL: 4,
  RETURN: 5,
  DELEGATE: 6,
  APPROVING: 7,
  SKIP: -2,
};

// BPM 候选人策略枚举
const BpmCandidateStrategyEnum = {
  START_USER_SELECT: 35,
  APPROVE_USER_SELECT: 38,
};

const { push } = useRouter();

const statusIconMap: Record<
  string,
  { animation?: string, color: string, icon: string }
> = {
  '-2': { color: '#909398', icon: 'mdi:skip-forward-outline' },
  '-1': { color: '#909398', icon: 'mdi:clock-outline' },
  '0': { color: '#ff943e', icon: 'mdi:loading', animation: 'animate-spin' },
  '1': { color: '#448ef7', icon: 'mdi:loading', animation: 'animate-spin' },
  '2': { color: '#00b32a', icon: 'mdi:check' },
  '3': { color: '#f46b6c', icon: 'mdi:close' },
  '4': { color: '#cccccc', icon: 'mdi:trash-can-outline' },
  '5': { color: '#f46b6c', icon: 'mdi:arrow-left' },
  '6': { color: '#448ef7', icon: 'mdi:clock-outline' },
  '7': { color: '#00b32a', icon: 'mdi:check' },
};
const nodeTypeSvgMap = {
  [BpmNodeTypeEnum.END_EVENT_NODE]: {
    color: '#909398',
    icon: 'mdi:power',
  },
  [BpmNodeTypeEnum.START_USER_NODE]: {
    color: '#909398',
    icon: 'mdi:account-outline',
  },
  [BpmNodeTypeEnum.USER_TASK_NODE]: {
    color: '#ff943e',
    icon: 'tdesign:seal',
  },
  [BpmNodeTypeEnum.TRANSACTOR_NODE]: {
    color: '#ff943e',
    icon: 'mdi:file-edit-outline',
  },
  [BpmNodeTypeEnum.COPY_TASK_NODE]: {
    color: '#3296fb',
    icon: 'mdi:content-copy',
  },
  [BpmNodeTypeEnum.CONDITION_NODE]: {
    color: '#14bb83',
    icon: 'carbon:flow',
  },
  [BpmNodeTypeEnum.PARALLEL_BRANCH_NODE]: {
    color: '#14bb83',
    icon: 'si:flow-parallel-line',
  },
  [BpmNodeTypeEnum.CHILD_PROCESS_NODE]: {
    color: '#14bb83',
    icon: 'icon-park-outline:tree-diagram',
  },
} as Record<number, { color: string, icon: string }>;
const onlyStatusIconShow = [-1, 0, 1];

/** 获取审批节点类型图标 */
function getApprovalNodeTypeIcon(nodeType: number) {
  return nodeTypeSvgMap[nodeType]?.icon;
}

/** 获取审批节点图标 */
function getApprovalNodeIcon(taskStatus: number, nodeType: number) {
  if (taskStatus === BpmTaskStatusEnum.NOT_START) {
    return statusIconMap[taskStatus]?.icon || 'mdi:clock-outline';
  }
  if (
    [
      BpmNodeTypeEnum.CHILD_PROCESS_NODE,
      BpmNodeTypeEnum.END_EVENT_NODE,
      BpmNodeTypeEnum.START_USER_NODE,
      BpmNodeTypeEnum.TRANSACTOR_NODE,
      BpmNodeTypeEnum.USER_TASK_NODE,
    ].includes(nodeType)
  ) {
    return statusIconMap[taskStatus]?.icon || 'mdi:clock-outline';
  }
  return 'mdi:clock-outline';
}

/** 获取审批节点颜色 */
function getApprovalNodeColor(taskStatus: number) {
  return statusIconMap[taskStatus]?.color;
}

/** 获取审批节点时间 */
function getApprovalNodeTime(node: BpmProcessInstanceApi.ApprovalNodeInfo) {
  if (node.nodeType === BpmNodeTypeEnum.START_USER_NODE && node.startTime) {
    return formatToDateTime(node.startTime);
  }
  if (node.endTime) {
    return formatToDateTime(node.endTime);
  }
  if (node.startTime) {
    return formatToDateTime(node.startTime);
  }
  return '';
}

// TODO: UserSelectModal 组件在当前项目中可能不存在，需要自行实现或注释掉
const [registerUserSelectModal, userSelectModalMethods] = useModal();
const selectedActivityNodeId = ref<string>();
const customApproveUsers = ref<Record<string, any[]>>({});

/** 打开选择用户弹窗 */
const handleSelectUser = (activityId: string, selectedList: any[]) => {
  selectedActivityNodeId.value = activityId;
  // TODO: 需要实现用户选择弹窗
  // userSelectModalMethods.setModalProps({ userIds: selectedList.map((item) => item.id) });
  userSelectModalMethods.openModal(true, { userIds: selectedList.map((item) => item.id) });
};

/** 选择用户完成 */
const selectedUsers = ref<number[]>([]);
function handleUserSelectConfirm(userList: any[]) {
  if (!selectedActivityNodeId.value) {
    return;
  }
  customApproveUsers.value[selectedActivityNodeId.value] = userList || [];

  emit('selectUserConfirm', selectedActivityNodeId.value, userList);
}

/** 跳转子流程 */
function handleChildProcess(activity: any) {
  if (!activity.processInstanceId) {
    return;
  }
  push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: activity.processInstanceId,
    },
  });
}

/** 判断是否需要显示自定义选择审批人 */
function shouldShowCustomUserSelect(
  activity: BpmProcessInstanceApi.ApprovalNodeInfo,
) {
  return (
    isEmpty(activity.tasks)
    && ((BpmCandidateStrategyEnum.START_USER_SELECT
    === activity.candidateStrategy
    && isEmpty(activity.candidateUsers))
    || (props.enableApproveUserSelect
    && BpmCandidateStrategyEnum.APPROVE_USER_SELECT
    === activity.candidateStrategy))
  );
}

/** 判断是否需要显示审批意见 */
function shouldShowApprovalReason(task: any, nodeType: number) {
  return (
    task.reason
    && [BpmNodeTypeEnum.END_EVENT_NODE, BpmNodeTypeEnum.USER_TASK_NODE].includes(
      nodeType,
    )
  );
}

/** 用户选择弹窗关闭 */
function _handleUserSelectClosed() {
  selectedUsers.value = [];
}

/** 用户选择弹窗取消 */
function handleUserSelectCancel() {
  selectedUsers.value = [];
}

/** 设置自定义审批人 */
const setCustomApproveUsers = (activityId: string, users: any[]) => {
  customApproveUsers.value[activityId] = users || [];
};

/** 批量设置多个节点的自定义审批人 */
const batchSetCustomApproveUsers = (data: Record<string, any[]>) => {
  Object.keys(data).forEach((activityId) => {
    customApproveUsers.value[activityId] = data[activityId] || [];
  });
};

defineExpose({ setCustomApproveUsers, batchSetCustomApproveUsers });
</script>

<template>
  <div>
    <Timeline class="pt-5">
      <!-- 遍历每个审批节点 -->
      <Timeline.Item
        v-for="(activity, index) in activityNodes"
        :key="index"
        :color="getApprovalNodeColor(activity.status)"
      >
        <template #dot>
          <div class="relative">
            <div
              class="position-absolute left--2.5 top--1.5 h-8 w-8 flex items-center justify-center border border-gray-200 rounded-full border-solid bg-blue-500 p-1.5"
            >
              <Icon
                :icon="getApprovalNodeTypeIcon(activity.nodeType)"
                class="size-6 text-white"
              />
            </div>
            <div
              v-if="showStatusIcon"
              class="size-4 absolute left-4 top-4 flex items-center border-2 border-white rounded-full border-solid p-0.5"
              :style="{
                backgroundColor: getApprovalNodeColor(activity.status),
              }"
            >
              <Icon
                :icon="getApprovalNodeIcon(activity.status, activity.nodeType)"
                class="text-white"
                :class="[statusIconMap[activity.status]?.animation]"
              />
            </div>
          </div>
        </template>

        <div
          :id="`activity-task-${activity.id}-${index}`"
          class="ml-2 flex flex-col items-start gap-2"
        >
          <!-- 第一行：节点名称、时间 -->
          <div class="w-full flex">
            <div class="font-bold">
              {{ activity.name }}
              <span v-if="activity.status === BpmTaskStatusEnum.SKIP">
                【跳过】
              </span>
            </div>
            <!-- 信息：时间 -->
            <div
              v-if="activity.status !== BpmTaskStatusEnum.NOT_START"
              class="ml-auto mt-1 text-sm text-gray-500"
            >
              {{ getApprovalNodeTime(activity) }}
            </div>
          </div>

          <!-- 子流程节点 -->
          <div v-if="activity.nodeType === BpmNodeTypeEnum.CHILD_PROCESS_NODE">
            <Button
              type="primary"
              ghost
              size="small"
              :disabled="!activity.processInstanceId"
              @click="handleChildProcess(activity)"
            >
              查看子流程
            </Button>
          </div>

          <!-- 需要自定义选择审批人 -->
          <div
            v-if="shouldShowCustomUserSelect(activity)"
            class="flex flex-wrap items-center gap-2"
          >
            <Tooltip title="添加用户" placement="left">
              <Button
                type="primary"
                size="middle"
                ghost
                class="flex items-center justify-center"
                @click="
                  handleSelectUser(
                    activity.id,
                    customApproveUsers[activity.id] ?? [],
                  )
                "
              >
                <template #icon>
                  <Icon icon="lucide:user-plus" class="size-4" />
                </template>
              </Button>
            </Tooltip>

            <div
              v-for="(user, userIndex) in customApproveUsers[activity.id]"
              :key="user.id || userIndex"
              class="relative h-9 flex items-center gap-2 rounded-3xl bg-gray-100 pr-2 dark:bg-gray-600"
            >
              <Avatar
                v-if="user.avatar"
                class="!m-1"
                :size="28"
                :src="user.avatar"
              />

              <Avatar v-else class="!m-1" :size="28">
                <span>{{ user.nickname.substring(0, 1) }}</span>
              </Avatar>
              <span class="text-sm">{{ user.nickname }}</span>
            </div>
          </div>

          <div v-else class="mt-1 flex flex-wrap items-center gap-2">
            <!-- 情况一：遍历每个审批节点下的【进行中】task 任务 -->
            <div
              v-for="(task, idx) in activity.tasks"
              :key="idx"
              class="flex flex-col gap-2 pr-2"
            >
              <div
                v-if="task.assigneeUser || task.ownerUser"
                class="relative flex flex-wrap gap-2"
              >
                <!-- 信息：头像昵称 -->
                <div class="relative h-8 flex items-center rounded-3xl pr-2">
                  <template
                    v-if="
                      task.assigneeUser?.avatar || task.assigneeUser?.nickname
                    "
                  >
                    <Avatar
                      v-if="task.assigneeUser?.avatar"
                      class="!m-1"
                      :size="28"
                      :src="task.assigneeUser?.avatar"
                    />
                    <Avatar v-else class="!m-1" :size="28">
                      {{ task.assigneeUser?.nickname.substring(0, 1) }}
                    </Avatar>
                    {{ task.assigneeUser?.nickname }}
                  </template>
                  <template
                    v-else-if="
                      task.ownerUser?.avatar || task.ownerUser?.nickname
                    "
                  >
                    <Avatar
                      v-if="task.ownerUser?.avatar"
                      class="!m-1"
                      :size="28"
                      :src="task.ownerUser?.avatar"
                    />
                    <Avatar v-else class="!m-1" :size="28">
                      {{ task.ownerUser?.nickname.substring(0, 1) }}
                    </Avatar>
                    {{ task.ownerUser?.nickname }}
                  </template>

                  <!-- 信息：任务状态图标 -->
                  <div
                    v-if="
                      showStatusIcon && onlyStatusIconShow.includes(task.status)
                    "
                    class="absolute left-5 top-5 flex items-center border-2 border-white rounded-full border-solid p-1"
                    :style="{
                      backgroundColor: statusIconMap[task.status]?.color,
                    }"
                  >
                    <Icon
                      :icon="statusIconMap[task.status]?.icon || 'lucide:clock'"
                      class="size-1.5 text-white"
                      :class="[statusIconMap[task.status]?.animation]"
                    />
                  </div>
                </div>
              </div>

              <!-- 审批意见和签名 -->
              <teleport defer :to="`#activity-task-${activity.id}-${index}`">
                <div
                  v-if="shouldShowApprovalReason(task, activity.nodeType)"
                  class="mt-1 w-full rounded-md bg-gray-100 p-2 text-sm text-gray-500"
                >
                  审批意见：{{ task.reason }}
                </div>
                <div
                  v-if="
                    task.signPicUrl
                      && activity.nodeType === BpmNodeTypeEnum.USER_TASK_NODE
                  "
                  class="mt-1 w-full rounded-md bg-gray-100 p-2 text-sm text-gray-500"
                >
                  签名：
                  <Image
                    class="ml-1 h-10 w-24"
                    :src="task.signPicUrl"
                    :preview="{ src: task.signPicUrl }"
                  />
                </div>
              </teleport>
            </div>

            <!-- 情况二：遍历每个审批节点下的【候选的】task 任务 -->
            <div
              v-for="(user, userIndex) in activity.candidateUsers"
              :key="userIndex"
              class="relative h-8 flex items-center rounded-3xl pr-2"
            >
              <Avatar
                v-if="user.avatar"
                class="!m-1"
                :size="28"
                :src="user.avatar"
              />
              <Avatar v-else class="!m-1" :size="28">
                {{ user.nickname.substring(0, 1) }}
              </Avatar>
              <span class="text-sm">
                {{ user.nickname }}
              </span>

              <!-- 候选任务状态图标 -->
              <div
                v-if="showStatusIcon"
                class="absolute left-6 top-5 flex items-center border-2 border-white rounded-full border-solid p-1"
                :style="{ backgroundColor: statusIconMap['-1']?.color }"
              >
                <Icon
                  class="text-xs text-white"
                  :icon="statusIconMap['-1']?.icon || 'lucide:clock'"
                />
              </div>
            </div>
          </div>
        </div>
      </Timeline.Item>
    </Timeline>

    <!-- 用户选择弹窗 TODO: 需要实现 UserSelectModal 组件 -->
    <BasicModal
      title="选择用户"
      width="60%"
      @register="registerUserSelectModal"
      @ok="handleUserSelectConfirm"
      @cancel="handleUserSelectCancel"
    >
      <!-- TODO: 用户选择列表组件 -->
      <div>用户选择列表（待实现）</div>
    </BasicModal>
  </div>
</template>
