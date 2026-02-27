<template>
  <div class="operation-room-screen">
    <!-- 加载状态占位（全屏） -->
    <div v-if="loading" class="loading-container">
      <a-spin size="large" tip="正在加载操作牌数据..."></a-spin>
    </div>

    <div v-else class="layout-container">
      <!-- 左侧：站室树形选择（复用SystemDeptTree风格） -->
      <div class="tree-section">
        <SystemStationRoomTree @select="handleStationRoomSelect" />
      </div>

      <!-- 右侧：操作牌内容区域 -->
      <div class="content-section">
        <!-- 标题 -->
        <div class="title-section">
          <h1 class="screen-title">操作牌大屏</h1>
          <!-- 选中站室提示 -->
          <div v-if="selectedStationRoomId" class="selected-tip">
            当前选中：{{ getStationRoomName(selectedStationRoomId) || '全部站室' }}
          </div>
        </div>

        <!-- 状态图例（数量统计） -->
        <div class="legend">
          <span class="legend-item">
            <span class="legend-dot green"></span>
            未领用：<strong>{{ unusedCount }}</strong> 个
          </span>
          <span class="legend-item">
            <span class="legend-dot red"></span>
            已领用：<strong>{{ usedCount }}</strong> 个
          </span>
        </div>

        <!-- 空数据提示 -->
        <div v-if="filteredTagList.length === 0" class="empty-container">
          <a-empty description="暂无操作牌数据"></a-empty>
        </div>

        <!-- 挂牌卡片网格 -->
        <div v-else class="tag-grid">
          <div
            v-for="tag in filteredTagList"
            :key="tag.id"
            :class="['tag-card', getTagColorClass(tag.workCount)]"
          >
            <!-- 红色牌右上角添加作业数按钮组 -->
            <template v-if="getTagColorClass(tag.workCount) === 'red'">
              <div class="tag-actions">
                <a-button
                  v-for="i in Math.abs(tag.workCount)"
                  :key="i"
                  type="text"
                  size="small"
                  :class="['action-btn', i === Math.abs(tag.workCount) ? 'active' : '']"
                  @click="handleShowRecord(tag.id, i)"
                >
                  {{ i }}
                </a-button>
              </div>
            </template>

            <div class="tag-footer">
              <span class="tag-type">{{ tag.tagType }}</span>
            </div>

            <!-- 作业数量展示 -->
            <div v-if="tag.workCount !== 0" class="tag-header">
              <span class="work-count">作业数量: {{ Math.abs(tag.workCount) }}</span>
            </div>

            <div class="tag-content">
              <p><strong>归属区域:</strong> {{ tag.area }}</p>
              <p><strong>操作台:</strong> {{ tag.consoleNo }}</p>
              <p><strong>设备位置:</strong> {{ tag.deviceLocation }}</p>
              <p><strong>归属单位:</strong> {{ tag.belongUnit }}</p>
              <!-- 已领用才显示领用信息 -->
              <template v-if="tag.workCount < 0">
                <p><strong>领用单位:</strong> {{ tag.useUnit || '-' }}</p>
                <p><strong>领用人:</strong> {{ tag.usePerson || '-' }}</p>
                <p><strong>点检人员:</strong> {{ tag.inspector || '-' }}</p>
                <p><strong>操作人员:</strong> {{ tag.operator || '-' }}</p>
                <p><strong>领用时间:</strong> {{ formatTime(tag.useTime) }}</p>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onErrorCaptured, onMounted, ref, computed } from 'vue';
import { message, Modal } from 'ant-design-vue';
import dayjs from 'dayjs';
// 引入站室树组件（与部门树同风格）
import SystemStationRoomTree from './StationRoomTree.vue';
// 引入操作牌API和站室API
import { getOperationTagList } from '@/api/room/operationRoom/operationTagApi';
import { listSimpleStationRoom } from '@/api/room/stationRoom/stationRoom';
import type { TreeItem } from '@/components/Tree';
import { handleTree } from '@/utils/tree';

// 定义操作牌TS接口
interface OperationTag {
  id: number;
  tenantId: number;
  tagType: string;
  stationRoomId: number; // 关联站室ID
  area: string;
  consoleNo: string;
  deviceLocation: string;
  belongUnit: string;
  workCount: number;
  useUnit?: string;
  usePerson?: string;
  inspector?: string;
  operator?: string;
  useTime?: string;
  creator?: string;
  createTime?: string;
  updater?: string;
  updateTime?: string;
  deleted?: number;
}

// 响应式数据
const tagList = ref<OperationTag[]>([]); // 原始全量数据
const stationRoomList = ref<TreeItem[]>([]); // 站室列表（用于查询名称）
const loading = ref<boolean>(true);
const selectedStationRoomId = ref<string>(''); // 选中的站室ID

// 加载站室列表（用于根据ID查名称）
async function fetchStationRoomList() {
  const res = await listSimpleStationRoom();
  stationRoomList.value = handleTree(res, 'id');
}

