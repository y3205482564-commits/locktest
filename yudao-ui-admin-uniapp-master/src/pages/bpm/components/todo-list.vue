<template>
  <view>
    <!-- 搜索组件 -->
    <TodoSearchForm @search="handleSearch" @reset="handleReset" />

    <!-- 批量操作栏（待办列表上方） -->
    <view v-if="list.length > 0" class="bpm-batch-bar">
      <view v-if="!batchMode" class="bpm-batch-bar-inner">
        <text class="bpm-batch-tip">点击卡片查看详情</text>
        <view class="bpm-batch-btn" @click="enterBatchMode">批量操作</view>
      </view>
      <view v-else class="bpm-batch-bar-inner">
        <view class="bpm-batch-btn cancel" @click="exitBatchMode">取消</view>
        <text class="bpm-batch-tip">已选 {{ selectedIds.length }} 项</text>
        <view class="bpm-batch-btn" @click="toggleSelectAll">{{ isAllSelected ? '取消全选' : '全选' }}</view>
      </view>
    </view>

    <view class="bpm-list">
      <!-- 待办列表 -->
      <view
        v-for="item in list"
        :key="item.id"
        class="bpm-card"
        :class="{ 'bpm-card--batch': batchMode, 'bpm-card--selected': batchMode && selectedIds.includes(item.id) }"
        @click="batchMode ? toggleSelect(item) : handleDetail(item)"
      >
        <!-- 批量模式下左侧复选框 -->
        <view v-if="batchMode" class="bpm-card-check" @click.stop="toggleSelect(item)">
          <wd-checkbox :model-value="selectedIds.includes(item.id)" />
        </view>
        <view class="bpm-card-content">
          <view class="bpm-card-header">
            <view class="bpm-card-title">
              {{ item.processInstance?.name }}
            </view>
            <wd-tag type="primary" plain>
              待审批
            </wd-tag>
          </view>
          <view v-if="item.processInstance?.summary?.length" class="bpm-summary">
            <view v-for="(s, idx) in item.processInstance.summary" :key="idx" class="bpm-summary-item">
              <text class="text-[#999]">{{ s.key }}：</text>
              <text>{{ s.value }}</text>
            </view>
          </view>
          <view class="bpm-card-info">
            <view class="bpm-user">
              <view class="bpm-avatar">
                {{ item.processInstance?.startUser?.nickname?.[0] || '?' }}
              </view>
              <text class="bpm-nickname">{{ item.processInstance?.startUser?.nickname }}</text>
            </view>
            <text class="bpm-time--warning">{{ formatPast(item.createTime) }}</text>
          </view>
        </view>
        <!-- 非批量模式下操作按钮 -->
        <view v-if="!batchMode" class="bpm-actions">
          <view class="bpm-action-btn" @click.stop="handleReject(item)">
            <text>拒绝</text>
          </view>
          <view class="bpm-action-btn" @click.stop="handleApprove(item)">
            <text>同意</text>
          </view>
        </view>
      </view>

      <!-- 加载更多 -->
      <view v-if="loadMoreState !== 'loading' && list.length === 0" class="bpm-empty">
        <wd-status-tip image="content" tip="暂无待办任务" />
      </view>
      <wd-loadmore
        v-if="list.length > 0"
        :state="loadMoreState"
        @reload="loadMore"
      />
    </view>

    <!-- 底部批量操作栏 -->
    <view v-if="batchMode && selectedIds.length > 0" class="bpm-batch-footer">
      <view class="bpm-batch-footer-inner">
        <view class="bpm-batch-footer-btn reject" @click="openRejectPopup">批量拒绝</view>
        <view class="bpm-batch-footer-btn approve" @click="openApprovePopup">批量通过</view>
      </view>
    </view>

    <!-- 批量通过弹窗：审批意见选填 -->
    <wd-popup v-model="approvePopupVisible" position="bottom" :safe-area-inset-bottom="true" @close="batchReason = ''">
      <view class="bpm-batch-popup">
        <view class="bpm-batch-popup-title">批量通过</view>
        <view class="bpm-batch-popup-desc">已选 {{ selectedIds.length }} 项，将跳转审批同意页填写表单并提交第一条</view>
        <wd-textarea
          v-model="batchReason"
          placeholder="请输入审批意见（选填）"
          :maxlength="500"
          :autosize="{ minRows: 3 }"
          class="bpm-batch-textarea"
        />
        <view class="bpm-batch-popup-actions">
          <view class="bpm-batch-popup-btn cancel" @click="approvePopupVisible = false">取消</view>
          <view class="bpm-batch-popup-btn confirm" @click="doBatchApprove">确定</view>
        </view>
      </view>
    </wd-popup>

    <!-- 批量拒绝弹窗：拒绝原因必填 -->
    <wd-popup v-model="rejectPopupVisible" position="bottom" :safe-area-inset-bottom="true" @close="batchReason = ''">
      <view class="bpm-batch-popup">
        <view class="bpm-batch-popup-title">批量拒绝</view>
        <view class="bpm-batch-popup-desc">已选 {{ selectedIds.length }} 项，请填写拒绝原因</view>
        <wd-textarea
          v-model="batchReason"
          placeholder="请输入拒绝原因（必填）"
          :maxlength="500"
          :autosize="{ minRows: 3 }"
          class="bpm-batch-textarea"
        />
        <view class="bpm-batch-popup-actions">
          <view class="bpm-batch-popup-btn cancel" @click="rejectPopupVisible = false">取消</view>
          <view class="bpm-batch-popup-btn confirm reject" @click="doBatchReject">确定</view>
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<script lang="ts" setup>
import type { Task } from '@/api/bpm/task'
import type { LoadMoreState } from '@/http/types'
import { onReachBottom } from '@dcloudio/uni-app'
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'wot-design-uni'
import { getTaskTodoPage, rejectTask } from '@/api/bpm/task'
import * as ProcessInstanceApi from '@/api/bpm/processInstance'
import { setPendingFormVariables, setPendingTaskForm } from '@/pages-bpm/processInstance/detail/process-instance-form-store'
import { formatPast } from '@/utils/date'
import TodoSearchForm from './todo-search-form.vue'
import '../styles/index.scss'

