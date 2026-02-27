<script lang="ts" setup>
import { ref } from 'vue';
import { Button, Space, Tooltip } from 'ant-design-vue';
import Vue3Signature from 'vue3-signature';

import { Icon } from '@/components/Icon';
import { BasicModal, useModal } from '@/components/Modal';
import { uploadFile } from '@/api/infra/file';

defineOptions({
  name: 'BpmProcessInstanceSignature',
});

const emits = defineEmits(['success']);

const signature = ref<InstanceType<typeof Vue3Signature>>();

/** base64 转 File */
function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',');
  const mime = arr[0]?.match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1] || '');
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

const [registerModal, { closeModal, setModalProps }] = useModal();

async function handleConfirm() {
  setModalProps({ confirmLoading: true });
  try {
    const signFileUrl = await uploadFile({
      file: base64ToFile(signature?.value?.save('image/jpeg') || '', '签名'),
    });
    emits('success', signFileUrl);
    closeModal();
  } finally {
    setModalProps({ confirmLoading: false });
  }
}

defineExpose({ registerModal });
</script>

<template>
  <BasicModal
    title="流程签名"
    width="60%"
    :show-cancel-btn="true"
    :show-ok-btn="true"
    @register="registerModal"
    @ok="handleConfirm"
  >
    <div class="mb-2 flex justify-end">
      <Space>
        <Tooltip title="撤销上一步操作">
          <Button @click="signature?.undo()">
            <template #icon>
              <Icon icon="lucide:undo" class="size-4 mb-1" />
            </template>
            撤销
          </Button>
        </Tooltip>
        <Tooltip title="清空画布">
          <Button @click="signature?.clear()">
            <template #icon>
              <Icon icon="lucide:trash" class="size-4 mb-1" />
            </template>
            <span>清除</span>
          </Button>
        </Tooltip>
      </Space>
    </div>

    <Vue3Signature
      ref="signature"
      class="mx-auto border border-gray-300 border-solid !h-80"
    />
  </BasicModal>
</template>
