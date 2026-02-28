<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  Avatar, Button, Image, Timeline, Tooltip,
  Checkbox, List, Divider, Space
} from 'ant-design-vue';

import type { BpmProcessInstanceApi } from '@/api/bpm/processInstance';

import { Icon } from '@/components/Icon';
import { BasicModal, useModal } from '@/components/Modal';
import { formatToDateTime } from '@/utils/dateUtil';
import { isEmpty } from '@/utils/is';
// import {UserSelectModal} from "@/components/select-modal";

defineOptions({ name: 'BpmProcessInstanceTimeline' });

// Props 定义（修正类型语法）
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

// Emits 定义（修正类型语法）
const emit = defineEmits<{
  (e: 'selectUserConfirm', activityId: string, userList: any[]): void
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
  APPROVE_USER_SELECT: 34,
};

const router = useRouter();

// 状态图标映射
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

// 节点类型图标映射
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
  return nodeTypeSvgMap[nodeType]?.icon || 'mdi:clock-outline';
}

/** 获取审批节点图标 */
function getApprovalNodeIcon(taskStatus: number, nodeType: number) {
  if (taskStatus === BpmTaskStatusEnum.NOT_START) {
    return statusIconMap[String(taskStatus)]?.icon || 'mdi:clock-outline';
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
    return statusIconMap[String(taskStatus)]?.icon || 'mdi:clock-outline';
  }
  return 'mdi:clock-outline';
}