const toast = useToast()

const total = ref(0)
const list = ref<Task[]>([])
const loadMoreState = ref<LoadMoreState>('loading')
const queryParams = ref({
  pageNo: 1,
  pageSize: 10,
})

/** 批量模式 */
const batchMode = ref(false)
/** 选中的任务 id 列表 */
const selectedIds = ref<string[]>([])
/** 批量操作时的审批意见/拒绝原因 */
const batchReason = ref('')
const approvePopupVisible = ref(false)
const rejectPopupVisible = ref(false)
const batchSubmitting = ref(false)

const isAllSelected = computed(() => list.value.length > 0 && selectedIds.value.length === list.value.length)

/** 进入批量模式 */
function enterBatchMode() {
  batchMode.value = true
  selectedIds.value = []
}

/** 退出批量模式 */
function exitBatchMode() {
  batchMode.value = false
  selectedIds.value = []
}

/** 切换单条选中 */
function toggleSelect(item: Task) {
  const id = item.id
  const idx = selectedIds.value.indexOf(id)
  if (idx === -1) {
    selectedIds.value = [...selectedIds.value, id]
  } else {
    selectedIds.value = selectedIds.value.filter((i) => i !== id)
  }
}

/** 全选/取消全选 */
function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = list.value.map((t) => t.id)
  }
}

/** 查询列表 */
async function getList() {
  loadMoreState.value = 'loading'
  try {
    const data = await getTaskTodoPage(queryParams.value)
    list.value = [...list.value, ...data.list]
    total.value = data.total
    loadMoreState.value = list.value.length >= total.value ? 'finished' : 'loading'
  } catch {
    queryParams.value.pageNo = queryParams.value.pageNo > 1 ? queryParams.value.pageNo - 1 : 1
    loadMoreState.value = 'error'
  }
}

