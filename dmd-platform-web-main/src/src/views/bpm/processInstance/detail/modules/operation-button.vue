<script lang="ts" setup>
// TODO @jason：你感觉要拆分下，按照表单么？
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  Alert,
  Button,
  Card,
  Form,
  FormItem,
  Image,
  Popover,
  Select,
  SelectOption,
  Space,
  Textarea,
  message,
} from 'ant-design-vue';
import Signature from './signature.vue';
import ProcessInstanceTimeline from './time-line.vue';
import type { BpmProcessInstanceApi } from '@/api/bpm/processInstance';
import type { UserVO } from '@/api/system/user';

import { Icon } from '@/components/Icon';
import { BasicModal, useModal } from '@/components/Modal';
import { useUserStore } from '@/store/modules/user';
import { isEmpty } from '@/utils/is';
import { useI18n } from '@/hooks/web/useI18n';
import {
  cancelProcessInstanceByStartUser,
  getNextApprovalNodes,
} from '@/api/bpm/processInstance';
import {
  approveTask,
  copyTask,
  delegateTask,
  getTaskListByReturn,
  rejectTask,
  returnTask,
  signCreateTask,
  signDeleteTask,
  transferTask,
} from '@/api/bpm/task';
import { setConfAndFields2 } from '@/components/form-create';

defineOptions({ name: 'ProcessInstanceBtnContainer' });

const props = defineProps<{
  normalForm: any
  normalFormApi: any
  processDefinition: any
  processInstance: any
  userOptions: UserVO[]
  writableFields: string[]
}>();

const emit = defineEmits(['success']);

const { t } = useI18n();

// BPM 常量定义
const BpmCandidateStrategyEnum = {
  START_USER_SELECT: 35,
  APPROVE_USER_SELECT: 34,
};

const BpmNodeTypeEnum = {
  START_USER_NODE: 0,
  USER_TASK_NODE: 10,
  TRANSACTOR_NODE: 12,
  END_EVENT_NODE: 50,
};

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

const BpmProcessInstanceStatus = {
  RUNNING: 1,
  APPROVE: 2,
  REJECT: 3,
  CANCEL: 4,
};

const BpmModelFormType = {
  NORMAL: 10,
  CUSTOM: 20,
};

const BpmTaskOperationButtonTypeEnum = {
  APPROVE: 1,
  REJECT: 2,
  TRANSFER: 3,
  DELEGATE: 4,
  ADD_SIGN: 5,
  RETURN: 6,
  COPY: 7,
  DELETE_SIGN: 8,
};

const OPERATION_BUTTON_NAME = new Map([
  [BpmTaskOperationButtonTypeEnum.APPROVE, '通过'],
  [BpmTaskOperationButtonTypeEnum.REJECT, '不通过'],
  [BpmTaskOperationButtonTypeEnum.TRANSFER, '转办'],
  [BpmTaskOperationButtonTypeEnum.DELEGATE, '委派'],
  [BpmTaskOperationButtonTypeEnum.ADD_SIGN, '加签'],
  [BpmTaskOperationButtonTypeEnum.RETURN, '退回'],
  [BpmTaskOperationButtonTypeEnum.COPY, '抄送'],
  [BpmTaskOperationButtonTypeEnum.DELETE_SIGN, '减签'],
]);

const [registerSignatureModal, signatureModalMethods] = useModal();

const router = useRouter();
const userStore = useUserStore();
const userId = userStore.getUserInfo?.user?.id;
const formLoading = ref(false);
const popOverVisible: any = ref({
  approve: false,
  reject: false,
  transfer: false,
  delegate: false,
  addSign: false,
  return: false,
  copy: false,
  cancel: false,
  deleteSign: false,
});
const returnList = ref([] as any);

/** 创建流程表达式 */
function openSignatureModal() {
  signatureModalMethods.openModal(true);
}

// ========== 审批信息 ==========
const runningTask = ref<any>();
// 修复点1：初始化表单结构，避免undefined
const approveForm = ref<any>({
  rule: [],
  option: {},
  value: {} // 确保value字段存在
});
const approveFormFApi = ref<any>({});
const nodeTypeName = ref('审批');

const reasonRequire = ref();
const approveFormRef = ref<FormInstance>();
const approveSignFormRef = ref();
const nextAssigneesActivityNode = ref<BpmProcessInstanceApi.ApprovalNodeInfo[]>([]);
const nextAssigneesTimelineRef = ref();
const approveReasonForm: any = reactive({
  reason: '',
  signPicUrl: '',
  nextAssignees: {},
});
const approveReasonRule: Record<string, any> = computed(() => {
  return {
    reason: [
      {
        required: reasonRequire.value,
        message: `${nodeTypeName.value}意见不能为空`,
        trigger: 'blur',
      },
    ],
    signPicUrl: [
      { required: runningTask.value?.signEnable || false, message: '签名不能为空', trigger: 'change' },
    ],
    nextAssignees: [
      { required: nextAssigneesActivityNode.value.length > 0, message: '审批人不能为空', trigger: 'blur' },
    ],
  };
});

const rejectFormRef = ref<FormInstance>();
const rejectReasonForm = reactive({
  reason: '',
});
const rejectReasonRule: any = computed(() => {
  return {
    reason: [
      {
        required: reasonRequire.value,
        message: '审批意见不能为空',
        trigger: 'blur',
      },
    ],
  } as Record<string, Rule[]>;
});

const copyFormRef = ref<FormInstance>();
const copyForm = reactive({
  copyUserIds: [],
  copyReason: '',
});
const copyFormRule: Record<string, Rule[]> = reactive({
  copyUserIds: [
    { required: true, message: '抄送人不能为空', trigger: 'change' },
  ],
});

