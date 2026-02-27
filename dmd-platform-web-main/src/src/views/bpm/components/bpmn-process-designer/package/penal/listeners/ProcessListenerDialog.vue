<!-- 执行器选择 -->
<script setup lang="ts">
import { reactive, ref } from 'vue';

import { Button, Modal, Pagination, Table } from 'ant-design-vue';

// TODO: 以下 API 在当前项目中可能不存在，需要根据实际情况创建
// import type { BpmProcessListenerApi } from '@/api/bpm/processListener';
// import { getProcessListenerPage } from '@/api/bpm/processListener';

import { CommonStatusEnum } from '@/enums/systemEnum';
import { DICT_TYPE } from '@/utils/dict';
import { DictTag } from '@/components/DictTag';

// 临时类型定义
interface ProcessListener {
  id: number
  name: string
  type: string
  event: string
  valueType: string
  value: string
}

/** BPM 流程 表单 */
defineOptions({ name: 'ProcessListenerDialog' });

/** 提交表单 */
const emit = defineEmits(['success', 'select']);
const dialogVisible = ref(false); // 弹窗的是否展示
const loading = ref(true); // 列表的加载中
const list = ref<ProcessListener[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  type: '',
  status: CommonStatusEnum.ENABLE,
});

/** 打开弹窗 */
const open = async (type: string) => {
  queryParams.pageNo = 1;
  queryParams.type = type;
  await getList();
  dialogVisible.value = true;
};
defineExpose({ open }); // 提供 open 方法，用于打开弹窗

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    // TODO: 需要创建 API 文件 @/api/bpm/processListener
    // const data = await getProcessListenerPage(queryParams);
    // list.value = data.list;
    // total.value = data.total;
    console.warn('getProcessListenerPage API 未实现');
  } finally {
    loading.value = false;
  }
};

// 定义 success 事件，用于操作成功后的回调
const select = async (row: ProcessListener) => {
  dialogVisible.value = false;
  // 发送操作成功的事件
  emit('select', row);
};
</script>

<template>
  <Modal
    v-model:open="dialogVisible"
    title="请选择监听器"
    width="1024px"
    :footer="null"
  >
    <div>
      <Table
        :loading="loading"
        :data-source="list"
        :pagination="false"
        :scroll="{ x: 'max-content' }"
      >
        <Table.Column title="名字" align="center" data-index="name" />
        <Table.Column title="类型" align="center" data-index="type">
          <template #default="{ record }">
            <DictTag
              :type="(DICT_TYPE as any).BPM_PROCESS_LISTENER_TYPE"
              :value="record.type"
            />
          </template>
        </Table.Column>
        <Table.Column title="事件" align="center" data-index="event" />
        <Table.Column title="值类型" align="center" data-index="valueType">
          <template #default="{ record }">
            <DictTag
              :type="(DICT_TYPE as any).BPM_PROCESS_LISTENER_VALUE_TYPE"
              :value="record.valueType"
            />
          </template>
        </Table.Column>
        <Table.Column title="值" align="center" data-index="value" />
        <Table.Column title="操作" align="center" fixed="right">
          <template #default="{ record }">
            <Button type="primary" @click="select(record)">
              选择
            </Button>
          </template>
        </Table.Column>
      </Table>
      <!-- 分页 -->
      <div class="mt-4 flex justify-end">
        <Pagination
          v-model:current="queryParams.pageNo"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          show-size-changer
          @change="getList"
        />
      </div>
    </div>
  </Modal>
</template>
