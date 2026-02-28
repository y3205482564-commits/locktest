<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form';
import type { SelectValue } from 'ant-design-vue/es/select';
import type { PropType } from 'vue';

import { ref, watch } from 'vue';

import {
  Avatar,
  Button,
  Form,
  Input,
  Radio,
  Select,
  Tooltip,
} from 'ant-design-vue';

import type { CategoryVO } from '@/api/bpm/category';
import { DeptSelectModal, UserSelectModal } from '@/components/select-modal';

import { Icon } from '@/components/Icon';
import { useModal } from '@/components/Modal';
import { DICT_TYPE, getDictOptions } from '@/utils/dict';

// TODO: 项目中如果有 ImageUpload 组件请调整路径，或使用 Upload 组件替代
// import { ImageUpload } from '@/components/Upload';

// TODO: 项目中如果有 UserSelectModal, DeptSelectModal 组件请调整路径
// 临时注释掉以避免编译错误，并使用内联选择替代

const props = defineProps({
  categoryList: {
    type: Array as PropType<CategoryVO[]>,
    required: true,
  },
  userList: {
    type: Array as PropType<any[]>,
    required: true,
  },
  deptList: {
    type: Array as PropType<any[]>,
    required: true,
  },
});

// TODO: 需要根据项目实际情况实现用户和部门选择弹窗
const [_registerUserSelectModal, { openModal: openUserSelectModal }] = useModal();
const [_registerDeptSelectModal, { openModal: openDeptSelectModal }] = useModal();

const formRef = ref(); // 表单引用
const modelData = defineModel<any>(); // 创建本地数据副本

const selectedStartUsers = ref<any[]>([]); // 选中的发起人
const selectedStartDepts = ref<any[]>([]); // 选中的发起部门

