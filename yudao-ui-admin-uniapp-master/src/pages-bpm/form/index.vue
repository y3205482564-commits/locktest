<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="流程表单"
      left-arrow placeholder safe-area-inset-top fixed
      @click-left="handleBack"
    />

    <!-- 搜索栏 -->
    <view class="mx-24rpx mt-24rpx">
      <wd-search
        v-model="searchValue"
        placeholder="请输入表单名称"
        @search="handleSearch"
        @clear="handleClear"
      />
    </view>

    <!-- 表单列表 -->
    <view class="mx-24rpx mt-24rpx">
      <view v-if="loading" class="flex items-center justify-center py-48rpx">
        <wd-loading type="spinner" color="#1890ff" size="48rpx" />
      </view>
      <view v-else-if="formList.length === 0" class="flex flex-col items-center justify-center py-96rpx">
        <wd-status-tip image="search" tip="暂无表单数据" />
      </view>
      <view v-else>
        <view v-for="form in formList" :key="form.id" class="bg-white rounded-16rpx mb-16rpx overflow-hidden">
          <view class="p-24rpx">
            <view class="flex justify-between items-center mb-12rpx">
              <text class="text-28rpx font-bold text-[#333]">{{ form.name }}</text>
              <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="form.status" />
            </view>
            <view class="mb-12rpx flex items-center text-24rpx text-[#666]">
              <text class="mr-8rpx shrink-0 text-[#999]">编号：</text>
              <text>{{ form.id }}</text>
            </view>
            <view class="mb-12rpx flex items-center text-24rpx text-[#666]">
              <text class="mr-8rpx shrink-0 text-[#999]">创建时间：</text>
              <text>{{ formatDateTime(form.createTime) }}</text>
            </view>
            <view class="text-24rpx text-[#999] mb-16rpx">
              <text v-if="form.remark">{{ form.remark }}</text>
              <text v-else>无备注</text>
            </view>
            <view class="flex justify-end gap-12rpx">
              <wd-button size="small" type="primary" @click="handleView(form.id)">
                查看
              </wd-button>
            </view>
          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'wot-design-uni'
import { getFormPage, getFormSimpleList, FormVO } from '@/api/bpm/form'
import type { PageParam, PageResult } from '@/http/types'
import { DICT_TYPE } from '@/utils/constants'
import { formatDateTime } from '@/utils/date'

const searchValue = ref('')
const loading = ref(false)
const formList = ref<FormVO[]>([])
const toast = useToast()

/** 返回上一页 */
function handleBack() {
  uni.navigateBack()
}

/** 搜索 */
function handleSearch() {
  loadFormList()
}

/** 清空搜索 */
function handleClear() {
  searchValue.value = ''
  loadFormList()
}

/** 查看表单 */
function handleView(formId: number) {
  uni.navigateTo({
    url: `/pages-bpm/form/detail/index?id=${formId}`
  })
}

/** 加载表单列表 */
async function loadFormList() {
  loading.value = true
  try {
    const params: PageParam = {
      pageNo: 1,
      pageSize: 20,
      name: searchValue.value
    }
    const data = await getFormPage(params)
    formList.value = data.list
  } catch (error) {
    toast.show('加载表单列表失败')
    console.error('加载表单列表失败:', error)
  } finally {
    loading.value = false
  }
}

/** 初始化 */
onMounted(() => {
  loadFormList()
})
</script>

<style scoped>
.yd-page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>