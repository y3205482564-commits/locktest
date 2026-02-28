<script setup lang="ts">
import type { Ref } from 'vue';

import { inject, ref } from 'vue';

import { Input } from 'ant-design-vue';
import type { SimpleFlowNode } from '../../consts';

import { NODE_DEFAULT_TEXT } from '../../consts';
import { useNodeName2, useTaskStatusClass, useWatchNode } from '../../helpers';
import UserTaskNodeConfig from '../nodes-config/user-task-node-config.vue';
import TaskListModal from './modules/task-list-modal.vue';
import NodeHandler from './node-handler.vue';
import { BpmNodeTypeEnum } from '@/enums';
import { BasicModal, useModal } from '@/components/Modal';
import { Icon } from '@/components/Icon';

defineOptions({ name: 'UserTaskNode' });

const props = defineProps({
  flowNode: {
    type: Object as () => SimpleFlowNode,
    required: true,
  },
});

const emits = defineEmits<{
  "findParentNode": [nodeList: SimpleFlowNode[], nodeType: BpmNodeTypeEnum]
  'update:flowNode': [node: SimpleFlowNode | undefined]
}>();

// 是否只读
const readonly = inject<boolean>('readonly');
const tasks = inject<Ref<any[]>>('tasks', ref([]));
// 监控节点变化
const currentNode = useWatchNode(props);
// 节点名称编辑
const { showInput, changeNodeName, clickTitle, inputRef } = useNodeName2(
  currentNode,
  BpmNodeTypeEnum.USER_TASK_NODE,
);
const nodeSetting = ref();

const [registerModal, { openModal: openTaskModal, closeModal: closeTaskModal, setModalProps }] = useModal();

function nodeClick() {
  if (readonly) {
    if (tasks && tasks.value) {
      // 过滤出当前节点的任务
      const nodeTasks = tasks.value.filter(
        (task: any) => task.taskDefinitionKey === currentNode.value.id,
      );
      // 弹窗显示任务信息
      openTaskModal(true, nodeTasks);
      setModalProps({ title: currentNode.value.name });
    }
  } else {
    // 编辑模式，打开节点配置、把当前节点传递给配置组件
    nodeSetting.value.showUserTaskNodeConfig(currentNode.value);
  }
}

function deleteNode() {
  emits('update:flowNode', currentNode.value.childNode);
}
// 查找可以驳回用户节点
function findReturnTaskNodes(
  matchNodeList: SimpleFlowNode[], // 匹配的节点
) {
  // 从父节点查找
  emits('findParentNode', matchNodeList, BpmNodeTypeEnum.USER_TASK_NODE);
}
</script>

<template>
  <div class="node-wrapper">
    <div class="node-container">
      <div
        class="node-box"
        :class="[
          { 'node-config-error': !currentNode.showText },
          `${useTaskStatusClass(currentNode?.activityStatus)}`,
        ]"
      >
        <div class="node-title-container">
          <div
            :class="`node-title-icon ${currentNode.type === BpmNodeTypeEnum.TRANSACTOR_NODE ? 'transactor-task' : 'user-task'}`"
          >
            <span
              :class="`iconfont ${currentNode.type === BpmNodeTypeEnum.TRANSACTOR_NODE ? 'icon-transactor' : 'icon-approve'}`"
            />
          </div>
          <Input
            v-if="!readonly && showInput"
            ref="inputRef"
            v-model:value="currentNode.name"
            type="text"
            class="editable-title-input"
            :placeholder="currentNode.name"
            @blur="changeNodeName()"
            @press-enter="changeNodeName()"
          />
          <div v-else class="node-title" @click="clickTitle">
            {{ currentNode.name }}
          </div>
        </div>
        <div class="node-content" @click="nodeClick">
          <div
            v-if="currentNode.showText"
            class="node-text"
            :title="currentNode.showText"
          >
            {{ currentNode.showText }}
          </div>
          <div v-else class="node-text">
            {{ NODE_DEFAULT_TEXT.get(currentNode.type) }}
          </div>
          <Icon v-if="!readonly" icon="ant-design:right-outlined" />
        </div>
        <div v-if="!readonly" class="node-toolbar">
          <div class="toolbar-icon">
            <Icon
              color="#0089ff"
              icon="ant-design:close-circle-outlined"
              :size="18"
              @click="deleteNode"
            />
          </div>
        </div>
      </div>
      <!-- 添加节点组件。会在子节点前面添加节点 -->
      <NodeHandler
        v-if="currentNode"
        v-model:child-node="currentNode.childNode"
        :current-node="currentNode"
      />
    </div>
  </div>
  <UserTaskNodeConfig
    v-if="currentNode"
    ref="nodeSetting"
    :flow-node="currentNode"
    @find-return-task-nodes="findReturnTaskNodes"
  />
  <!--  审批记录弹窗 -->
  <TaskListModal @register="registerModal" />
</template>
