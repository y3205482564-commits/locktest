<script lang="ts" setup>
import { onActivated, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { cloneDeep } from 'lodash-es';
import { Button, Card, Dropdown, Input, Menu, message } from 'ant-design-vue';

import { useSortable } from '@vueuse/integrations/useSortable';
import CategoryForm from '../category/modules/form.vue';
import CategoryDraggableModel from './modules/category-draggable-model.vue';
import { useModal } from '@/components/Modal';
import { Icon } from '@/components/Icon';
import type { ModelCategoryInfo } from '@/api/bpm/model';

import { getCategorySimpleList, updateCategorySortBatch } from '@/api/bpm/category';
import { getModelList } from '@/api/bpm/model';

defineOptions({ name: 'BpmModel' });

const router = useRouter();
const [registerCategoryFormModal, { openModal: openCategoryFormModal }] = useModal();

const modelListSpinning = ref(false); // 模型列表加载状态
const saveSortLoading = ref(false); // 保存排序状态
const categoryGroup = ref<ModelCategoryInfo[]>([]); // 按照 category 分组的数据
const originalData = ref<ModelCategoryInfo[]>([]); // 未排序前的原始数据
const categoryGroupRef = ref<HTMLElement>(); // 可以排序元素的容器
const isCategorySorting = ref(false); // 分类排序状态
const sortableInstance = ref<any>(null); // 排序引用，以便后续启用或禁用排序

/** 监听分类排序模式切换 */
watch(
  () => isCategorySorting.value,
  (newValue) => {
    if (sortableInstance.value) {
      if (newValue) {
        // 启用排序功能
        sortableInstance.value.option('disabled', false);
      } else {
        // 禁用排序功能
        sortableInstance.value.option('disabled', true);
      }
    }
  },
);

const queryParams = reactive({
  name: '',
}); // 查询参数

/** 加载数据 */
async function getList() {
  modelListSpinning.value = true;
  try {
    const modelList = await getModelList(queryParams.name);
    const categoryList = await getCategorySimpleList();
    // 按照 category 聚合
    categoryGroup.value = categoryList.map((category: any) => ({
      ...category,
      modelList: modelList.filter(
        (model: any) => model.categoryName === category.name,
      ),
    }));
    // 重置排序实例
    sortableInstance.value = null;
  } finally {
    modelListSpinning.value = false;
  }
}

/** 初始化 */
onActivated(() => {
  getList();
});

/** 新增模型 */
function createModel() {
  router.push({
    name: 'BpmModelCreate',
  });
}

/** 处理下拉菜单命令 */
function handleCommand(command: string) {
  // 新建流程分类
  if (command === 'handleCategoryAdd') {
    openCategoryFormModal(true, { isUpdate: false });
  } else if (command === 'handleCategorySort') {
    // 分类排序
    originalData.value = cloneDeep(categoryGroup.value);
    isCategorySorting.value = true;
    // 如果排序实例不存在，则初始化
    if (sortableInstance.value) {
      // 已存在实例，则启用排序功能
      sortableInstance.value.option('disabled', false);
    } else {
      sortableInstance.value = useSortable(categoryGroupRef.value, categoryGroup, {
        disabled: false, // 启用排序
      });
    }
  }
}

/** 取消分类排序 */
function handleCategorySortCancel() {
  // 恢复初始数据
  categoryGroup.value = cloneDeep(originalData.value);
  isCategorySorting.value = false;
  // 直接禁用排序功能
  if (sortableInstance.value) {
    sortableInstance.value.option('disabled', true);
  }
}

/** 提交分类排序 */
async function handleCategorySortSubmit() {
  saveSortLoading.value = true;
  try {
    // 保存排序逻辑
    const ids = categoryGroup.value.map((item: any) => item.id);
    await updateCategorySortBatch(ids);
    message.success('分类排序成功');
  } finally {
    saveSortLoading.value = false;
  }
  isCategorySorting.value = false;
  // 刷新列表
  await getList();
  // 禁用排序功能
  if (sortableInstance.value) {
    sortableInstance.value.option('disabled', true);
  }
}
</script>

<template>
  <div class="p-4">
    <!-- 流程分类表单弹窗 -->
    <CategoryForm @register="registerCategoryFormModal" @success="getList" />
    <Card
      :body-style="{ padding: '10px' }"
      class="mb-4"
      title="流程模型"
      :loading="modelListSpinning"
    >
      <template #extra>
        <div v-if="!isCategorySorting">
          <Input
            v-model:value="queryParams.name"
            placeholder="搜索流程"
            allow-clear
            class="!w-60"
            @press-enter="getList"
          />
          <Button class="ml-2" type="primary" @click="createModel">
            <Icon icon="ant-design:plus-outlined" /> 新建模型
          </Button>
          <Dropdown class="ml-2" placement="bottomRight" arrow>
            <Button>
              <template #icon>
                <div class="flex items-center justify-center">
                  <Icon icon="ant-design:setting-outlined" />
                </div>
              </template>
            </Button>
            <template #overlay>
              <Menu @click="(e) => handleCommand(e.key as string)">
                <Menu.Item key="handleCategoryAdd">
                  <div class="flex items-center gap-1">
                    <Icon icon="ant-design:plus-outlined" />
                    新建分类
                  </div>
                </Menu.Item>
                <Menu.Item key="handleCategorySort">
                  <div class="flex items-center gap-1">
                    <Icon icon="ant-design:sort-ascending-outlined" />
                    分类排序
                  </div>
                </Menu.Item>
              </Menu>
            </template>
          </Dropdown>
        </div>
        <div v-else class="h-full flex items-center justify-between">
          <Button class="mr-3" @click="handleCategorySortCancel">
            取 消
          </Button>
          <Button
            type="primary"
            :loading="saveSortLoading"
            @click="handleCategorySortSubmit"
          >
            保存排序
          </Button>
        </div>
      </template>

      <!-- 按照分类，展示其所属的模型列表 -->
      <div ref="categoryGroupRef" class="px-3">
        <CategoryDraggableModel
          v-for="(element, index) in categoryGroup"
          :key="element.id"
          :class="isCategorySorting ? 'cursor-move' : ''"
          :category-info="element"
          :is-category-sorting="isCategorySorting"
          :is-first="index === 0"
          @success="getList"
        />
      </div>
    </Card>
  </div>
</template>