const transferFormRef = ref<FormInstance>();
const transferForm = reactive({
  assigneeUserId: undefined,
  reason: '',
});
const transferFormRule: Record<string, Rule[]> = reactive({
  assigneeUserId: [
    { required: true, message: '新审批人不能为空', trigger: 'change' },
  ],
  reason: [{ required: true, message: '审批意见不能为空', trigger: 'blur' }],
});

const delegateFormRef = ref<FormInstance>();
const delegateForm = reactive({
  delegateUserId: undefined,
  reason: '',
});
const delegateFormRule: Record<string, Rule[]> = reactive({
  delegateUserId: [
    { required: true, message: '接收人不能为空', trigger: 'change' },
  ],
  reason: [{ required: true, message: '审批意见不能为空', trigger: 'blur' }],
});

const addSignFormRef = ref<FormInstance>();
const addSignForm = reactive({
  addSignUserIds: undefined,
  reason: '',
});
const addSignFormRule: Record<string, Rule[]> = reactive({
  addSignUserIds: [
    { required: true, message: '加签处理人不能为空', trigger: 'change' },
  ],
  reason: [{ required: true, message: '审批意见不能为空', trigger: 'blur' }],
});

const deleteSignFormRef = ref<FormInstance>();
const deleteSignForm = reactive({
  deleteSignTaskId: undefined,
  reason: '',
});
const deleteSignFormRule: Record<string, Rule[]> = reactive({
  deleteSignTaskId: [
    { required: true, message: '减签人员不能为空', trigger: 'change' },
  ],
  reason: [{ required: true, message: '审批意见不能为空', trigger: 'blur' }],
});

const returnFormRef = ref<FormInstance>();
const returnForm = reactive({
  targetTaskDefinitionKey: undefined,
  returnReason: '',
});
const returnFormRule: Record<string, Rule[]> = reactive({
  targetTaskDefinitionKey: [
    { required: true, message: '退回节点不能为空', trigger: 'change' },
  ],
  returnReason: [
    { required: true, message: '退回理由不能为空', trigger: 'blur' },
  ],
});

const cancelFormRef = ref<FormInstance>();
const cancelForm = reactive({
  cancelReason: '',
});
const cancelFormRule: Record<string, Rule[]> = reactive({
  cancelReason: [
    { required: true, message: '取消理由不能为空', trigger: 'blur' },
  ],
});

/** 监听 approveFormFApis，实现它对应的 form-create 初始化后，隐藏掉对应的表单提交按钮 */
watch(
  () => approveFormFApi.value,
  (val) => {
    val?.btn?.show(false);
    val?.resetBtn?.show(false);
  },
  {
    deep: true,
  },
);

// 修复点2：监听approveForm.value变化，确保value字段始终存在
watch(
  () => approveForm.value,
  (newVal) => {
    if (!newVal.value) {
      approveForm.value.value = {};
    }
  },
  { immediate: true, deep: true }
);

/** 弹出气泡卡 */
async function openPopover(type: string) {
  if (type === 'approve') {
    const valid = await validateNormalForm();
    if (!valid) {
      message.warning('表单校验不通过，请先完善表单!!');
      return;
    }
    await initNextAssigneesFormField();
  }
  if (type === 'return') {
    returnList.value = await getTaskListByReturn(runningTask.value.id);
    if (returnList.value.length === 0) {
      message.warning('当前没有可退回的节点');
      return;
    }
  }
  Object.keys(popOverVisible.value).forEach((item) => {
    if (popOverVisible.value[item]) {
      popOverVisible.value[item] = item === type;
    }
  });
}

/** 关闭气泡卡 */
function closePopover(type: string, formRef: any | FormInstance) {
  if (formRef) {
    formRef.resetFields();
  }
  if (popOverVisible.value[type]) {
    popOverVisible.value[type] = false;
  }
  nextAssigneesActivityNode.value = [];
  if (nextAssigneesTimelineRef.value) {
    nextAssigneesTimelineRef.value.batchSetCustomApproveUsers({});
  }
}

/** 流程通过时，根据表单变量查询新的流程节点，判断下一个节点类型是否为自选审批人 */
async function initNextAssigneesFormField() {
  const variables = getUpdatedProcessInstanceVariables();
  const data = await getNextApprovalNodes({
    processInstanceId: props.processInstance.id,
    taskId: runningTask.value.id,
    processVariablesStr: JSON.stringify(variables),
  });
  if (data && data.length > 0) {
    const customApproveUsersData: Record<string, any[]> = {};
    data.forEach((node: BpmProcessInstanceApi.ApprovalNodeInfo) => {
      if (
        (isEmpty(node.tasks)
          && isEmpty(node.candidateUsers)
          && BpmCandidateStrategyEnum.START_USER_SELECT === node.candidateStrategy)
        || BpmCandidateStrategyEnum.APPROVE_USER_SELECT === node.candidateStrategy
      ) {
        nextAssigneesActivityNode.value.push(node);
      }
      if (node.candidateUsers && node.candidateUsers.length > 0) {
        customApproveUsersData[node.id] = node.candidateUsers;
      }
    });
    await nextTick();
    if (
      nextAssigneesTimelineRef.value
      && Object.keys(customApproveUsersData).length > 0
    ) {
      nextAssigneesTimelineRef.value.batchSetCustomApproveUsers(customApproveUsersData);
    }
  }
}

/** 选择下一个节点的审批人 */
function selectNextAssigneesConfirm(id: string, userList: any[]) {
  approveReasonForm.nextAssignees[id] = userList?.map((item: any) => item.id);
}

