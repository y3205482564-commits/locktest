<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import type { TreeItem } from '@/components/Tree'
import { BasicTree } from '@/components/Tree'
import { listSimpleStationRoom } from '@/api/room/stationRoom/stationRoom'
import { handleTree } from '@/utils/tree'

defineOptions({ name: 'SystemStationRoomTree' })

// 定义事件：选中站室ID
const emit = defineEmits(['select'])
const treeRef = ref()
const treeData = ref<TreeItem[]>([])

// 加载站室树形数据（复用部门树的handleTree工具函数）
async function fetchStationRoomTree() {
  const res = await listSimpleStationRoom()
  // 补充根节点（全部站室）
  const rootNode = { id: '0', name: '全部站室', children: handleTree(res, 'id') };
  treeData.value = [rootNode];
}

// 站室选择事件（与部门树逻辑一致）
function handleSelect(keys) {
  emit('select', keys[0])
}

// 组件挂载后加载数据
onMounted(() => {
  fetchStationRoomTree()
})
</script>

<template>
  <div class="m-4 mr-0 overflow-hidden" v-bind="$attrs">
    <BasicTree
      ref="treeRef"
      title="站室列表"
      toolbar
      search
      tree-wrapper-class-name="h-[calc(100%-35px)] overflow-auto"
      :click-row-to-expand="false"
      :tree-data="treeData"
      :field-names="{ key: 'id', title: 'name' }"
      @select="handleSelect"
    />
  </div>
</template>
