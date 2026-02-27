<!-- 延迟定时器节点 -->
<script setup lang="ts">
import { inject, ref } from 'vue';

import { Input } from 'ant-design-vue';
import type { SimpleFlowNode } from '../../consts';

import { NODE_DEFAULT_TEXT } from '../../consts';
import { useNodeName2, useTaskStatusClass, useWatchNode } from '../../helpers';
import DelayTimerNodeConfig from '../nodes-config/delay-timer-node-config.vue';
import NodeHandler from './node-handler.vue';
import { BpmNodeTypeEnum } from '@/enums';
import { Icon } from '@/components/Icon';

defineOptions({ name: 'DelayTimerNode' });
const props = defineProps({
  flowNode: {
    type: Object as () => SimpleFlowNode,
    required: true,
  },
});
// 定义事件，更新父组件。
const emits = defineEmits<{
  'update:flowNode': [node: SimpleFlowNode | undefined]
}>();
// 是否只读
const readonly = inject<boolean>('readonly');
// 监控节点的变化
const currentNode = useWatchNode(props);
// 节点名称编辑
const { showInput, changeNodeName, clickTitle, inputRef } = useNodeName2(
  currentNode,
  BpmNodeTypeEnum.DELAY_TIMER_NODE,
);

const nodeSetting = ref();
// 打开节点配置
function openNodeConfig() {
  if (readonly) {
    return;
  }
  nodeSetting.value.openDrawer(currentNode.value);
}

// 删除节点。更新当前节点为孩子节点
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
          <div class="node-title-icon delay-node">
            <span class="iconfont icon-delay" />
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
            {{ NODE_DEFAULT_TEXT.get(BpmNodeTypeEnum.DELAY_TIMER_NODE) }}
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

      <!-- 传递子节点给添加节点组件。会在子节点前面添加节点 -->
      <NodeHandler
        v-if="currentNode"
        v-model:child-node="currentNode.childNode"
        :current-node="currentNode"
      />
    </div>
    <DelayTimerNodeConfig
      v-if="!readonly && currentNode"
      ref="nodeSetting"
      :flow-node="currentNode"
    />
  </div>
</template>
