<script setup lang="ts">
import type { Ref } from 'vue';

import { inject, ref } from 'vue';
import type { SimpleFlowNode } from '../../consts';

import { useTaskStatusClass, useWatchNode } from '../../helpers';
import ProcessInstanceModal from './modules/process-instance-modal.vue';
import { BasicModal, useModal } from '@/components/Modal';

defineOptions({ name: 'EndEventNode' });
const props = defineProps({
  flowNode: {
    type: Object as () => SimpleFlowNode,
    default: () => null,
  },
});
// 监控节点变化
const currentNode = useWatchNode(props);
// 是否只读
const readonly = inject<boolean>('readonly');
const processInstance = inject<Ref<any>>('processInstance', ref({}));

const [registerModal, { openModal }] = useModal();

function nodeClick() {
  if (readonly && processInstance && processInstance.value) {
    const processInstanceInfo = [
      {
        startUser: processInstance.value.startUser,
        createTime: processInstance.value.startTime,
        endTime: processInstance.value.endTime,
        status: processInstance.value.status,
        durationInMillis: processInstance.value.durationInMillis,
      },
    ];
    openModal(true, processInstanceInfo);
  }
}
</script>

<template>
  <div class="end-node-wrapper">
    <div
      class="end-node-box cursor-pointer"
      :class="`${useTaskStatusClass(currentNode?.activityStatus)}`"
      @click="nodeClick"
    >
      <span class="node-fixed-name" title="结束">结束</span>
    </div>
  </div>
  <!-- 流程信息弹窗 -->
  <ProcessInstanceModal title="流程信息" @register="registerModal" />
</template>