/** 获取审批节点颜色 */
function getApprovalNodeColor(taskStatus: number) {
  return statusIconMap[String(taskStatus)]?.color || '#909398';
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

// 弹窗相关
const [registerUserSelectModal, userSelectModalMethods] = useModal();
const selectedActivityNodeId = ref<string>('');
const customApproveUsers = ref<Record<string, any[]>>({});

// 静态用户数据（模拟后端返回）
const userList = ref([
  { id: 1, nickname: '张三', avatar: '', deptName: '技术部' },
  { id: 2, nickname: '李四', avatar: '', deptName: '产品部' },
  { id: 3, nickname: '王五', avatar: '', deptName: '财务部' },
  { id: 4, nickname: '赵六', avatar: '', deptName: '人事部' },
  { id: 5, nickname: '钱七', avatar: '', deptName: '市场部' },
  { id: 150, nickname: '检修班班长01', avatar: '', deptName: '市场部' },
  { id: 152, nickname: '检修方人员01', avatar: '', deptName: '市场部' },
]);

// 选中的用户ID数组
const selectedUserIds = ref<number[]>([]);

/** 打开选择用户弹窗 */
const handleSelectUser = (activityId: string, selectedList: any[]) => {
  selectedActivityNodeId.value = activityId;
  // 初始化已选用户ID
  selectedUserIds.value = selectedList.map(item => item.id);
  // 打开弹窗
  userSelectModalMethods.openModal(true);
};

/** 选择用户完成 */
function handleUserSelectConfirm() {
  if (!selectedActivityNodeId.value) return;

  // 筛选出选中的用户详情
  const selectedUsers = userList.value.filter(user =>
    selectedUserIds.value.includes(user.id)
  );

  // 保存到当前组件
  customApproveUsers.value[selectedActivityNodeId.value] = selectedUsers;
  // 传递给父组件（用于 nextAssignees）
  emit('selectUserConfirm', selectedActivityNodeId.value, selectedUsers);

  // 关闭弹窗并清空选中状态
  userSelectModalMethods.closeModal();
  selectedUserIds.value = [];
}

/** 跳转子流程 */
function handleChildProcess(activity: any) {
  if (!activity.processInstanceId) return;
  router.push({
    name: 'BpmProcessInstanceDetail',
    query: { id: activity.processInstanceId },
  });
}


/** 判断是否需要显示自定义选择审批人 */
function shouldShowCustomUserSelect(activity: BpmProcessInstanceApi.ApprovalNodeInfo) {
  return (
    isEmpty(activity.tasks)
    && ((BpmCandidateStrategyEnum.START_USER_SELECT === activity.candidateStrategy && isEmpty(activity.candidateUsers))
      || (props.enableApproveUserSelect && BpmCandidateStrategyEnum.APPROVE_USER_SELECT === activity.candidateStrategy))
  );
}



/** 判断是否需要显示审批意见 */
function shouldShowApprovalReason(task: any, nodeType: number) {
  return (
    task.reason
    && [BpmNodeTypeEnum.END_EVENT_NODE, BpmNodeTypeEnum.USER_TASK_NODE].includes(nodeType)
  );
}

/** 弹窗取消/关闭 */
function handleUserSelectCancel() {
  selectedUserIds.value = [];
  userSelectModalMethods.closeModal();
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
      <Timeline.Item
        v-for="(activity, index) in activityNodes"
        :key="`activity-${activity.id}-${index}`"
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
              :style="{ backgroundColor: getApprovalNodeColor(activity.status) }"
            >
              <Icon
                :icon="getApprovalNodeIcon(activity.status, activity.nodeType)"
                class="text-white"
                :class="[statusIconMap[String(activity.status)]?.animation]"
              />
            </div>
          </div>
        </template>

        <div
          :id="`activity-task-${activity.id}-${index}`"
          class="ml-2 flex flex-col items-start gap-2"
        >
          <!-- 节点名称 + 时间 -->
          <div class="w-full flex">
            <div class="font-bold">
              {{ activity.name }}
              <span v-if="activity.status === BpmTaskStatusEnum.SKIP">【跳过】</span>
            </div>
            <div
              v-if="activity.status !== BpmTaskStatusEnum.NOT_START"
              class="ml-auto mt-1 text-sm text-gray-500"
            >
              {{ getApprovalNodeTime(activity) }}
            </div>
          </div>

          <!-- 子流程按钮 -->
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

          <!-- 自定义选择审批人 -->
          <div
            v-if="shouldShowCustomUserSelect(activity)"
            class="flex flex-wrap items-center gap-2"
          >
            <Tooltip title="添加用户" placement="left">
              <Button
                type="primary"
                size="middle"
                ghost
                @click="handleSelectUser(activity.id, customApproveUsers[activity.id] ?? [])"
              >
                <Icon icon="lucide:user-plus" class="size-4 mr-1" />
                选择审批人
              </Button>
            </Tooltip>

            <!-- 已选用户展示 -->
            <div
              v-for="(user, userIndex) in customApproveUsers[activity.id]"
              :key="`user-${user.id || userIndex}`"
              class="relative h-9 flex items-center gap-2 rounded-3xl bg-gray-100 pr-2 dark:bg-gray-600"
            >
              <Avatar v-if="user.avatar" class="!m-1" :size="28" :src="user.avatar" />
              <Avatar v-else class="!m-1" :size="28">
                <span>{{ user.nickname.substring(0, 1) }}</span>
              </Avatar>
              <span class="text-sm">{{ user.nickname }}</span>
            </div>
          </div>

          <!-- 已有的任务/候选用户 -->
          <div v-else class="mt-1 flex flex-wrap items-center gap-2">
            <!-- 进行中任务 -->
            <div
              v-for="(task, idx) in activity.tasks"
              :key="`task-${task.id || idx}`"
              class="flex flex-col gap-2 pr-2"
            >
              <div v-if="task.assigneeUser || task.ownerUser" class="relative flex flex-wrap gap-2">
                <div class="relative h-8 flex items-center rounded-3xl pr-2">
                  <template v-if="task.assigneeUser?.avatar || task.assigneeUser?.nickname">
                    <Avatar v-if="task.assigneeUser?.avatar" class="!m-1" :size="28" :src="task.assigneeUser?.avatar" />
                    <Avatar v-else class="!m-1" :size="28">
                      {{ task.assigneeUser?.nickname.substring(0, 1) }}
                    </Avatar>
                    {{ task.assigneeUser?.nickname }}
                  </template>
                  <template v-else-if="task.ownerUser?.avatar || task.ownerUser?.nickname">
                    <Avatar v-if="task.ownerUser?.avatar" class="!m-1" :size="28" :src="task.ownerUser?.avatar" />
                    <Avatar v-else class="!m-1" :size="28">
                      {{ task.ownerUser?.nickname.substring(0, 1) }}
                    </Avatar>
                    {{ task.ownerUser?.nickname }}
                  </template>

                  <!-- 任务状态图标 -->
                  <div
                    v-if="showStatusIcon && onlyStatusIconShow.includes(task.status)"
                    class="absolute left-5 top-5 flex items-center border-2 border-white rounded-full border-solid p-1"
                    :style="{ backgroundColor: statusIconMap[String(task.status)]?.color }"
                  >
                    <Icon
                      :icon="statusIconMap[String(task.status)]?.icon || 'lucide:clock'"
                      class="size-1.5 text-white"
                      :class="[statusIconMap[String(task.status)]?.animation]"
                    />
                  </div>
                </div>
              </div>

              <!-- 审批意见 + 签名 -->
              <teleport :to="`#activity-task-${activity.id}-${index}`">
                <div
                  v-if="shouldShowApprovalReason(task, activity.nodeType)"
                  class="mt-1 w-full rounded-md bg-gray-100 p-2 text-sm text-gray-500"
                >
                  审批意见：{{ task.reason }}
                </div>
                <div
                  v-if="task.signPicUrl && activity.nodeType === BpmNodeTypeEnum.USER_TASK_NODE"
                  class="mt-1 w-full rounded-md bg-gray-100 p-2 text-sm text-gray-500"
                >
                  签名：
                  <Image class="ml-1 h-10 w-24" :src="task.signPicUrl" :preview="{ src: task.signPicUrl }" />
                </div>
              </teleport>
            </div>

            <!-- 候选用户 -->
            <div
              v-for="(user, userIndex) in activity.candidateUsers"
              :key="`candidate-${user.id || userIndex}`"
              class="relative h-8 flex items-center rounded-3xl pr-2"
            >
              <Avatar v-if="user.avatar" class="!m-1" :size="28" :src="user.avatar" />
              <Avatar v-else class="!m-1" :size="28">
                {{ user.nickname.substring(0, 1) }}
              </Avatar>
              <span class="text-sm">{{ user.nickname }}</span>

              <div
                v-if="showStatusIcon"
                class="absolute left-6 top-5 flex items-center border-2 border-white rounded-full border-solid p-1"
                :style="{ backgroundColor: statusIconMap['-1']?.color }"
              >
                <Icon class="text-xs text-white" :icon="statusIconMap['-1']?.icon || 'lucide:clock'" />
              </div>
            </div>
          </div>
        </div>
      </Timeline.Item>
    </Timeline>

    <!-- 用户选择弹窗 -->
    <BasicModal
      title="选择审批人"
      width="60%"
      @register="registerUserSelectModal"
      @ok="handleUserSelectConfirm"
      @cancel="handleUserSelectCancel"
    >
      <div class="p-4">
        <div class="mb-4 text-sm text-gray-500">请选择需要添加的审批人（支持多选）</div>

        <!-- 用户列表 -->
        <List
          :data-source="userList"
          bordered
          class="max-h-[400px] overflow-y-auto"
        >
          <template #renderItem="{ item: user }">
            <List.Item>
              <div class="flex items-center w-full">
                <Checkbox
                  :checked="selectedUserIds.includes(user.id)"
                  @change="(e: { target: { checked: boolean } }) => {
                    if (e.target.checked) {
                      selectedUserIds.push(user.id)
                    } else {
                      const idx = selectedUserIds.indexOf(user.id)
                      if (idx > -1) {
                        selectedUserIds.splice(idx, 1)
                      }
                    }
                  }"
                  class="mr-3"
                />
                <Avatar class="mr-3" :size="32">
                  {{ user.nickname.substring(0, 1) }}
                </Avatar>
                <div class="flex-1">
                  <div class="font-medium">{{ user.nickname }}</div>
                  <div class="text-xs text-gray-500">{{ user.deptName }}</div>
                </div>
              </div>
            </List.Item>
          </template>
        </List>

        <!-- 已选用户预览 -->
        <Divider orientation="left">已选用户</Divider>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="user in userList.filter(u => selectedUserIds.includes(u.id))"
            :key="`selected-${user.id}`"
            class="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600"
          >
            <Avatar :size="20">{{ user.nickname.substring(0, 1) }}</Avatar>
            {{ user.nickname }}
          </div>
          <div v-if="selectedUserIds.length === 0" class="text-sm text-gray-400">
            暂无选中用户
          </div>
        </div>
      </div>
    </BasicModal>



    <!-- 用户选择弹窗 TODO: 需要实现 UserSelectModal 组件 -->
<!--    <BasicModal-->
<!--      title="选择用户"-->
<!--      width="60%"-->
<!--      @register="registerUserSelectModal"-->
<!--      @ok="handleUserSelectConfirm"-->
<!--      @cancel="handleUserSelectCancel"-->
<!--    >-->
<!--      &lt;!&ndash; TODO: 用户选择列表组件 &ndash;&gt;-->
<!--      <div>用户选择列表（待实现）-->



<!--      </div>-->
<!--    </BasicModal>-->


    <!-- 用户选择弹窗 -->
<!--    <UserSelectModal-->
<!--      :multiple="true"-->
<!--      @register="registerUserSelectModal"-->
<!--      @confirm="handleUserSelectConfirm"-->
<!--      @closed="_handleUserSelectClosed"-->
<!--      @cancel="handleUserSelectCancel"-->
<!--    />-->




  </div>
</template>
