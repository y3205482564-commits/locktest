<script setup lang="ts">
import { ref } from 'vue';

import { cloneDeep } from 'lodash-es';

import { message } from 'ant-design-vue';
import type { ConditionGroup } from '../../../consts';

import { ConditionType, DEFAULT_CONDITION_GROUP_VALUE } from '../../../consts';
import Condition from './condition.vue';
import { BasicModal, useModalInner } from '@/components/Modal';

defineOptions({ name: 'ConditionDialog' });

const emit = defineEmits<{
  updateCondition: [condition: object]
}>();

const conditionData = ref<{
  conditionExpression?: string
  conditionGroups?: ConditionGroup
  conditionType: ConditionType
}>({
  conditionType: ConditionType.RULE,
  conditionGroups: cloneDeep(DEFAULT_CONDITION_GROUP_VALUE),
});

// 条件组件的引用
const conditionRef = ref();

const [registerModal, { closeModal }] = useModalInner((data: any) => {
  if (data) {
    conditionData.value.conditionType = data.conditionType;
    conditionData.value.conditionExpression = data.conditionExpression;
    conditionData.value.conditionGroups = data.conditionGroups;
  }
});

/** 确认保存条件 */
async function handleConfirm() {
  // 校验表单
  if (!conditionRef.value) {
    return;
  }
  const valid = await conditionRef.value.validate().catch(() => false);
  if (!valid) {
    message.warning('请完善条件规则');
    return;
  }
  // 设置完的条件传递给父组件
  emit('updateCondition', conditionData.value);
  closeModal();
}

/**
 * 打开条件配置弹窗，不暴露 modalApi 给父组件
 */
function openModal(conditionObj: any) {
  if (conditionObj) {
    conditionData.value.conditionType = conditionObj.conditionType;
    conditionData.value.conditionExpression = conditionObj.conditionExpression;
    conditionData.value.conditionGroups = conditionObj.conditionGroups;
  }
}

// 暴露方法给父组件
defineExpose({ openModal });
</script>

<template>
  <BasicModal title="条件配置" width="50%" @register="registerModal" @ok="handleConfirm">
    <Condition ref="conditionRef" v-model="conditionData" />
  </BasicModal>
</template>