/** 审批通过时，校验每个自选审批人的节点是否都已配置了审批人 */
function validateNextAssignees() {
  if (Object.keys(nextAssigneesActivityNode.value).length === 0) {
    return true;
  }
  for (const item of nextAssigneesActivityNode.value) {
    if (isEmpty(approveReasonForm.nextAssignees[item.id])) {
      message.warning('下一个节点的审批人不能为空!');
      return false;
    }
  }
  return true;
}

/** 修复点3：新增 - 收集任务表单变量（合并逻辑） */
async function collectTaskFormVariables() {
  // 调试信息输出
  console.log('=== 表单数据调试 ===');
  console.log('1. runningTask 表单配置:', {
    formId: runningTask.value?.formId,
    formConf: runningTask.value?.formConf,
    formFields: runningTask.value?.formFields,
    formVariables: runningTask.value?.formVariables
  });
  console.log('2. approveForm.value:', approveForm.value);
  console.log('3. approveFormFApi.value:', approveFormFApi.value);
  console.log('4. props.normalFormApi:', props.normalFormApi);
  console.log('5. props.writableFields:', props.writableFields);

  let taskVariables = {};
  try {
    // 1. 优先从FormCreate的formModel读取（修复绑定问题）
    if (approveFormFApi.value && approveFormFApi.value.form?.model) {
      taskVariables = { ...approveFormFApi.value.form.model };
      console.log('从FormCreate.formModel获取的变量:', taskVariables);
    }
    // 2. 再从approveForm.value.value读取（核心修复：解构嵌套的value）
    else if (approveForm.value.value && Object.keys(approveForm.value.value).length > 0) {
      // 修复点：如果value里还有一层value，就解构出来
      const rawValue = approveForm.value.value;
      taskVariables = rawValue.value ? { ...rawValue.value } : { ...rawValue };
      console.log('从approveForm.value.value获取的变量:', taskVariables);
    }

    // 3. 兜底：从runningTask.formFields初始化默认值
    if (Object.keys(taskVariables).length === 0 && runningTask.value?.formFields) {
      runningTask.value.formFields.forEach((field: any) => {
        const fieldKey = field.field;
        // 根据字段类型设置默认值
        if (field.type === 'switch') {
          taskVariables[fieldKey] = field.props?.checkedValue ?? false;
        } else if (field.type === 'input' || field.type === 'textarea') {
          taskVariables[fieldKey] = '';
        } else if (field.type === 'select') {
          taskVariables[fieldKey] = field.props?.defaultValue ?? '';
        }
      });
      console.log('从formFields初始化的默认变量:', taskVariables);
    }

    // 4. 补充从normalFormApi获取的变量（避免丢失）
    const normalVariables = getUpdatedProcessInstanceVariables();
    taskVariables = { ...normalVariables, ...taskVariables };
    console.log('合并normalFormApi后的变量:', taskVariables);

    // 5. 过滤空值，避免传递undefined/null
    Object.keys(taskVariables).forEach(key => {
      if (taskVariables[key] === undefined || taskVariables[key] === null) {
        delete taskVariables[key];
      }
    });
  } catch (error) {
    console.error('收集任务表单变量失败:', error);
    message.error('表单数据获取失败，请检查表单填写是否正确');
  }
  console.log('最终提交的variables:', taskVariables);
  return taskVariables;
}

/** 处理审批通过和不通过的操作 */
async function handleAudit(pass: boolean, formRef: FormInstance | undefined) {
  formLoading.value = true;
  try {
    if (!formRef) {
      console.error('formRef为空，无法提交');
      return;
    }
    await formRef?.validate();
    const valid = await validateNormalForm();
    if (!valid) {
      message.warning('表单校验不通过，请先完善表单!!');
      return;
    }

    if (pass) {
      const nextAssigneesValid = validateNextAssignees();
      if (!nextAssigneesValid) {
        return;
      }

      // 修复点4：使用新的变量收集逻辑，避免覆盖
      const variables = await collectTaskFormVariables();

      // 强制注入测试变量（可选：用于验证传递逻辑）
      if (Object.keys(variables).length === 0) {
        variables.testField = '测试值';
        variables.taskId = runningTask.value.id;
        variables.processInstanceId = props.processInstance.id;
        console.log('强制注入测试变量:', variables);
      }

      const data = {
        id: runningTask.value.id,
        reason: approveReasonForm.reason || '', // 兜底空字符串
        variables: variables || {}, // 确保是对象
        nextAssignees: approveReasonForm.nextAssignees || {},
      } as any;

      // 签名URL处理
      if (runningTask.value.signEnable) {
        data.signPicUrl = approveReasonForm.signPicUrl;
      }

      // 调试日志：打印最终提交的数据
      console.log('提交到后端的完整数据:', JSON.stringify(data, null, 2));

      await approveTask(data);
      popOverVisible.value.approve = false;
      nextAssigneesActivityNode.value = [];
      if (nextAssigneesTimelineRef.value) {
        nextAssigneesTimelineRef.value.batchSetCustomApproveUsers({});
      }
      message.success('审批通过成功');
    } else {
      const data = {
        id: runningTask.value.id,
        reason: rejectReasonForm.reason,
      };
      await rejectTask(data);
      popOverVisible.value.reject = false;
      message.success('审批不通过成功');
    }
    formRef.resetFields();
    reload();
  } catch (error) {
    // 修复点5：新增错误捕获，便于排查
    console.error('审批操作失败:', error);
    message.error(`操作失败：${(error as Error).message || '未知错误'}`);
  } finally {
    formLoading.value = false;
  }
}