/** 加载更多 */
function loadMore() {
  if (loadMoreState.value === 'finished') {
    return
  }
  queryParams.value.pageNo++
  getList()
}

/** 搜索 */
function handleSearch(data?: Record<string, any>) {
  queryParams.value = {
    ...data,
    pageNo: 1,
    pageSize: queryParams.value.pageSize,
  }
  list.value = []
  getList()
}

/** 重置 */
function handleReset() {
  handleSearch()
}

/** 查看详情 */
function handleDetail(item: Task) {
  uni.navigateTo({ url: `/pages-bpm/processInstance/detail/index?id=${item.processInstance?.id}&taskId=${item.id}` })
}

/** 同意（单条） */
function handleApprove(item: Task) {
  uni.navigateTo({ url: `/pages-bpm/processInstance/detail/audit/index?processInstanceId=${item.processInstance?.id}&taskId=${item.id}&pass=true` })
}

/** 拒绝（单条） */
function handleReject(item: Task) {
  uni.navigateTo({ url: `/pages-bpm/processInstance/detail/audit/index?processInstanceId=${item.processInstance?.id}&taskId=${item.id}&pass=false` })
}

/** 选中的任务列表（按 selectedIds 顺序） */
function getSelectedTasks(): Task[] {
  return selectedIds.value
    .map((id) => list.value.find((t) => t.id === id))
    .filter(Boolean) as Task[]
}

/** 判断选中的任务是否都处于「审批/流转记录」的相同步骤（按当前任务节点 name 比较） */
function isSameStepForSelected(): boolean {
  const tasks = getSelectedTasks()
  if (tasks.length <= 1) return true
  const first = tasks[0]
  const stepName = (first?.name ?? '').trim()
  return tasks.every((t) => (t.name ?? '').trim() === stepName)
}

/** 打开批量通过弹窗（需相同步骤才允许） */
function openApprovePopup() {
  if (!isSameStepForSelected()) {
    toast.show('审批/流转记录不同')
    return
  }
  batchReason.value = ''
  approvePopupVisible.value = true
}

/** 打开批量拒绝弹窗（需相同步骤才允许） */
function openRejectPopup() {
  if (!isSameStepForSelected()) {
    toast.show('审批/流转记录不同')
    return
  }
  batchReason.value = ''
  rejectPopupVisible.value = true
}

/** 执行批量通过：跳转到第一条选中任务的「审批同意」页，便于填写节点表单并提交 */
async function doBatchApprove() {
  const ids = [...selectedIds.value]
  if (ids.length === 0) {
    approvePopupVisible.value = false
    return
  }
  if (!isSameStepForSelected()) {
    toast.show('审批/流转记录不同')
    approvePopupVisible.value = false
    return
  }
  const firstTask = list.value.find((t) => t.id === ids[0])
  if (!firstTask?.processInstance?.id) {
    toast.show('任务数据异常')
    approvePopupVisible.value = false
    return
  }
  batchSubmitting.value = true
  try {
    const detail = await ProcessInstanceApi.getApprovalDetail({
      processInstanceId: firstTask.processInstance.id,
      taskId: firstTask.id,
    })
    if (!detail?.todoTask) {
      toast.show('获取审批详情失败')
      return
    }
    const { processInstance, todoTask } = detail
    setPendingFormVariables(processInstance?.formVariables ?? {})
    if (todoTask.formId != null && todoTask.formConf) {
      setPendingTaskForm({
        formName: todoTask.formName,
        formConf: todoTask.formConf,
        formFields: todoTask.formFields,
        formVariables: todoTask.formVariables,
      })
    } else {
      setPendingTaskForm(null)
    }
    approvePopupVisible.value = false
    exitBatchMode()
    const reason = batchReason.value?.trim() ?? ''
    const url = `/pages-bpm/processInstance/detail/audit/index?processInstanceId=${firstTask.processInstance.id}&taskId=${firstTask.id}&pass=true${reason ? `&reason=${encodeURIComponent(reason)}` : ''}`
    uni.navigateTo({ url })
  } catch (e) {
    console.error(e)
    toast.show('获取审批详情失败')
  } finally {
    batchSubmitting.value = false
  }
}

