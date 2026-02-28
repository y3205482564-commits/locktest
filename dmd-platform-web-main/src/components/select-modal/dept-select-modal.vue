<script lang="ts" setup>
// TODO @芋艿：是否有更好的组织形式？！
import type { DataNode } from 'ant-design-vue/es/tree';

import { ref } from 'vue';

import { Card, Col, Row, Tree } from 'ant-design-vue';

import { BasicModal, useModalInner } from '@/components/Modal';
import { handleTree } from '@/utils/tree';
import type { DeptVO } from '@/api/system/dept';
import { getSimpleDeptList } from '@/api/system/dept';

defineOptions({ name: 'DeptSelectModal' });

const props = withDefaults(
  defineProps<{
    cancelText?: string
    checkStrictly?: boolean
    confirmText?: string
    multiple?: boolean
    title?: string
  }>(),
  {
    cancelText: '取消',
    checkStrictly: false,
    confirmText: '确认',
    multiple: true,
    title: '部门选择',
  },
);

const emit = defineEmits<{
  (e: 'confirm', deptList: DeptVO[]): void
  (e: 'success'): void
  (e: 'register', ...args: any[]): void
}>();

interface CheckedKeysObj {
  checked: number[]
  halfChecked: number[]
}

type CheckedKeys = number[] | CheckedKeysObj;

// 部门树形结构
const deptTree = ref<DataNode[]>([]);
// 选中的部门 ID 列表
const selectedDeptIds = ref<CheckedKeys>([]);
// 部门数据
const deptData = ref<DeptVO[]>([]);

// 对话框配置 - 使用 vben-admin2 的 useModalInner
const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
  deptTree.value = [];
  selectedDeptIds.value = [];
  setModalProps({ confirmLoading: true });
  try {
    deptData.value = await getSimpleDeptList();
    deptTree.value = handleTree(deptData.value) as DataNode[];
    // 设置已选择的部门
    if (data?.selectedList?.length) {
      const selectedIds = data.selectedList
        .map((dept: DeptVO) => dept.id)
        .filter((id: number) => id !== undefined);
      selectedDeptIds.value = props.checkStrictly
        ? {
            checked: selectedIds,
            halfChecked: [],
          }
        : selectedIds;
    }
  } finally {
    setModalProps({ confirmLoading: false });
  }
});

/** 处理确认 */
async function handleConfirm() {
  // 获取选中的部门ID
  const selectedIds: number[] = Array.isArray(selectedDeptIds.value)
    ? selectedDeptIds.value
    : selectedDeptIds.value.checked || [];
  const deptArray = deptData.value.filter((dept) =>
    selectedIds.includes(dept.id!),
  );
  emit('confirm', deptArray);
  closeModal();
}

/** 处理选中状态变化 */
function handleCheck() {
  if (!props.multiple) {
    // 单选模式下，只保留最后选择的节点
    if (Array.isArray(selectedDeptIds.value)) {
      const lastSelectedId
        = selectedDeptIds.value[selectedDeptIds.value.length - 1];
      if (lastSelectedId) {
        selectedDeptIds.value = [lastSelectedId];
      }
    } else {
      // checkStrictly 为 true 时，selectedDeptIds 是一个对象
      const checked = selectedDeptIds.value.checked || [];
      if (checked.length > 0) {
        const lastSelectedId = checked[checked.length - 1];
        selectedDeptIds.value = {
          checked: [lastSelectedId!],
          halfChecked: [],
        };
      }
    }
  }
}
</script>

<template>
  <BasicModal
    v-bind="$attrs"
    :title="props.title"
    width="40%"
    @register="registerModal"
    @ok="handleConfirm"
  >
    <Row class="h-full">
      <Col :span="24">
        <Card class="h-full">
          <Tree
            v-if="deptTree.length > 0"
            v-model:checked-keys="selectedDeptIds"
            :tree-data="deptTree"
            :checkable="true"
            :check-strictly="checkStrictly"
            :field-names="{ title: 'name', key: 'id' }"
            :default-expand-all="true"
            @check="handleCheck"
          />
        </Card>
      </Col>
    </Row>
  </BasicModal>
</template>