/** 处理抄送 */
async function handleCopy() {
  formLoading.value = true;
  try {
    if (!copyFormRef.value) {
      return;
    }
    await copyFormRef.value.validate();
    const data = {
      id: runningTask.value.id,
      reason: copyForm.copyReason,
      copyUserIds: copyForm.copyUserIds,
    };
    await copyTask(data);
    copyFormRef.value.resetFields();
    popOverVisible.value.copy = false;
    message.success(t('common.operationSuccess'));
  } finally {
    formLoading.value = false;
  }
}

/** 处理转交 */
async function handleTransfer() {
  formLoading.value = true;
  try {
    if (!transferFormRef.value) {
      return;
    }
    await transferFormRef.value.validate();
    const data = {
      id: runningTask.value.id,
      reason: transferForm.reason,
      assigneeUserId: transferForm.assigneeUserId,
    };
    await transferTask(data);
    transferFormRef.value.resetFields();
    popOverVisible.value.transfer = false;
    message.success(t('common.operationSuccess'));
    reload();
  } finally {
    formLoading.value = false;
  }
}

/** 处理委派 */
async function handleDelegate() {
  formLoading.value = true;
  try {
    if (!delegateFormRef.value) {
      return;
    }
    await delegateFormRef.value.validate();
    const data = {
      id: runningTask.value.id,
      reason: delegateForm.reason,
      delegateUserId: delegateForm.delegateUserId,
    };
    await delegateTask(data);
    popOverVisible.value.delegate = false;
    delegateFormRef.value.resetFields();
    message.success(t('common.operationSuccess'));
    reload();
  } finally {
    formLoading.value = false;
  }
}

/** 处理加签 */
async function handlerAddSign(type: string) {
  formLoading.value = true;
  try {
    if (!addSignFormRef.value) {
      return;
    }
    await addSignFormRef.value.validate();
    const data = {
      id: runningTask.value.id,
      type,
      reason: addSignForm.reason,
      userIds: addSignForm.addSignUserIds,
    };
    await signCreateTask(data);
    message.success(t('common.operationSuccess'));
    addSignFormRef.value.resetFields();
    popOverVisible.value.addSign = false;
    reload();
  } finally {
    formLoading.value = false;
  }
}

/** 处理退回 */
async function handleReturn() {
  formLoading.value = true;
  try {
    if (!returnFormRef.value) {
      return;
    }
    await returnFormRef.value.validate();
    const data = {
      id: runningTask.value.id,
      reason: returnForm.returnReason,
      targetTaskDefinitionKey: returnForm.targetTaskDefinitionKey,
    };
    await returnTask(data);
    popOverVisible.value.return = false;
    returnFormRef.value.resetFields();
    message.success(t('common.operationSuccess'));
    reload();
  } finally {
    formLoading.value = false;
  }
}

/** 处理取消 */
async function handleCancel() {
  formLoading.value = true;
  try {
    if (!cancelFormRef.value) {
      return;
    }
    await cancelFormRef.value.validate();
    await cancelProcessInstanceByStartUser(
      props.processInstance.id,
      cancelForm.cancelReason,
    );
    popOverVisible.value.cancel = false; // 修复原代码错误：return → cancel
    message.success(t('common.operationSuccess'));
    cancelFormRef.value.resetFields();
    reload();
  } finally {
    formLoading.value = false;
  }
}

/** 处理再次提交 */
async function handleReCreate() {
  await router.push({
    name: 'BpmProcessInstanceCreate',
    query: { processInstanceId: props.processInstance?.id },
  });
}

/** 获取减签人员标签 */
function getDeleteSignUserLabel(task: any): string {
  const deptName = task?.assigneeUser?.deptName || task?.ownerUser?.deptName;
  const nickname = task?.assigneeUser?.nickname || task?.ownerUser?.nickname;
  return `${nickname} ( 所属部门：${deptName} )`;
}

/** 处理减签 */
async function handlerDeleteSign() {
  formLoading.value = true;
  try {
    if (!deleteSignFormRef.value) {
      return;
    }
    await deleteSignFormRef.value?.validate();
    const data = {
      id: deleteSignForm.deleteSignTaskId,
      reason: deleteSignForm.reason,
    };
    await signDeleteTask(data);
    message.success('减签成功');
    deleteSignFormRef.value.resetFields();
    popOverVisible.value.deleteSign = false;
    reload();
  } finally {
    formLoading.value = false;
  }
}

/** 重新加载数据 */
function reload() {
  emit('success');
}

/** 任务是否为处理中状态 */
function isHandleTaskStatus() {
  let canHandle = false;
  if (BpmTaskStatusEnum.RUNNING === runningTask.value?.status) {
    canHandle = true;
  }
  return canHandle;
}

/** 流程状态是否为结束状态 */
function isEndProcessStatus(status: number) {
  let isEndStatus = false;
  if (
    BpmProcessInstanceStatus.APPROVE === status
    || BpmProcessInstanceStatus.REJECT === status
    || BpmProcessInstanceStatus.CANCEL === status
  ) {
    isEndStatus = true;
  }
  return isEndStatus;
}

/** 是否显示按钮 */
function isShowButton(btnType: number): boolean {
  let isShow = true;
  if (
    runningTask.value?.buttonsSetting
    && runningTask.value?.buttonsSetting[btnType]
  ) {
    isShow = runningTask.value.buttonsSetting[btnType].enable;
  }
  return isShow;
}

