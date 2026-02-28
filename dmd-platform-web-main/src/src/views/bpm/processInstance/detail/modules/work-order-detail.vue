<!-- src/views/bpm/processInstance/modules/work-order-detail.vue -->
<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { Spin } from 'ant-design-vue';
import { DICT_TYPE } from '@/utils/dict';
// 导入封装好的工单API
import { getRepairEntrustOrderByInternalCode, WorkOrderApi } from '@/api/bpm/workOrder';

// 定义组件Props（接收父组件传递的参数）
const props = defineProps<{
  workOrderId?: string; // 工单内码（从父组件传递，对应后端internalCode）
  loading?: boolean; // 父组件的加载状态（可选）
}>();

// 组件内部响应式变量
const innerLoading = ref(false); // 组件内部加载状态
// 工单详情数据（强类型定义）
const workOrderDetail = ref<WorkOrderApi.RepairEntrustOrderVO>({} as WorkOrderApi.RepairEntrustOrderVO);
const workOrderError = ref(''); // 错误信息

/**
 * 核心方法：请求工单详情
 */
async function fetchWorkOrderDetail() {
  // 1. 校验工单内码
  if (!props.workOrderId) {
    workOrderError.value = '未传入工单内码';
    workOrderDetail.value = {} as WorkOrderApi.RepairEntrustOrderVO;
    return;
  }

  // workOrderId设置固定值8a8f80818b8c8d8e8f8a8b8c8d8e8f8a



  // 2. 发起请求
  innerLoading.value = true;
  workOrderError.value = '';
  try {
    const res = await getRepairEntrustOrderByInternalCode(props.workOrderId);
    // const res = await getRepairEntrustOrderByInternalCode('8a8f80818b8c8d8e8f8a8b8c8d8e8f8a');
    // 后端说明：无数据则返回空，增加空值判断
    if (!res) {
      workOrderError.value = '未查询到该检修委托单信息';
      workOrderDetail.value = {} as WorkOrderApi.RepairEntrustOrderVO;
      return;
    }
    workOrderDetail.value = res;
  } catch (err: any) {
    workOrderError.value = err.message || '获取检修委托单详情失败';
    message.error(workOrderError.value);
  } finally {
    innerLoading.value = false;
  }
}

/**
 * 对外暴露刷新方法（供父组件调用）
 */
defineExpose({
  refresh: fetchWorkOrderDetail
});

// 监听工单内码变化，重新请求数据
watch(
  () => props.workOrderId,
  () => {
    fetchWorkOrderDetail();
  },
  { immediate: true } // 首次加载立即执行
);

// 组件挂载时初始化
onMounted(() => {
  fetchWorkOrderDetail();
});
</script>

