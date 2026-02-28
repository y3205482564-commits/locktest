<script setup lang="ts">
import type { Editor, RawEditorSettings } from 'tinymce';

import { computed, nextTick, onBeforeUnmount, onDeactivated, ref, unref, watch } from 'vue';

import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/silver';
import 'tinymce/icons/default/icons';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/code';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/paste';

import { Alert } from 'ant-design-vue';

import type { MentionItem } from '../modules/tinymce-plugin';

import { setupTinyPlugins } from './tinymce-plugin';
import { BasicModal, useModalInner } from '@/components/Modal';
import { buildShortUUID } from '@/utils/uuid';
import { useAppStore } from '@/store/modules/app';

const props = withDefaults(
  defineProps<{
    formFields?: Array<{ field: string, title: string }>
  }>(),
  {
    formFields: () => [],
  },
);

const emits = defineEmits<{
  (e: 'confirm', value: string): void
}>();

const appStore = useAppStore();
const valueHtml = ref<string>('');
const editorRef = ref<Nullable<Editor>>(null);
const tinymceId = ref<string>(buildShortUUID('tiny-print'));
const elRef = ref<Nullable<HTMLElement>>(null);
const isModalOpen = ref(false);

const [registerModal, { setModalProps, closeModal }] = useModalInner((data: { template?: string }) => {
  setModalProps({ confirmLoading: false });
  isModalOpen.value = true;
  if (data?.template !== undefined) {
    valueHtml.value = data.template;
  }
  // 弹窗打开后初始化编辑器
  nextTick(() => {
    setTimeout(() => {
      initEditor();
    }, 100);
  });
});

/** 确认提交 */
function handleConfirm() {
  // 获取编辑器内容
  const editor = unref(editorRef);
  if (editor) {
    valueHtml.value = editor.getContent();
  }
  emits('confirm', valueHtml.value);
  closeModal();
  isModalOpen.value = false;
  destroyEditor();
}

const mentionList = computed<MentionItem[]>(() => {
  const base: MentionItem[] = [
    { id: 'startUser', name: '发起人' },
    { id: 'startUserDept', name: '发起人部门' },
    { id: 'processName', name: '流程名称' },
    { id: 'processNum', name: '流程编号' },
    { id: 'startTime', name: '发起时间' },
    { id: 'endTime', name: '结束时间' },
    { id: 'processStatus', name: '流程状态' },
    { id: 'printUser', name: '打印人' },
    { id: 'printTime', name: '打印时间' },
  ];

  const extras: MentionItem[] = (props.formFields || []).map((it: any) => ({
    id: it.field,
    name: `[表单]${it.title}`,
  }));
  return [...base, ...extras];
});

/** 皮肤名称 */
const skinName = computed(() => {
  return appStore.getDarkMode === 'light' ? 'oxide' : 'oxide-dark';
});

/** 编辑器初始化配置 */
const initOptions = computed((): RawEditorSettings => {
  const publicPath = import.meta.env.VITE_PUBLIC_PATH || '/';
  return {
    selector: `#${unref(tinymceId)}`,
    height: 400,
    menubar: false,
    plugins: 'link lists code preview autoresize insertdatetime paste',
    toolbar:
      'undo redo | styles fontsize | bold italic underline | alignleft aligncenter alignright | link | processrecord code preview',
    language_url: `${publicPath}resource/tinymce/langs/zh_CN.js`,
    language: 'zh_CN',
    branding: false,
    statusbar: true,
    skin: skinName.value,
    skin_url: `${publicPath}resource/tinymce/skins/ui/${skinName.value}`,
    content_css: `${publicPath}resource/tinymce/skins/ui/${skinName.value}/content.min.css`,
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
    setup: (editor: Editor) => {
      editorRef.value = editor;
      // 注册自定义插件（流程记录按钮和 @ 自动补全）
      setupTinyPlugins(editor, () => mentionList.value);
      editor.on('init', () => {
        // 设置初始内容
        editor.setContent(valueHtml.value || '');
      });
    },
  };
});

/** 初始化编辑器 */
function initEditor() {
  const el = unref(elRef);
  if (el) {
    el.style.visibility = '';
  }
  tinymce
    .init(unref(initOptions))
    .then(() => {
      // 编辑器初始化完成
    })
    .catch((err) => {
      console.error('TinyMCE init error:', err);
    });
}

/** 销毁编辑器 */
function destroyEditor() {
  if (tinymce !== null) {
    tinymce?.remove?.(unref(initOptions).selector!);
  }
  editorRef.value = null;
}

/** 监听弹窗关闭 */
watch(
  () => isModalOpen.value,
  (val) => {
    if (!val) {
      destroyEditor();
    }
  },
);

onBeforeUnmount(() => {
  destroyEditor();
});

onDeactivated(() => {
  destroyEditor();
});
</script>

<template>
  <BasicModal
    title="自定义模板"
    width="75%"
    @register="registerModal"
    @ok="handleConfirm"
  >
    <div class="mb-3">
      <Alert
        message="输入 @ 可选择插入流程选项和表单选项"
        type="info"
        show-icon
      />
    </div>
    <div class="tinymce-print-container">
      <textarea :id="tinymceId" ref="elRef" :style="{ visibility: 'hidden' }" />
    </div>
  </BasicModal>
</template>

<style scoped>
.tinymce-print-container {
  position: relative;
  line-height: normal;
}

.tinymce-print-container textarea {
  z-index: -1;
  visibility: hidden;
}
</style>