/** 获取按钮的显示名称 */
function getButtonDisplayName(btnType: number) {
  let displayName = OPERATION_BUTTON_NAME.get(btnType);
  if (
    runningTask.value?.buttonsSetting
    && runningTask.value?.buttonsSetting[btnType]
  ) {
    displayName = runningTask.value.buttonsSetting[btnType].displayName;
  }
  return displayName;
}

/** 加载待办任务 */
function loadTodoTask(task: any) {
  // 修复点6：初始化表单结构，避免undefined
  approveForm.value = {
    rule: [],
    option: {},
    value: {}
  };
  runningTask.value = task;
  approveFormFApi.value = {};
  reasonRequire.value = task?.reasonRequire ?? false;
  nodeTypeName.value
    = task?.nodeType === BpmNodeTypeEnum.TRANSACTOR_NODE ? '办理' : '审批';
  if (task && task.formId && task.formConf) {
    const tempApproveForm = {
      rule: [],
      option: {},
      value: {}
    };
    try {
      // 确保formFields和formVariables不为空
      const formFields = task.formFields || [];
      const formVariables = task.formVariables || {};
      setConfAndFields2(
        tempApproveForm,
        task.formConf,
        formFields,
        formVariables,
      );
      approveForm.value = tempApproveForm;
      console.log('loadTodoTask初始化的表单值:', approveForm.value.value);
    } catch (error) {
      console.error('初始化表单失败:', error);
      approveForm.value.value = {};
    }
  } else {
    approveForm.value.value = {};
  }
}

/** 校验流程表单 */
async function validateNormalForm() {
  if (props.processDefinition?.formType === BpmModelFormType.NORMAL) {
    let valid = true;
    try {
      await props.normalFormApi?.validate();
    } catch {
      valid = false;
    }
    return valid;
  } else {
    return true;
  }
}

/** 从可以编辑的流程表单字段，获取需要修改的流程实例的变量 */
function getUpdatedProcessInstanceVariables() {
  const variables: any = {};
  if (!props.writableFields || props.writableFields.length === 0) {
    return variables;
  }
  props.writableFields.forEach((field: string) => {
    try {
      // 修复点7：增加兜底，避免字段不存在返回undefined
      const value = props.normalFormApi?.getValue(field) ?? '';
      if (value !== undefined && value !== null) {
        variables[field] = value;
      }
    } catch (error) {
      console.error(`获取字段${field}值失败:`, error);
      variables[field] = '';
    }
  });
  return variables;
}

/** 处理签名完成 */
function handleSignFinish(url: string) {
  approveReasonForm.signPicUrl = url;
  approveFormRef.value?.validateFields(['signPicUrl']);
}

/** 处理弹窗可见性 */
function handlePopoverVisible(visible: boolean) {
  if (!visible) {
    popOverVisible.value.approve = true;
  }
}

defineExpose({ loadTodoTask });
</script>

