<script setup lang="ts">
import { inject, ref } from 'vue';

import { Input } from 'ant-design-vue';
import type { SimpleFlowNode } from '../../consts';

import { NODE_DEFAULT_TEXT } from '../../consts';
import { useNodeName2, useTaskStatusClass, useWatchNode } from '../../helpers';
import ChildProcessNodeConfig from '../nodes-config/child-process-node-config.vue';
import NodeHandler from './node-handler.vue';
import { BpmNodeTypeEnum } from '@/enums';
import { Icon } from '@/components/Icon';

defineOptions({ name: 'ChildProcessNode' });

const props = defineProps<{
  flowNode: SimpleFlowNode
}>();

/** 定义事件，更新父组件。 */
const emits = defineEmits<{
  'update:flowNode': [node: SimpleFlowNode | undefined]
}>();

// 是否只读
const readonly = inject<boolean>('readonly');

/** 监控节点的变化 */
const currentNode = useWatchNode(props);

/** 节点名称编辑 */
const { showInput, changeNodeName, clickTitle, inputRef } = useNodeName2(
  currentNode,
  BpmNodeTypeEnum.CHILD_PROCESS_NODE,
);

// 节点配置 Ref
const nodeConfigRef = ref();

/** 打开节点配置 */
function openNodeConfig() {
  if (readonly) {
    return;
  }
  nodeConfigRef.value.showChildProcessNodeConfig(currentNode.value);
}

/** 删除节点。更新当前节点为孩子节点 */
function deleteNode() {
  emits('update:flowNode', currentNode.value.childNode);
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
            :class="`node-title-icon ${currentNode.childProcessSetting?.async === true ? 'async-child-process' : 'child-process'}`"
          >
            <span
              :class="`iconfont ${currentNode.childProcessSetting?.async === true ? 'icon-async-child-process' : 'icon-child-process'}`"
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
        <div class="node-content" @click="openNodeConfig">
          <div
            v-if="currentNode.showText"
            class="node-text"
            :title="currentNode.showText"
          >
            {{ currentNode.showText }}
          </div>
          <div v-else class="node-text">
            {{ NODE_DEFAULT_TEXT.get(BpmNodeTypeEnum.CHILD_PROCESS_NODE) }}
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
    <ChildProcessNodeConfig
      v-if="!readonly && currentNode"
      ref="nodeConfigRef"
      :flow-node="currentNode"
    />
  </div>
</template>