// 根据站室ID获取名称
const getStationRoomName = (id: string) => {
  if (!id || id === '0') return '全部站室';
  // 递归查找站室名称
  const findName = (tree: TreeItem[], targetId: string): string => {
    for (const item of tree) {
      if (item.id === targetId) return item.name;
      if (item.children && item.children.length) {
        const childName = findName(item.children, targetId);
        if (childName) return childName;
      }
    }
    return '';
  };
  return findName(stationRoomList.value, id) || '未知站室';
};

// 根据选中的站室筛选操作牌
const filteredTagList = computed(() => {
  if (!selectedStationRoomId.value || selectedStationRoomId.value === '0') {
    // 未选中/选中根节点，显示所有
    return tagList.value;
  }
  // 筛选当前站室的操作牌
  return tagList.value.filter(tag => tag.stationRoomId === Number(selectedStationRoomId.value));
});

// 计算未领用/已领用数量（基于筛选后的数据）
const unusedCount = computed(() => {
  return filteredTagList.value.filter(tag => tag.workCount >= 0).length;
});

const usedCount = computed(() => {
  return filteredTagList.value.filter(tag => tag.workCount < 0).length;
});

// 根据作业数判断卡片颜色类名
const getTagColorClass = (workCount: number) => {
  return workCount >= 0 ? 'green' : 'red';
};

// 格式化时间
const formatTime = (time?: string) => {
  return time ? dayjs(time).format('YYYY.MM.DD HH:mm:ss') : '-';
};

// 点击作业数按钮触发的方法
const handleShowRecord = (tagId: number, recordIndex: number) => {
  Modal.info({
    title: `操作牌 #${tagId} 第 ${recordIndex} 次领取记录`,
    content: '领取记录功能开发中，敬请期待...',
    width: 500,
  });
};

// 站室树选择事件（与部门树逻辑一致）
const handleStationRoomSelect = (id: string) => {
  selectedStationRoomId.value = id;
};

// 加载操作牌数据
const loadOperationTagData = async () => {
  try {
    loading.value = true;
    // 并行加载站室列表和操作牌数据
    await Promise.all([fetchStationRoomList(), getOperationTagList()])
      .then(([_, tagRes]) => {
        const data = tagRes?.data || tagRes;
        tagList.value = Array.isArray(data) ? data : [];
      });
    message.success('操作牌数据加载成功');
  } catch (error) {
    console.error('获取操作牌数据失败:', error);
    message.error('操作牌数据加载失败，请刷新页面重试');
    tagList.value = [];
  } finally {
    loading.value = false;
  }
};

// 组件挂载后加载数据
onMounted(() => {
  loadOperationTagData();
});

// 全局错误捕获
onErrorCaptured((err) => {
  console.error('组件渲染错误:', err);
  message.error('页面加载异常，请联系管理员');
  loading.value = false;
  return true;
});
</script>

<style scoped lang="less">
.operation-room-screen {
  padding: 0;
  background: #f0f2f5;
  min-height: 100vh;
}

// 全屏加载样式
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

// 左树右表布局容器
.layout-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

// 左侧站室树样式（与部门树一致）
.tree-section {
  width: 260px;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  height: 100vh;
  overflow: hidden;
}

// 右侧内容区域
.content-section {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: #f0f2f5;
}

// 标题区域（新增选中提示）
.title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .screen-title {
    font-size: 36px;
    font-weight: bold;
    color: #262626;
    margin: 0;
  }

  .selected-tip {
    font-size: 14px;
    color: #1890ff;
    background: #e6f7ff;
    padding: 4px 12px;
    border-radius: 4px;
  }
}

// 图例样式
.empty-container {
  margin: 40px 0;
  text-align: center;
}

.legend {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  color: #8c8c8c;
  font-size: 14px;
  justify-content: flex-start;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.red {
  background: #cf1322;
}

.green {
  background: #52c41a;
}

// 操作牌网格
.tag-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px 20px;
  padding: 0;
}

@media screen and (max-width: 1920px) {
  .tag-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px 16px;
  }

  .tag-card {
    padding: 12px;
  }
}

// 操作牌卡片样式
.tag-card {
  border-radius: 8px;
  padding: 16px;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s;
  min-width: 180px;
  position: relative;

  &:hover {
    transform: translateY(-4px);
  }

  &.red {
    background: linear-gradient(135deg, #cf1322 0%, #a8071a 100%);
  }

  &.green {
    background: linear-gradient(135deg, #007a3d 0%, #005a2d 100%);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
}

/* 红色牌右上角按钮组样式 */
.tag-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 10;
}

.action-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }

  &.active {
    background: rgba(255, 255, 255, 0.4);
    border-color: rgba(255, 255, 255, 0.6);
  }
}

/* 作业数量样式 */
.tag-card.red .tag-header {
  text-align: left;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: bold;
}

/* 其他卡片样式 */
.tag-card.green .tag-footer {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  border-top: none;
  border-bottom: 2px solid #fff;
  padding-bottom: 8px;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
  padding-top: 0;
}

.tag-card.green .tag-content {
  font-size: 12px;
  line-height: 1.8;
  text-align: center;
}

.tag-card.green .tag-header {
  text-align: center;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: bold;
}

.tag-card.red .tag-footer {
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  padding-top: 6px;
}

.tag-card.red .tag-content {
  font-size: 11px;
  line-height: 1.6;
  margin-bottom: 8px;
}
</style>