<template>
  <div class="flex items-center">
    <!-- 【通过】按钮 -->
    <!-- z-index 设置为300 避免覆盖签名弹窗 -->
    <Space size="middle">
      <Popover
        v-if="
          runningTask
            && isHandleTaskStatus()
            && isShowButton(BpmTaskOperationButtonTypeEnum.APPROVE)
        "
        v-model:open="popOverVisible.approve"
        placement="top"
        :overlay-style="{ minWidth: '400px' }"
        trigger="click"
        @open-change="handlePopoverVisible"
      >
        <Button ghost type="primary" @click="openPopover('approve')">
          <Icon icon="lucide:check" />
          {{ getButtonDisplayName(BpmTaskOperationButtonTypeEnum.APPROVE) }}
        </Button>
        <template #content>
          <!-- 办理表单 -->
          <div v-loading="formLoading" class="flex flex-1 flex-col px-5 pt-5">
            <Form
              ref="approveFormRef"
              layout="vertical"
              class="mb-auto"
              :model="approveReasonForm"
              :rules="approveReasonRule"
              label-width="100px"
            >
              <Card v-if="runningTask?.formId > 0" class="mb-3.5 !-mt-2.5">
                <template #title>
                  <span class="el-icon-picture-outline">
                    填写表单【{{ runningTask?.formName }}】
                  </span>
                </template>
                <!-- 修复点8：FormCreate绑定方式修正 -->
                <FormCreate
                  v-model="approveForm.value.value"
                  v-model:api="approveFormFApi"
                  :option="approveForm.option"
                  :rule="approveForm.rule"
                />
              </Card>

              <FormItem
                v-if="nextAssigneesActivityNode.length > 0"
                label="下一个节点的审批人"
                name="nextAssignees"
              >
                <div class="ml-2.5 -mb-8 -mt-3.5">
                  <ProcessInstanceTimeline
                    ref="nextAssigneesTimelineRef"
                    :activity-nodes="nextAssigneesActivityNode"
                    :show-status-icon="false"
                    :enable-approve-user-select="true"
                    @select-user-confirm="selectNextAssigneesConfirm"
                  />
                </div>
              </FormItem>
              <FormItem
                v-if="runningTask.signEnable"
                ref="approveSignFormRef"
                label="签名"
                name="signPicUrl"
              >
                <div class="flex items-center gap-2">
                  <Button type="primary" @click="openSignatureModal">
                    {{ approveReasonForm.signPicUrl ? '重新签名' : '点击签名' }}
                  </Button>
                  <Image
                    v-if="approveReasonForm.signPicUrl"
                    class="object-contain !h-10 !w-40"
                    :src="approveReasonForm.signPicUrl"
                  />
                </div>
              </FormItem>
              <FormItem :label="`${nodeTypeName}意见`" name="reason">
                <Textarea
                  v-model:value="approveReasonForm.reason"
                  :placeholder="`请输入${nodeTypeName}意见`"
                  :rows="4"
                />
              </FormItem>
              <FormItem>
                <Space>
                  <Button
                    :disabled="formLoading"
                    type="primary"
                    @click="handleAudit(true, approveFormRef)"
                  >
                    {{
                      getButtonDisplayName(
                        BpmTaskOperationButtonTypeEnum.APPROVE,
                      )
                    }}
                  </Button>
                  <Button @click="closePopover('approve', approveFormRef)">
                    取消
                  </Button>
                </Space>
              </FormItem>
            </Form>
          </div>
        </template>
      </Popover>

      <!-- 【拒绝】按钮 -->
      <Popover
        v-if="
          runningTask
            && isHandleTaskStatus()
            && isShowButton(BpmTaskOperationButtonTypeEnum.REJECT)
        "
        v-model:open="popOverVisible.reject"
        placement="top"
        :overlay-style="{ minWidth: '400px' }"
        trigger="click"
      >
        <Button ghost danger type="primary" @click="openPopover('reject')">
          <Icon icon="lucide:x" />
          {{ getButtonDisplayName(BpmTaskOperationButtonTypeEnum.REJECT) }}
        </Button>
        <template #content>
          <!-- 审批表单 -->
          <div v-loading="formLoading" class="flex flex-1 flex-col px-5 pt-5">
            <Form
              ref="rejectFormRef"
              layout="vertical"
              class="mb-auto"
              :model="rejectReasonForm"
              :rules="rejectReasonRule"
              label-width="100px"
            >
              <FormItem label="审批意见" name="reason">
                <Textarea
                  v-model:value="rejectReasonForm.reason"
                  placeholder="请输入审批意见"
                  :rows="4"
                />
              </FormItem>
              <FormItem>
                <Button
                  :disabled="formLoading"
                  danger
                  type="primary"
                  @click="handleAudit(false, rejectFormRef)"
                >
                  {{
                    getButtonDisplayName(
                      BpmTaskOperationButtonTypeEnum.REJECT,
                    )
                  }}
                </Button>
                <Button
                  class="ml-2"
                  @click="closePopover('reject', rejectFormRef)"
                >
                  取消
                </Button>
              </FormItem>
            </Form>
          </div>
        </template>
      </Popover>

      <!-- 【抄送】按钮 -->
      <Popover
        v-if="
          runningTask
            && isHandleTaskStatus()
            && isShowButton(BpmTaskOperationButtonTypeEnum.COPY)
        "
        v-model:open="popOverVisible.copy"
        placement="top"
        :overlay-style="{ width: '400px' }"
        trigger="click"
      >
        <Button type="dashed" @click="openPopover('copy')">
          <Icon icon="lucide:copy" />
          {{ getButtonDisplayName(BpmTaskOperationButtonTypeEnum.COPY) }}
        </Button>
        <template #content>
          <div v-loading="formLoading" class="flex flex-1 flex-col px-5 pt-5">
            <Form
              ref="copyFormRef"
              layout="vertical"
              class="mb-auto"
              :model="copyForm"
              :rules="copyFormRule"
              label-width="100px"
            >
              <FormItem label="抄送人" name="copyUserIds">
                <Select
                  v-model:value="copyForm.copyUserIds"
                  :allow-clear="true"
                  mode="multiple"
                  placeholder="请选择抄送人"
                  class="w-full"
                >
                  <SelectOption
                    v-for="item in userOptions"
                    :key="item.id"
                    :label="item.nickname"
                    :value="item.id"
                  >
                    {{ item.nickname }}
                  </SelectOption>
                </Select>
              </FormItem>
              <FormItem label="抄送意见" name="copyReason">
                <Textarea
                  v-model:value="copyForm.copyReason"
                  placeholder="请输入抄送意见"
                  :rows="3"
                />
              </FormItem>
              <FormItem>
                <Space>
                  <Button
                    :disabled="formLoading"
                    type="primary"
                    @click="handleCopy"
                  >
                    {{
                      getButtonDisplayName(
                        BpmTaskOperationButtonTypeEnum.COPY,
                      )
                    }}
                  </Button>
                  <Button @click="closePopover('copy', copyFormRef)">
                    取消
                  </Button>
                </Space>
              </FormItem>
            </Form>
          </div>
        </template>
      </Popover>

      <!-- 【转办】按钮 -->
      <Popover
        v-if="
          runningTask
            && isHandleTaskStatus()
            && isShowButton(BpmTaskOperationButtonTypeEnum.TRANSFER)
        "
        v-model:open="popOverVisible.transfer"
        placement="top"
        :overlay-style="{ width: '400px' }"
        trigger="click"
      >
        <Button type="dashed" @click="openPopover('transfer')">
          <Icon icon="icon-park-outline:share-two" />
          {{ getButtonDisplayName(BpmTaskOperationButtonTypeEnum.TRANSFER) }}
        </Button>
        <template #content>
          <div v-loading="formLoading" class="flex flex-1 flex-col px-5 pt-5">
            <Form
              ref="transferFormRef"
              layout="vertical"
              class="mb-auto"
              :model="transferForm"
              :rules="transferFormRule"
              label-width="100px"
            >
              <FormItem label="新审批人" name="assigneeUserId">
                <Select
                  v-model:value="transferForm.assigneeUserId"
                  :allow-clear="true"
                  style="width: 100%"
                >
                  <SelectOption
                    v-for="item in userOptions"
                    :key="item.id"
                    :label="item.nickname"
                    :value="item.id"
                  >
                    {{ item.nickname }}
                  </SelectOption>
                </Select>
              </FormItem>
              <FormItem label="审批意见" name="reason">
                <Textarea
                  v-model:value="transferForm.reason"
                  allow-clear
                  placeholder="请输入审批意见"
                  :rows="3"
                />
              </FormItem>
              <FormItem>
                <Space>
                  <Button
                    :disabled="formLoading"
                    type="primary"
                    @click="handleTransfer()"
                  >
                    {{
                      getButtonDisplayName(
                        BpmTaskOperationButtonTypeEnum.TRANSFER,
                      )
                    }}
                  </Button>
                  <Button @click="closePopover('transfer', transferFormRef)">
                    取消
                  </Button>
                </Space>
              </FormItem>
            </Form>
          </div>
        </template>
      </Popover>

      <!-- 【委派】按钮 -->
      <Popover
        v-if="
          runningTask
            && isHandleTaskStatus()
            && isShowButton(BpmTaskOperationButtonTypeEnum.DELEGATE)
        "
        v-model:open="popOverVisible.delegate"
        placement="top"
        :overlay-style="{ width: '400px' }"
        trigger="click"
      >
        <Button type="dashed" @click="openPopover('delegate')">
          <Icon :size="14" icon="icon-park-outline:user-positioning" />
          {{ getButtonDisplayName(BpmTaskOperationButtonTypeEnum.DELEGATE) }}
        </Button>
        <template #content>
          <div v-loading="formLoading" class="flex flex-1 flex-col px-5 pt-5">
            <Form
              ref="delegateFormRef"
              layout="vertical"
              class="mb-auto"
              :model="delegateForm"
              :rules="delegateFormRule"
              label-width="100px"
            >
              <FormItem label="接收人" name="delegateUserId">
                <Select
                  v-model:value="delegateForm.delegateUserId"
                  :allow-clear="true"
                  style="width: 100%"
                >
                  <SelectOption
                    v-for="item in userOptions"
                    :key="item.id"
                    :label="item.nickname"
                    :value="item.id"
                  >
                    {{ item.nickname }}
                  </SelectOption>
                </Select>
              </FormItem>
              <FormItem label="审批意见" name="reason">
                <Textarea
                  v-model:value="delegateForm.reason"
                  allow-clear
                  placeholder="请输入审批意见"
                  :rows="3"
                />
              </FormItem>
              <FormItem>
                <Space>
                  <Button
                    :disabled="formLoading"
                    type="primary"
                    @click="handleDelegate()"
                  >
                    {{
                      getButtonDisplayName(
                        BpmTaskOperationButtonTypeEnum.DELEGATE,
                      )
                    }}
                  </Button>
                  <Button @click="closePopover('delegate', delegateFormRef)">
                    取消
                  </Button>
                </Space>
              </FormItem>
            </Form>
          </div>
        </template>
      </Popover>

      <!-- 【加签】按钮 -->
      <Popover
        v-if="
          runningTask
            && isHandleTaskStatus()
            && isShowButton(BpmTaskOperationButtonTypeEnum.ADD_SIGN)
        "
        v-model:open="popOverVisible.addSign"
        placement="top"
        :overlay-style="{ width: '400px' }"
        trigger="click"
      >
        <Button type="dashed" @click="openPopover('addSign')">
          <Icon :size="14" icon="icon-park-outline:plus" />
          {{ getButtonDisplayName(BpmTaskOperationButtonTypeEnum.ADD_SIGN) }}
        </Button>
        <template #content>
          <div v-loading="formLoading" class="flex flex-1 flex-col px-5 pt-5">
            <Form
              ref="addSignFormRef"
              layout="vertical"
              class="mb-auto"
              :model="addSignForm"
              :rules="addSignFormRule"
              label-width="100px"
            >
              <FormItem label="加签处理人" name="addSignUserIds">
                <Select
                  v-model:value="addSignForm.addSignUserIds"
                  :allow-clear="true"
                  mode="multiple"
                  style="width: 100%"
                >
                  <SelectOption
                    v-for="item in userOptions"
                    :key="item.id"
                    :label="item.nickname"
                    :value="item.id"
                  >
                    {{ item.nickname }}
                  </SelectOption>
                </Select>
              </FormItem>
              <FormItem label="审批意见" name="reason">
                <Textarea
                  v-model:value="addSignForm.reason"
                  allow-clear
                  placeholder="请输入审批意见"
                  :rows="3"
                />
              </FormItem>
              <FormItem>
                <Space>
                  <Button
                    :disabled="formLoading"
                    type="primary"
                    @click="handlerAddSign('before')"
                  >
                    向前{{
                      getButtonDisplayName(
                        BpmTaskOperationButtonTypeEnum.ADD_SIGN,
                      )
                    }}
                  </Button>
                  <Button
                    :disabled="formLoading"
                    type="primary"
                    @click="handlerAddSign('after')"
                  >
                    向后{{
                      getButtonDisplayName(
                        BpmTaskOperationButtonTypeEnum.ADD_SIGN,
                      )
                    }}
                  </Button>
                  <Button @click="closePopover('addSign', addSignFormRef)">
                    取消
                  </Button>
                </Space>
              </FormItem>
            </Form>
          </div>
        </template>
      </Popover>

      <!-- 【减签】按钮 -->
      <Popover
        v-if="runningTask?.children.length > 0"
        v-model:open="popOverVisible.deleteSign"
        placement="top"
        :overlay-style="{ width: '400px' }"
        trigger="click"
      >
        <Button type="dashed" @click="openPopover('deleteSign')">
          <Icon :size="14" icon="icon-park-outline:minus" /> 减签
        </Button>
        <template #content>
          <div v-loading="formLoading" class="flex flex-1 flex-col px-5 pt-5">
            <Form
              ref="deleteSignFormRef"
              layout="vertical"
              class="mb-auto"
              :model="deleteSignForm"
              :rules="deleteSignFormRule"
              label-width="100px"
            >
              <FormItem label="减签人员" name="deleteSignTaskId">
                <Select
                  v-model:value="deleteSignForm.deleteSignTaskId"
                  :allow-clear="true"
                  style="width: 100%"
                >
                  <SelectOption
                    v-for="item in runningTask.children"
                    :key="item.id"
                    :label="getDeleteSignUserLabel(item)"
                    :value="item.id"
                  >
                    {{ getDeleteSignUserLabel(item) }}
                  </SelectOption>
                </Select>
              </FormItem>
              <FormItem label="审批意见" name="reason">
                <Textarea
                  v-model:value="deleteSignForm.reason"
                  allow-clear
                  placeholder="请输入审批意见"
                  :rows="3"
                />
              </FormItem>
              <FormItem>
                <Space>
                  <Button
                    :disabled="formLoading"
                    type="primary"
                    @click="handlerDeleteSign()"
                  >
                    减签
                  </Button>
                  <Button
                    @click="closePopover('deleteSign', deleteSignFormRef)"
                  >
                    取消
                  </Button>
                </Space>
              </FormItem>
            </Form>
          </div>
        </template>
      </Popover>

      <!-- 【退回】按钮 -->
      <Popover
        v-if="
          runningTask
            && isHandleTaskStatus()
            && isShowButton(BpmTaskOperationButtonTypeEnum.RETURN)
        "
        v-model:open="popOverVisible.return"
        placement="top"
        :overlay-style="{ width: '400px' }"
        trigger="click"
      >
        <Button type="dashed" @click="openPopover('return')">
          <Icon :size="14" icon="lucide:arrow-left" />
          {{ getButtonDisplayName(BpmTaskOperationButtonTypeEnum.RETURN) }}
        </Button>
        <template #content>
          <div v-loading="formLoading" class="flex flex-1 flex-col px-5 pt-5">
            <Form
              ref="returnFormRef"
              layout="vertical"
              class="mb-auto"
              :model="returnForm"
              :rules="returnFormRule"
              label-width="100px"
            >
              <FormItem label="退回节点" name="targetTaskDefinitionKey">
                <Select
                  v-model:value="returnForm.targetTaskDefinitionKey"
                  :allow-clear="true"
                  style="width: 100%"
                >
                  <SelectOption
                    v-for="item in returnList"
                    :key="item.taskDefinitionKey"
                    :label="item.name"
                    :value="item.taskDefinitionKey"
                  >
                    {{ item.name }}
                  </SelectOption>
                </Select>
              </FormItem>
              <FormItem label="退回理由" name="returnReason">
                <Textarea
                  v-model:value="returnForm.returnReason"
                  allow-clear
                  placeholder="请输入退回理由"
                  :rows="3"
                />
              </FormItem>
              <FormItem>
                <Space>
                  <Button
                    :disabled="formLoading"
                    type="primary"
                    @click="handleReturn()"
                  >
                    {{
                      getButtonDisplayName(
                        BpmTaskOperationButtonTypeEnum.RETURN,
                      )
                    }}
                  </Button>
                  <Button @click="closePopover('return', returnFormRef)">
                    取消
                  </Button>
                </Space>
              </FormItem>
            </Form>
          </div>
        </template>
      </Popover>

      <!-- 【取消】按钮 -->
      <Popover
        v-if="
          userId === processInstance?.startUser?.id
            && !isEndProcessStatus(processInstance?.status)
        "
        v-model:open="popOverVisible.cancel"
        placement="top"
        :width="500"
        trigger="click"
      >
        <Button type="dashed" @click="openPopover('cancel')">
          <Icon :size="14" icon="icon-park-outline:back" />
          取消
        </Button>
        <template #content>
          <div
            v-loading="formLoading"
            class="w-96 flex flex-1 flex-col px-5 pt-5"
          >
            <Form
              ref="cancelFormRef"
              layout="vertical"
              class="mb-auto"
              :model="cancelForm"
              :rules="cancelFormRule"
              label-width="100px"
            >
              <FormItem label="取消理由" name="cancelReason">
                <Alert
                  class="mb-2 text-xs"
                  type="warning"
                  size="small"
                  show-icon
                  message="友情提醒：取消后，该审批流程将自动结束。"
                />
                <Textarea
                  v-model:value="cancelForm.cancelReason"
                  allow-clear
                  placeholder="请输入取消理由"
                  :rows="3"
                />
              </FormItem>
              <FormItem :wrapper-col="{ span: 18, offset: 0 }">
                <Space>
                  <Button
                    :disabled="formLoading"
                    type="primary"
                    @click="handleCancel()"
                  >
                    确认
                  </Button>

                  <Button @click="closePopover('cancel', cancelFormRef)">
                    取消
                  </Button>
                </Space>
              </FormItem>
            </Form>
          </div>
        </template>
      </Popover>
      <!-- 【再次提交】 按钮 -->
      <Button
        v-if="
          userId === processInstance?.startUser?.id
            && isEndProcessStatus(processInstance?.status)
            && processDefinition?.formType === 10
        "
        type="dashed"
        @click="handleReCreate()"
      >
        <Icon :size="14" icon="lucide:refresh-cw" /> 再次提交
      </Button>
    </Space>
  </div>

  <!-- 签名弹窗 -->
  <Signature @register="registerSignatureModal" @success="handleSignFinish" />
</template>
