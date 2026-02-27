<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Button, Card, Col, Row, Space, Tabs, message } from 'ant-design-vue';

import ProcessInstanceBpmnViewer from '@/views/bpm/processInstance/detail/modules/bpm-viewer.vue';
import ProcessInstanceSimpleViewer from '@/views/bpm/processInstance/detail/modules/simple-bpm-viewer.vue';
import ProcessInstanceTimeline from '@/views/bpm/processInstance/detail/modules/time-line.vue';
import FormCreate from '@form-create/ant-design-vue';

import { Icon } from '@/components/Icon';
import { getProcessDefinition } from '@/api/bpm/definition';
import {
  createProcessInstance,
  getApprovalDetail as getApprovalDetailApi,
} from '@/api/bpm/processInstance';
import { decodeFields, setConfAndFields2 } from '@/components/form-create';
import { useTabs } from '@/hooks/web/useTabs';

// 导入工单详情组件
import WorkOrderDetail from '@/views/bpm/processInstance/detail/modules/work-order-detail.vue';

defineOptions({ name: 'BpmProcessInstanceCreateForm' });

const props = defineProps({
  selectProcessDefinition: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['cancel']);

// BPM 常量定义
const BpmCandidateStrategyEnum = {
  START_USER_SELECT: 35,
  APPROVE_USER_SELECT: 38,
};

const BpmFieldPermissionType = {
  READ: '1',
  WRITE: '2',
  NONE: '3',
};

const BpmModelFormType = {
  NORMAL: 10,
  CUSTOM: 20,
};

const BpmModelType = {
  BPMN: 10,
  SIMPLE: 20,
};

const BpmNodeIdEnum = {
  START_USER_NODE_ID: 'StartUserNode',
};

/** 类型定义 */
interface ProcessFormData {
  rule: any[]
  option: Record<string, any>
  value: Record<string, any>
}

interface UserTask {
  id: number
  name: string
}

const router = useRouter();
const { closeCurrent } = useTabs();

const getTitle = computed(() => {
  return `流程表单 - ${props.selectProcessDefinition.name}`;
});

const detailForm = ref<ProcessFormData>({
  rule: [],
  option: {},
  value: {},
});
const fApi = ref<any>();

const startUserSelectTasks = ref<UserTask[]>([]);
const startUserSelectAssignees = ref<Record<string, string[]>>({});
const tempStartUserSelectAssignees = ref<Record<string, string[]>>({});

const bpmnXML = ref<string | undefined>(undefined);
const simpleJson = ref<string | undefined>(undefined);

const timelineRef = ref<any>();
const activeTab = ref('form'); // 默认激活表单填写标签
const activityNodes = ref<any[]>([]);
const processInstanceStartLoading = ref(false);

// 新增：选中的工单内码
const selectedInternalCode = ref<string>('');

/** 提交按钮 */
async function submitForm() {
  if (!fApi.value || !props.selectProcessDefinition) {
    return;
  }
  // 流程表单校验
  await fApi.value.validate();
  // 校验指定审批人
  if (startUserSelectTasks.value?.length > 0) {
    for (const userTask of startUserSelectTasks.value) {
      const assignees = startUserSelectAssignees.value[userTask.id];
      if (Array.isArray(assignees) && assignees.length === 0) {
        message.warning(`请选择${userTask.name}的候选人`);
        return;
      }
    }
  }

  processInstanceStartLoading.value = true;
  try {
    // 提交请求
    await createProcessInstance({
      processDefinitionId: props.selectProcessDefinition.id,
      variables: detailForm.value.value,
      startUserSelectAssignees: startUserSelectAssignees.value,
    });
    // 关闭并提示
    message.success('发起流程成功');
    await closeCurrent();
    await router.push({ name: 'BpmTaskMy' });
  } finally {
    processInstanceStartLoading.value = false;
  }
}

/** 设置表单信息、获取流程图数据 */
async function initProcessInfo(row: any, formVariables?: any) {
  // 重置指定审批人
  startUserSelectTasks.value = [];
  startUserSelectAssignees.value = {};

  // 情况一：流程表单
  if (row.formType === BpmModelFormType.NORMAL) {
    // 设置表单
    // 注意：需要从 formVariables 中，移除不在 row.formFields 的值。
    // 原因是：后端返回的 formVariables 里面，会有一些非表单的信息。例如说，某个流程节点的审批人。
    //        这样，就可能导致一个流程被审批不通过后，重新发起时，会直接后端报错！！！

    // 解析表单字段列表（不创建实例，避免重复渲染）
    const decodedFields = decodeFields(row.formFields);
    const allowedFields = new Set(
      decodedFields.map((field: any) => field.field).filter(Boolean),
    );

    // 过滤掉不允许的字段
    if (formVariables) {
      for (const key in formVariables) {
        if (!allowedFields.has(key)) {
          delete formVariables[key];
        }
      }
    }

    setConfAndFields2(detailForm, row.formConf, row.formFields, formVariables);

    // 在配置中禁用 form-create 自带的提交和重置按钮
    detailForm.value.option = {
      ...detailForm.value.option,
      submitBtn: false,
      resetBtn: false,
    };

    await nextTick();

    // 获取流程审批信息,当再次发起时，流程审批节点要根据原始表单参数预测出来
    await getApprovalDetail({
      id: row.id,
      processVariablesStr: JSON.stringify(formVariables),
    });

    // 加载流程图
    const processDefinitionDetail = await getProcessDefinition(row.id);
    if (processDefinitionDetail) {
      bpmnXML.value = processDefinitionDetail.bpmnXml;
      simpleJson.value = processDefinitionDetail.simpleModel;
    }

    // 如果有表单初始值，设置选中的工单内码
    if (formVariables?.internalCode) {
      selectedInternalCode.value = formVariables.internalCode;
    }
    // 情况二：业务表单
  } else if (row.formCustomCreatePath) {
    // 这里暂时无需加载流程图，因为跳出到另外个 Tab；
    await router.push({
      path: row.formCustomCreatePath,
    });
    // 返回选择流程
    emit('cancel');
  }
}

/** 监听表单中 internalCode 字段的变化，更新选中的工单内码 */
watch(
  () => detailForm.value.value?.internalCode,
  (newValue) => {
    if (newValue) {
      selectedInternalCode.value = newValue;
      // 如果当前在工单详情标签页，可以刷新工单详情
      if (activeTab.value === 'workOrder') {
        // 这里可以调用工单详情组件的刷新方法，如果需要的话
      }
    }
  },
  {
    immediate: true, // 立即执行一次，处理初始值
  },
);

/** 预测流程节点会因为输入的参数值而产生新的预测结果值，所以需重新预测一次 */
watch(
  () => detailForm.value.value,
  (newValue) => {
    if (newValue && Object.keys(newValue).length > 0) {
      // 记录之前的节点审批人
      tempStartUserSelectAssignees.value = startUserSelectAssignees.value;
      startUserSelectAssignees.value = {};
      // 加载最新的审批详情
      getApprovalDetail({
        id: props.selectProcessDefinition.id,
        processVariablesStr: JSON.stringify(newValue), // 解决 GET 无法传递对象的问题，后端 String 再转 JSON
      });
    }
  },
  {
    deep: true,
  },
);

/** 获取审批详情 */
async function getApprovalDetail(row: {
  id: string
  processVariablesStr: string
}) {
  const data = await getApprovalDetailApi({
    processDefinitionId: row.id,
    activityId: BpmNodeIdEnum.START_USER_NODE_ID,
    processVariablesStr: row.processVariablesStr,
  });
  if (!data) {
    message.error('查询不到审批详情信息！');
    return;
  }

  // 获取审批节点
  activityNodes.value = data.activityNodes;

  // 获取发起人自选的任务
  startUserSelectTasks.value = (data.activityNodes?.filter(
    (node: any) =>
      BpmCandidateStrategyEnum.START_USER_SELECT === node.candidateStrategy,
  ) || []) as unknown as UserTask[];

  // 恢复之前的选择审批人
  if (startUserSelectTasks.value.length > 0) {
    for (const node of startUserSelectTasks.value) {
      const tempAssignees = tempStartUserSelectAssignees.value[node.id];
      startUserSelectAssignees.value[node.id] = tempAssignees?.length
        ? tempAssignees
        : [];
    }
  }

  // 设置表单字段权限
  const formFieldsPermission = data.formFieldsPermission;
  if (formFieldsPermission) {
    Object.entries(formFieldsPermission).forEach(([field, permission]) => {
      setFieldPermission(field, permission as string);
    });
  }
}

/** 设置表单权限 */
function setFieldPermission(field: string, permission: string) {
  if (permission === BpmFieldPermissionType.READ) {
    fApi.value?.disabled(true, field);
  }
  if (permission === BpmFieldPermissionType.WRITE) {
    fApi.value?.disabled(false, field);
  }
  if (permission === BpmFieldPermissionType.NONE) {
    fApi.value?.hidden(true, field);
  }
}

/** 取消发起审批 */
function handleCancel() {
  emit('cancel');
}

/** 选择发起人 */
function selectUserConfirm(activityId: string, userList: any[]) {
  if (!activityId || !Array.isArray(userList)) {
    return;
  }
  startUserSelectAssignees.value[activityId] = userList.map((item) => item.id);
}

defineExpose({ initProcessInfo });
</script>

<template>
  <Card
    :title="getTitle"
    class="h-full overflow-hidden"
    :body-style="{
      height: 'calc(100% - 112px)',
      paddingTop: '12px',
      overflowY: 'auto',
    }"
  >
    <template #extra>
      <Space wrap>
        <Button plain type="default" @click="handleCancel">
          <Icon icon="lucide:arrow-left" />&nbsp; 返回
        </Button>
      </Space>
    </template>

    <Tabs
      v-model:active-key="activeTab"
      class="flex flex-1 flex-col overflow-hidden"
    >
      <!-- 1. 表单填写标签页（恢复原有宽度，布局优化） -->
      <Tabs.TabPane key="form" tab="表单填写">
        <Row :gutter="[48, 16]" class="pt-4 h-full">
          <Col
            :xs="24"
            :sm="24"
            :md="18"
            :lg="18"
            :xl="18"
            class="flex-1 overflow-auto"
          >
            <form-create
              v-model:api="fApi"
              v-model="detailForm.value"
              :rule="detailForm.rule"
              :option="detailForm.option"
              @submit="submitForm"
            />
          </Col>
          <Col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <ProcessInstanceTimeline
              ref="timelineRef"
              :activity-nodes="activityNodes"
              :show-status-icon="false"
              @select-user-confirm="selectUserConfirm"
            />
          </Col>
        </Row>
      </Tabs.TabPane>

      <!-- 2. 工单详情标签页（使用提取的组件） -->
      <Tabs.TabPane key="workOrder" tab="工单详情">
        <WorkOrderDetail :work-order-id="selectedInternalCode" />
      </Tabs.TabPane>

      <!-- 3. 流程图标签页（原有） -->
      <Tabs.TabPane
        key="flow"
        tab="流程图"
        class="flex flex-1 overflow-hidden"
        :force-render="true"
      >
        <div class="h-full w-full">
          <ProcessInstanceBpmnViewer
            v-if="BpmModelType.BPMN === selectProcessDefinition.modelType"
            :bpmn-xml="bpmnXML"
          />
          <ProcessInstanceSimpleViewer
            v-if="BpmModelType.SIMPLE === selectProcessDefinition.modelType"
            :simple-json="simpleJson"
          />
        </div>
      </Tabs.TabPane>
    </Tabs>

    <template #actions>
      <template v-if="activeTab === 'form'">
        <Space wrap class="w-full flex justify-center">
          <Button
            plain
            type="primary"
            :loading="processInstanceStartLoading"
            @click="submitForm"
          >
            <Icon icon="lucide:check" />
            发起
          </Button>
          <Button plain type="default" @click="handleCancel">
            <Icon icon="lucide:x" />
            取消
          </Button>
        </Space>
      </template>
      <!-- 其他标签页隐藏操作按钮 -->
    </template>
  </Card>
</template>

<style scoped>
/* 补充工单详情标签页样式 */
:deep(.grid) {
  display: grid;
}
:deep(.gap-6) {
  gap: 1.5rem;
}
:deep(.border-b) {
  border-bottom: 1px solid #e5e7eb;
}
</style>