/** 执行批量拒绝（循环调用单条拒绝接口） */
async function doBatchReject() {
  const ids = [...selectedIds.value]
  if (ids.length === 0) {
    rejectPopupVisible.value = false
    return
  }
  if (!isSameStepForSelected()) {
    toast.show('审批/流转记录不同')
    rejectPopupVisible.value = false
    return
  }
  const reason = batchReason.value?.trim()
  if (!reason) {
    toast.show('请填写拒绝原因')
    return
  }
  batchSubmitting.value = true
  let successCount = 0
  let failCount = 0
  try {
    for (const id of ids) {
      try {
        await rejectTask({ id, reason })
        successCount++
        selectedIds.value = selectedIds.value.filter((i) => i !== id)
        list.value = list.value.filter((t) => t.id !== id)
      } catch {
        failCount++
      }
    }
    rejectPopupVisible.value = false
    if (failCount === 0) {
      toast.show(`已拒绝 ${successCount} 条`)
    } else {
      toast.show(`拒绝 ${successCount} 条，失败 ${failCount} 条`)
    }
    if (selectedIds.value.length === 0) {
      exitBatchMode()
    }
  } finally {
    batchSubmitting.value = false
  }
}

/** 触底加载更多 */
onReachBottom(() => {
  loadMore()
})

/** 初始化 */
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.bpm-batch-bar {
  padding: 16rpx 24rpx;
  background: #fff;
  border-bottom: 1rpx solid #f0f0f0;
}

.bpm-batch-bar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bpm-batch-tip {
  font-size: 26rpx;
  color: #999;
}

.bpm-batch-btn {
  font-size: 28rpx;
  color: #1890ff;

  &.cancel {
    color: #666;
  }
}

.bpm-card--batch {
  display: flex;
  align-items: stretch;
}

.bpm-card--selected {
  background-color: #f0f8ff;
}

.bpm-card-check {
  display: flex;
  align-items: center;
  padding: 0 20rpx 0 24rpx;
  border-right: 1rpx solid #f0f0f0;
}

.bpm-batch-footer {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 24rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom) + 100rpx);
  background: #fff;
  border-top: 1rpx solid #f0f0f0;
}

.bpm-batch-footer-inner {
  display: flex;
  gap: 24rpx;
  justify-content: stretch;
}

.bpm-batch-footer-btn {
  flex: 1;
  padding: 24rpx 0;
  font-size: 30rpx;
  font-weight: 500;
  text-align: center;
  border-radius: 12rpx;

  &.reject {
    color: #ff4d4f;
    background: #fff1f0;
  }

  &.approve {
    color: #fff;
    background: #1890ff;
  }
}

.bpm-batch-popup {
  padding: 32rpx 24rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom) + 100rpx);
}

.bpm-batch-popup-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 12rpx;
}

.bpm-batch-popup-desc {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 24rpx;
}

.bpm-batch-textarea {
  margin-bottom: 32rpx;
  border: 1rpx solid #eee;
  border-radius: 12rpx;
}

.bpm-batch-popup-actions {
  display: flex;
  gap: 24rpx;
}

.bpm-batch-popup-btn {
  flex: 1;
  padding: 24rpx 0;
  font-size: 30rpx;
  font-weight: 500;
  text-align: center;
  border-radius: 12rpx;

  &.cancel {
    color: #666;
    background: #f5f5f5;
  }

  &.confirm {
    color: #fff;
    background: #1890ff;

    &.reject {
      background: #ff4d4f;
    }
  }
}
</style>