const selectedManagerUsers = ref<any[]>([]); // 选中的流程管理员
const currentSelectType = ref<'manager' | 'start'>('start');
const selectedUsers = ref<number[]>(); // 选中的用户
const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '流程名称不能为空', trigger: 'blur' }],
  key: [
    { required: true, message: '流程标识不能为空', trigger: 'blur' },
    {
      validator: (_rule: any, value: string, callback: any) => {
        if (!value) {
          callback();
          return;
        }
        if (!/^[a-z_][-\w.$]*$/i.test(value)) {
          callback(
            new Error(
              '只能包含字母、数字、下划线、连字符和点号，且必须以字母或下划线开头',
            ),
          );
          return;
        }
        callback();
      },
      trigger: 'blur',
    },
  ],
  category: [{ required: true, message: '流程分类不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '流程类型不能为空', trigger: 'blur' }],
  visible: [{ required: true, message: '是否可见不能为空', trigger: 'blur' }],
  managerUserIds: [
    { required: true, message: '流程管理员不能为空', trigger: 'blur' },
  ],
};

/** 初始化选中的用户 */
watch(
  () => modelData.value,
  (newVal) => {
    selectedStartUsers.value = newVal.startUserIds?.length
      ? (props.userList.filter((user: any) =>
          newVal.startUserIds.includes(user.id),
        ) as any[])
      : [];
    selectedStartDepts.value = newVal.startDeptIds?.length
      ? (props.deptList.filter((dept: any) =>
          newVal.startDeptIds.includes(dept.id),
        ) as any[])
      : [];
    selectedManagerUsers.value = newVal.managerUserIds?.length
      ? (props.userList.filter((user: any) =>
          newVal.managerUserIds.includes(user.id),
        ) as any[])
      : [];
  },
  {
    immediate: true,
  },
);

/** 打开发起人选择 */
function openStartUserSelect() {
  currentSelectType.value = 'start';
  selectedUsers.value = selectedStartUsers.value.map(
    (user) => user.id,
  ) as number[];
  // TODO: 调用用户选择弹窗
  openUserSelectModal(true, { userIds: selectedUsers.value });
}

/** 打开部门选择 */
function openStartDeptSelect() {
  // TODO: 调用部门选择弹窗
  openDeptSelectModal(true, { selectedList: selectedStartDepts.value });
}

/** 处理部门选择确认 */
function handleDeptSelectConfirm(depts: any[]) {
  modelData.value = {
    ...modelData.value,
    startDeptIds: depts.map((d) => d.id),
  };
}

/** 打开管理员选择 */
function openManagerUserSelect() {
  currentSelectType.value = 'manager';
  selectedUsers.value = selectedManagerUsers.value.map(
    (user) => user.id,
  ) as number[];
  // TODO: 调用用户选择弹窗
  openUserSelectModal(true, { userIds: selectedUsers.value });
}

/** 处理用户选择确认 */
function handleUserSelectConfirm(userList: any[]) {
  modelData.value
    = currentSelectType.value === 'start'
      ? {
          ...modelData.value,
          startUserIds: userList.map((u) => u.id),
        }
      : {
          ...modelData.value,
          managerUserIds: userList.map((u) => u.id),
        };
}

/** 用户选择弹窗关闭 */
function handleUserSelectClosed() {
  selectedUsers.value = [];
}

/** 用户选择弹窗取消 */
function handleUserSelectCancel() {
  selectedUsers.value = [];
}

/** 处理发起人类型变化 */
function handleStartUserTypeChange(value: SelectValue) {
  const numValue = Number(value);
  switch (numValue) {
    case 0: {
      modelData.value = {
        ...modelData.value,
        startUserIds: [],
        startDeptIds: [],
      };
      break;
    }
    case 1: {
      modelData.value = {
        ...modelData.value,
        startDeptIds: [],
      };
      break;
    }
    case 2: {
      modelData.value = {
        ...modelData.value,
        startUserIds: [],
      };
      break;
    }
  }
}

/** 移除发起人 */
function handleRemoveStartUser(user: any) {
  modelData.value = {
    ...modelData.value,
    startUserIds: modelData.value.startUserIds.filter(
      (id: number) => id !== user.id,
    ),
  };
}

/** 移除部门 */
function handleRemoveStartDept(dept: any) {
  modelData.value = {
    ...modelData.value,
    startDeptIds: modelData.value.startDeptIds.filter(
      (id: number) => id !== dept.id,
    ),
  };
}

/** 移除管理员 */
function handleRemoveManagerUser(user: any) {
  modelData.value = {
    ...modelData.value,
    managerUserIds: modelData.value.managerUserIds.filter(
      (id: number) => id !== user.id,
    ),
  };
}

/** 表单校验 */
async function validate() {
  await formRef.value?.validate();
}

defineExpose({ validate });
</script>

<template>
  <div>
    <Form
      ref="formRef"
      :model="modelData"
      :rules="rules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
    >
      <Form.Item label="流程标识" name="key">
        <div class="flex items-center">
          <Input
            v-model:value="modelData.key"
            class="w-full"
            :disabled="!!modelData.id"
            placeholder="请输入流程标识，以字母或下划线开头"
          />
          <Tooltip
            :title="
              modelData.id ? '流程标识不可修改！' : '新建后，流程标识不可修改！'
            "
            placement="top"
          >
            <Icon icon="lucide:circle-help" class="size-5 ml-1" />
          </Tooltip>
        </div>
      </Form.Item>
      <Form.Item label="流程名称" name="name">
        <Input
          v-model:value="modelData.name"
          :disabled="!!modelData.id"
          allow-clear
          placeholder="请输入流程名称"
        />
      </Form.Item>
      <Form.Item label="流程分类" name="category">
        <Select
          v-model:value="modelData.category"
          class="w-full"
          allow-clear
          placeholder="请选择流程分类"
        >
          <Select.Option
            v-for="category in categoryList"
            :key="category.code"
            :value="category.code"
          >
            {{ category.name }}
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="流程图标">
        <!-- TODO: 流程图标上传组件，项目中如果有 ImageUpload 组件请调整 -->
        <Input v-model:value="modelData.icon" placeholder="请输入图标URL" allow-clear />
      </Form.Item>
      <Form.Item label="流程描述" name="description">
        <Input.TextArea v-model:value="modelData.description" allow-clear />
      </Form.Item>
      <Form.Item label="流程类型" name="type">
        <Radio.Group v-model:value="modelData.type">
          <Radio
            v-for="dict in getDictOptions(DICT_TYPE.BPM_MODEL_TYPE, 'number')"
            :key="dict.value as number"
            :value="dict.value"
          >
            {{ dict.label }}
          </Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="是否可见" name="visible">
        <Radio.Group v-model:value="modelData.visible">
          <Radio
            v-for="dict in getDictOptions(
              DICT_TYPE.INFRA_BOOLEAN_STRING,
              'boolean',
            )"
            :key="dict.label"
            :value="dict.value"
          >
            {{ dict.label }}
          </Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="谁可以发起" name="startUserType">
        <Select
          v-model:value="modelData.startUserType"
          placeholder="请选择谁可以发起"
          @change="handleStartUserTypeChange"
        >
          <Select.Option :value="0">
            全员
          </Select.Option>
          <Select.Option :value="1">
            指定人员
          </Select.Option>
          <Select.Option :value="2">
            指定部门
          </Select.Option>
        </Select>
        <div
          v-if="modelData.startUserType === 1"
          class="mt-2 flex flex-wrap gap-1"
        >
          <div
            v-for="user in selectedStartUsers"
            :key="user.id"
            class="relative h-8 flex items-center rounded-lg bg-gray-100 pr-2 dark:border dark:border-gray-500 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Avatar v-if="user.avatar" class="size-7 m-1" :src="user.avatar" />
            <Avatar v-else class="size-7 m-1">
              {{ user.nickname?.substring(0, 1) }}
            </Avatar>
            <span class="text-gray-700 dark:text-gray-200">
              {{ user.nickname }}
            </span>
            <Icon
              icon="lucide:x"
              class="size-4 ml-2 cursor-pointer text-gray-400 dark:text-gray-200 hover:text-red-500"
              @click="handleRemoveStartUser(user)"
            />
          </div>
          <Button
            type="link"
            class="flex items-center"
            @click="openStartUserSelect"
          >
            <template #icon>
              <Icon icon="lucide:user-plus" class="size-4" />
            </template>
            选择人员
          </Button>
        </div>
        <div
          v-if="modelData.startUserType === 2"
          class="mt-2 flex flex-wrap gap-1"
        >
          <div
            v-for="dept in selectedStartDepts"
            :key="dept.id"
            class="relative h-8 flex items-center rounded-lg bg-gray-100 pr-2 shadow-sm dark:border dark:border-gray-500 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Icon icon="lucide:building" class="size-6 px-1" />
            <span class="text-gray-700 dark:text-gray-200">
              {{ dept.name }}
            </span>
            <Icon
              icon="lucide:x"
              class="size-4 ml-2 cursor-pointer text-gray-400 hover:text-red-500"
              @click="handleRemoveStartDept(dept)"
            />
          </div>
          <Button
            type="link"
            class="flex items-center"
            @click="openStartDeptSelect"
          >
            <template #icon>
              <Icon icon="lucide:user-plus" class="size-4" />
            </template>
            选择部门
          </Button>
        </div>
      </Form.Item>
      <Form.Item label="流程管理员" name="managerUserIds">
        <div class="flex flex-wrap gap-1">
          <div
            v-for="user in selectedManagerUsers"
            :key="user.id"
            class="relative h-9 flex items-center rounded-full bg-gray-100 pr-2 dark:border dark:border-gray-500 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Avatar v-if="user.avatar" class="size-7 m-1" :src="user.avatar" />
            <Avatar v-else class="size-7 m-1">
              {{ user.nickname?.substring(0, 1) }}
            </Avatar>
            <span class="text-gray-700 dark:text-gray-200">
              {{ user.nickname }}
            </span>
            <Icon
              icon="lucide:x"
              class="size-4 ml-2 cursor-pointer text-gray-400 hover:text-red-500"
              @click="handleRemoveManagerUser(user)"
            />
          </div>
          <Button
            type="link"
            class="flex items-center"
            @click="openManagerUserSelect"
          >
            <template #icon>
              <Icon icon="lucide:user-plus" class="size-4" />
            </template>
            选择人员
          </Button>
        </div>
      </Form.Item>
    </Form>

    <!-- TODO: 用户选择弹窗，项目中需要实现或使用已有的用户选择组件 -->
    <UserSelectModal
      v-model:value="selectedUsers" class="w-3/5"
      :multiple="true"
      @register="_registerUserSelectModal"
      @confirm="handleUserSelectConfirm"
      @closed="handleUserSelectClosed"
      @cancel="handleUserSelectCancel"
    />
    <DeptSelectModal
      class="w-3/5" :check-strictly="true"
      @register="_registerDeptSelectModal" @confirm="handleDeptSelectConfirm"
    />
  </div>
</template>