<template>
  <div class="h-full flex flex-col gap-4">
    <!-- 加载状态 -->
    <div v-if="innerLoading || loading" class="flex justify-center items-center h-full">
      <Spin size="large" tip="正在加载检修委托单详情..." />
    </div>

    <!-- 错误状态 -->
    <div v-else-if="workOrderError" class="flex justify-center items-center h-full text-red-500">
      {{ workOrderError }}
    </div>

    <!-- 无工单内码 -->
    <div v-else-if="!workOrderId" class="flex justify-center items-center h-full text-gray-500">
      未选择检修委托单
    </div>

    <!-- 检修委托单详情内容 -->
    <div v-else class="flex flex-col gap-6 h-full overflow-auto px-2">
      <!-- 基础信息模块 -->
      <div class="bg-white rounded-lg p-4 shadow-sm">
        <div class="text-lg font-medium mb-4 text-gray-800 border-b pb-2">基础信息</div>
        <div class="grid grid-cols-3 gap-4">
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">内码（主键）</span>
            <span class="text-gray-800">{{ workOrderDetail.internalCode || '暂无' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">委托单编号</span>
            <span class="text-gray-800 font-medium">{{ workOrderDetail.trustId || '暂无' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">单项申请单编号</span>
            <span class="text-gray-800">{{ workOrderDetail.monoApplyformId || '暂无' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">设备编号</span>
            <span class="text-gray-800">{{ workOrderDetail.deviceId || '暂无' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">设备名称</span>
            <span class="text-gray-800">{{ workOrderDetail.deviceName || '暂无' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">项目类型</span>
            <span class="text-gray-800">{{ workOrderDetail.projectType || '暂无' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">委托时间</span>
            <span class="text-gray-800">{{ workOrderDetail.trustTime || '暂无' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">需求日期</span>
            <span class="text-gray-800">{{ workOrderDetail.reqDate || '暂无' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">缓急程度</span>
            <span class="text-gray-800">{{ workOrderDetail.urgentDegree || '暂无' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">委托人岗号(姓名)</span>
            <span class="text-gray-800">{{ workOrderDetail.entrustJobId || '暂无' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">点检岗号(姓名)</span>
            <span class="text-gray-800">{{ workOrderDetail.checkJobId || '暂无' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">记录创建人</span>
            <span class="text-gray-800">{{ workOrderDetail.recCreatorName || '暂无' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">记录创建时间</span>
            <span class="text-gray-800">{{ workOrderDetail.recCreateTime || '暂无' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">审核状态</span>
            <DictTag
              v-if="workOrderDetail.auditStatus"
              :type="DICT_TYPE.REPAIR_AUDIT_STATUS"
              :value="workOrderDetail.auditStatus"
              class="w-fit"
            />
            <span v-else class="text-gray-800">暂无</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">审核人姓名</span>
            <span class="text-gray-800">{{ workOrderDetail.auditUserName || '暂无' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">工单状态</span>
            <DictTag
              v-if="workOrderDetail.status"
              :type="DICT_TYPE.REPAIR_ORDER_STATUS"
              :value="workOrderDetail.status"
              class="w-fit"
            />
            <span v-else class="text-gray-800">暂无</span>
          </div>
        </div>
      </div>

      <!-- 检修信息模块 -->
      <div class="bg-white rounded-lg p-4 shadow-sm">
        <div class="text-lg font-medium mb-4 text-gray-800 border-b pb-2">检修信息</div>
        <div class="grid grid-cols-3 gap-4">
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">请修原因</span>
            <span class="text-gray-800">{{ workOrderDetail.repairReason || '暂无' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">检修类别</span>
            <span class="text-gray-800">{{ workOrderDetail.repairType || '暂无' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">施工类别</span>
            <span class="text-gray-800">{{ workOrderDetail.constructType || '暂无' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">数量</span>
            <span class="text-gray-800">{{ workOrderDetail.num || 0 }} {{ workOrderDetail.numUnit || '' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">总人数</span>
            <span class="text-gray-800">{{ workOrderDetail.totalMans || 0 }} 人</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">总工时</span>
            <span class="text-gray-800">{{ workOrderDetail.totalHour || 0 }} 小时</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">开工日期</span>
            <span class="text-gray-800">{{ workOrderDetail.startDate || '暂无' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">完工日期</span>
            <span class="text-gray-800">{{ workOrderDetail.finishDate || '暂无' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">完工数量</span>
            <span class="text-gray-800">{{ workOrderDetail.finishNum || 0 }} {{ workOrderDetail.numUnit || '' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">建议施工班组</span>
            <span class="text-gray-800">{{ workOrderDetail.suggestConstructTeam || '暂无' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">实际施工班组</span>
            <span class="text-gray-800">{{ workOrderDetail.actSquadCode || '暂无' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">可完工标记</span>
            <span class="text-gray-800">
              {{ workOrderDetail.finishableFlag === 'Y' ? '是' : workOrderDetail.finishableFlag === 'N' ? '否' : '暂无' }}
            </span>
          </div>
        </div>

        <!-- 工作内容（单独一行） -->
        <div class="mt-4 flex flex-col">
          <span class="text-sm text-gray-500 mb-1">工作内容</span>
          <div class="bg-gray-50 p-3 rounded-md text-gray-800 min-h-[80px] whitespace-pre-line">
            {{ workOrderDetail.workContent || '暂无' }}
          </div>
        </div>
      </div>

      <!-- 费用信息模块 -->
      <div class="bg-white rounded-lg p-4 shadow-sm">
        <div class="text-lg font-medium mb-4 text-gray-800 border-b pb-2">费用信息</div>
        <div class="grid grid-cols-3 gap-4">
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">人工费用</span>
            <span class="text-gray-800">¥ {{ (workOrderDetail.manFee || 0).toFixed(2) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">机具费</span>
            <span class="text-gray-800">¥ {{ (workOrderDetail.machinetoolFee || 0).toFixed(2) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">物料费用</span>
            <span class="text-gray-800">¥ {{ (workOrderDetail.smFee || 0).toFixed(2) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">总费用</span>
            <span class="text-gray-800 font-medium text-primary">¥ {{ (workOrderDetail.totalFee || 0).toFixed(2) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">总费用单价（计算用）</span>
            <span class="text-gray-800">¥ {{ (workOrderDetail.globalTotalFee || 0).toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- 回退信息模块（有数据才显示） -->
      <div v-if="workOrderDetail.rebukeStatus || workOrderDetail.fallbackReason" class="bg-white rounded-lg p-4 shadow-sm">
        <div class="text-lg font-medium mb-4 text-gray-800 border-b pb-2">回退信息</div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">回退状态</span>
            <span class="text-gray-800">{{ workOrderDetail.rebukeStatus || '暂无' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500 mb-1">回退原因</span>
            <span class="text-gray-800 whitespace-pre-line">{{ workOrderDetail.fallbackReason || '暂无' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 样式优化
.overflow-auto {
  max-height: calc(100vh - 520px);
  overflow-y: auto;
  scrollbar-width: thin;
}

.overflow-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background-color: #e0e0e0;
  border-radius: 3px;
}

.grid {
  row-gap: 16px !important;
}

.flex-col {
  gap: 4px;
}

.whitespace-pre-line {
  white-space: pre-line;
}

.border-b {
  border-bottom: 1px solid #f0f0f0;
}

.text-primary {
  color: #1890ff;
}
</style>
