<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

import { cloneDeep } from 'lodash-es';

import { Input } from 'ant-design-vue';
import type { SimpleFlowNode } from '../../consts';

import { ConditionType } from '../../consts';
import {
  getConditionShowText,
  getDefaultConditionNodeName,
  useFormFieldsAndStartUser,
} from '../../helpers';
import Condition from './modules/condition.vue';
import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
import { Icon } from '@/components/Icon';

defineOptions({
  name: 'ConditionNodeConfig',
});

const props = defineProps({
  conditionNode: {
    type: Object as () => SimpleFlowNode,
    required: true,
  },
  nodeIndex: {
    type: Number,
    required: true,
  },
});

const currentNode = ref<SimpleFlowNode>(props.conditionNode);
const condition = ref<any>({
  conditionType: ConditionType.RULE, // 设置默认值
  conditionExpression: '',
  conditionGroups: {
    and: true,
    conditions: [
      {
        and: true,
        rules: [
          {
            opCode: '==',
            leftSide: '',
            rightSide: '',
          },
        ],
      },
    ],
  },
});

const conditionRef = ref();
const fieldOptions = useFormFieldsAndStartUser(); // 流程表单字段和发起人字段

const [registerDrawer, { closeDrawer, setDrawerProps }] = useDrawerInner(() => {
  // 在打开时不做任何操作，由 open 方法处理
});

/** 保存配置 */
async function saveConfig() {
  if (!currentNode.value.conditionSetting?.defaultFlow) {
    // 校验表单
    const valid = await conditionRef.value.validate();
    if (!valid) {
      return false;
    }
    const showText = getConditionShowText(
      condition.value?.conditionType,
      condition.value?.conditionExpression,
      condition.value.conditionGroups,
      fieldOptions,
    );
    if (!showText) {
      return false;
    }
    currentNode.value.showText = showText;
    // 使用 cloneDeep 进行深拷贝
    currentNode.value.conditionSetting = cloneDeep({
      ...currentNode.value.conditionSetting,
      conditionType: condition.value?.conditionType,
      conditionExpression:
        condition.value?.conditionType === ConditionType.EXPRESSION
          ? condition.value?.conditionExpression
          : undefined,
      conditionGroups:
        condition.value?.conditionType === ConditionType.RULE
          ? condition.value?.conditionGroups
          : undefined,
    });
  }
  closeDrawer();
  return true;
}

function openDrawer() {
  setDrawerProps({ title: currentNode.value.name, open: true });
}

function open() {
  // 使用三元表达式代替 if-else，解决 linter 警告
  condition.value = currentNode.value.conditionSetting
    ? cloneDeep(currentNode.value.conditionSetting)
    : {
        conditionType: ConditionType.RULE,
        conditionExpression: '',
        conditionGroups: {
          and: true,
          conditions: [
            {
              and: true,
              rules: [
                {
                  opCode: '==',
                  leftSide: '',
                  rightSide: '',
                },
              ],
            },
          ],
        },
      };

  openDrawer();
}

watch(
  () => props.conditionNode,
  (newValue) => {
    currentNode.value = newValue;
  },
);
// 显示名称输入框
const showInput = ref(false);
// 输入框的引用
const inputRef = ref<HTMLInputElement | null>(null);
// 监听 showInput 的变化，当变为 true 时自动聚焦
watch(showInput, (value) => {
  if (value) {
    nextTick(() => {
      inputRef.value?.focus();
    });
  }
});
function clickIcon() {
  showInput.value = true;
}

// 修改节点名称
function changeNodeName() {
  showInput.value = false;
  currentNode.value.name
    = currentNode.value.name
    || getDefaultConditionNodeName(
      props.nodeIndex,
      currentNode.value?.conditionSetting?.defaultFlow,
    );
}

defineExpose({ open, registerDrawer }); // 提供 open 方法，用于打开弹窗
</script>

<template>
  <BasicDrawer width="33%" :show-footer="true" @register="registerDrawer" @ok="saveConfig">
    <template #title>
      <div class="flex items-center">
        <Input
          v-if="showInput"
          ref="inputRef"
          v-model:value="currentNode.name"
          type="text"
          class="mr-2 w-48"
          :placeholder="currentNode.name"
          @blur="changeNodeName()"
          @press-enter="changeNodeName()"
        />
        <div
          v-else
          class="flex cursor-pointer items-center"
          @click="clickIcon()"
        >
          {{ currentNode.name }}
          <Icon class="ml-1" icon="ant-design:edit-outlined" />
        </div>
      </div>
    </template>

    <div>
      <div
        v-if="currentNode.conditionSetting?.defaultFlow"
        class="mb-3 text-base"
      >
        未满足其它条件时，将进入此分支（该分支不可编辑和删除）
      </div>
      <div v-else>
        <Condition ref="conditionRef" v-model:model-value="condition" />
      </div>
    </div>
  </BasicDrawer>
</template>
