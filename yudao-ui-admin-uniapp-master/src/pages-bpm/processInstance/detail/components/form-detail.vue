<!-- 表单详情：流程表单/业务表单，支持按字段权限只读/可编辑/隐藏 -->
<template>
  <view class="mx-24rpx mt-24rpx overflow-hidden rounded-16rpx bg-white">
    <!-- 业务表单 -->
    <template v-if="processDefinition?.formType === BpmModelFormType.CUSTOM">
      <LeaveDetail
        v-if="processDefinition?.formCustomViewPath === '/bpm/oa/leave/detail'"
        :id="processInstance?.businessKey"
        embedded
      />
      <view v-else class="px-24rpx py-32rpx text-26rpx text-[#999]">
        暂不支持该业务表单，请参考 LeaveDetail 配置
      </view>
    </template>
    <!-- 流程表单：按字段权限展示，可编辑字段可修改 -->
    <template v-else-if="processDefinition?.formType === BpmModelFormType.NORMAL">
      <view v-if="visibleRules.length > 0" class="px-24rpx pb-24rpx">
        <view
          v-for="(field, index) in visibleRules"
          :key="field.prop || index"
          class="form-field-item mb-24rpx pb-24rpx border-b border-[#f0f0f0] last:border-b-0 last:pb-0"
        >
          <view class="flex items-center mb-8rpx">
            <text class="text-26rpx font-medium text-[#333]">{{ field.label ?? field.title }}</text>
            <text v-if="field.required" class="ml-4rpx text-24rpx text-[#ff4d4f]">*</text>
          </view>

          <!-- 可编辑 -->
          <template v-if="isEditable(field)">
            <!-- 开关 -->
            <view v-if="isSwitchField(field)" class="flex items-center">
              <wd-switch
                :model-value="!!formPreview.formData[field.prop]"
                size="28rpx"
                @update:model-value="formPreview.formData[field.prop] = $event"
              />
              <text class="ml-16rpx text-26rpx text-[#666]">{{ formPreview.formData[field.prop] ? '开启' : '关闭' }}</text>
            </view>
            <!-- 输入框 -->
            <view v-else-if="isInputField(field)" class="form-field-value">
              <wd-input
                v-model="formPreview.formData[field.prop]"
                :placeholder="field.placeholder || '请输入'"
                type="text"
                clearable
              />
            </view>
            <!-- 多行文本 -->
            <view v-else-if="isTextareaField(field)" class="form-field-value">
              <wd-textarea
                v-model="formPreview.formData[field.prop]"
                :placeholder="field.placeholder || '请输入'"
                :maxlength="-1"
                :autosize="{ minRows: 3 }"
              />
            </view>
            <!-- 数字 -->
            <view v-else-if="isNumberField(field)" class="form-field-value">
              <wd-input
                v-model="formPreview.formData[field.prop]"
                type="digit"
                :placeholder="field.placeholder || '请输入'"
                clearable
              />
            </view>
            <!-- 下拉选择 -->
            <view v-else-if="isSelectField(field)" class="form-field-value">
              <wd-picker
                v-model="formPreview.formData[field.prop]"
                :columns="selectColumns(field)"
                :placeholder="field.placeholder || '请选择'"
                value-key="value"
                label-key="label"
              />
            </view>
            <!-- 单选 -->
            <view v-else-if="isRadioField(field)" class="form-field-value form-field-radio">
              <wd-radio-group v-model="formPreview.formData[field.prop]">
                <view class="flex flex-wrap gap-16rpx">
                  <wd-radio
                    v-for="opt in (field.options || [])"
                    :key="opt.value"
                    :value="opt.value"
                    shape="button"
                  >
                    {{ opt.label ?? opt.text ?? opt.value }}
                  </wd-radio>
                </view>
              </wd-radio-group>
            </view>
            <!-- 多选 -->
            <view v-else-if="isCheckboxField(field)" class="form-field-value form-field-checkbox">
              <wd-checkbox-group v-model="formPreview.formData[field.prop]" cell shape="button">
                <wd-checkbox
                  v-for="opt in (field.options || [])"
                  :key="opt.value"
                  :model-value="opt.value"
                >
                  {{ opt.label ?? opt.text ?? opt.value }}
                </wd-checkbox>
              </wd-checkbox-group>
            </view>
            <!-- 接口选择器/用户选择器：按 selectType 渲染下拉框/单选框/多选框 -->
            <view v-else-if="isApiSelectField(field)" class="form-field-value form-field-api-select">
              <template v-if="getApiSelectType(field) === 'select'">
                <wd-picker
                  v-model="formPreview.formData[field.prop]"
                  :columns="apiSelectColumns(field)"
                  :placeholder="field.placeholder || '请选择'"
                  value-key="value"
                  label-key="label"
                />
              </template>
              <template v-else-if="getApiSelectType(field) === 'radio'">
                <view class="form-field-radio">
                  <wd-radio-group v-model="formPreview.formData[field.prop]">
                    <view class="flex flex-wrap gap-16rpx">
                      <wd-radio
                        v-for="opt in apiSelectColumns(field)"
                        :key="opt.value"
                        :value="opt.value"
                        shape="button"
                      >
                        {{ opt.label ?? opt.text ?? opt.value }}
                      </wd-radio>
                    </view>
                  </wd-radio-group>
                </view>
              </template>
              <template v-else-if="getApiSelectType(field) === 'checkbox'">
                <view class="form-field-checkbox">
                  <wd-checkbox-group v-model="formPreview.formData[field.prop]" cell shape="button">
                    <wd-checkbox
                      v-for="opt in apiSelectColumns(field)"
                      :key="opt.value"
                      :model-value="opt.value"
                    >
                      {{ opt.label ?? opt.text ?? opt.value }}
                    </wd-checkbox>
                  </wd-checkbox-group>
                </view>
              </template>
            </view>
            <!-- 单图上传 -->
            <view v-else-if="isUploadImgField(field)" class="form-field-value form-field-upload-img">
              <view v-if="formPreview.formData[field.prop]" class="upload-img-preview">
                <image :src="formPreview.formData[field.prop]" mode="aspectFit" class="preview-img" />
                <view class="upload-img-actions">
                  <text class="upload-action-btn" @click="handleUploadImg(field)">更换</text>
                  <text class="upload-action-btn danger" @click="formPreview.formData[field.prop] = ''">删除</text>
                </view>
              </view>
              <view v-else class="upload-img-placeholder" @click="handleUploadImg(field)">
                <wd-icon name="camera" size="48rpx" color="#999" />
                <text class="upload-placeholder-text">点击上传图片</text>
              </view>
            </view>
            <!-- 其他 -->
            <view v-else class="form-field-value">
              <wd-input
                v-model="formPreview.formData[field.prop]"
                placeholder="请输入"
                clearable
              />
            </view>
          </template>
          <!-- 只读 -->
          <template v-else>
            <view v-if="isUploadImgField(field) && (formPreview.formData[field.prop] ?? field.value)" class="readonly-upload-img">
              <image :src="formPreview.formData[field.prop] ?? field.value" mode="aspectFit" class="preview-img" />
            </view>
            <view v-else class="text-26rpx text-[#666]">
              {{ getFieldDisplayValue(field) }}
            </view>
          </template>
        </view>
      </view>
      <view v-else class="px-24rpx py-32rpx text-26rpx text-[#999]">
        暂无表单数据
      </view>
    </template>
  </view>
</template>

<script lang="ts" setup>
import { ref, watch, computed, nextTick } from 'vue'
import type { ProcessDefinition, ProcessInstance } from '@/api/bpm/processInstance'
import LeaveDetail from '@/pages-bpm/oa/leave/detail/index.vue'
import { BpmModelFormType } from '@/utils/constants'
import { FieldPermissionType } from '@/utils/constants'
import { setConfAndFields2, formatFieldValue } from '@/utils/formCreate'
import {
  isSwitchField,
  isInputField,
  isTextareaField,
  isNumberField,
  isSelectField,
  isRadioField,
  isCheckboxField,
  isApiSelectField,
  isUploadImgField,
  getApiSelectType,
} from '@/utils/formCreate'
import { http } from '@/http/http'
import { uploadFileFromPath } from '@/utils/uploadFile'
import { useToast } from 'wot-design-uni'

const toast = useToast()

const props = defineProps<{
  processDefinition?: ProcessDefinition
  processInstance?: ProcessInstance
  activityNodes?: any[]
  /** 表单字段权限：字段名 -> '1'只读 '2'可编辑 '3'隐藏（与 PC 一致） */
  formFieldsPermission?: Record<string, string>
}>()

const formPreview = ref({
  formData: {} as Record<string, any>,
  rule: [] as any[],
  option: { submitBtn: false, resetBtn: false }
})

/** 接口选择器远程选项缓存：prop -> [{ label, value }] */
const apiSelectOptions = ref<Record<string, { label: string, value: any }[]>>({})

// 应用权限到 rule：无权限时默认只读
function applyPermission() {
  const perm = props.formFieldsPermission
  formPreview.value.rule.forEach((field: any) => {
    const p = perm?.[field.prop] ?? FieldPermissionType.READ
    field._permission = p
    field._hidden = p === FieldPermissionType.NONE
  })
}

watch(
  () => [
    props.processDefinition?.formFields,
    props.processDefinition?.formConf,
    props.processInstance?.formVariables,
    props.formFieldsPermission,
  ],
  () => {
    if (props.processDefinition?.formType === BpmModelFormType.NORMAL) {
      setConfAndFields2(
        formPreview.value,
        props.processDefinition.formConf,
        props.processDefinition.formFields,
        props.processInstance?.formVariables,
        true
      )
      applyPermission()
      nextTick(() => {
        formPreview.value.rule
          .filter((r: any) => isApiSelectField(r))
          .forEach((r: any) => loadApiSelectOptions(r))
      })
    } else {
      formPreview.value.rule = []
    }
  },
  { immediate: true, deep: true }
)

/** 可见字段（未隐藏） */
const visibleRules = computed(() =>
  formPreview.value.rule.filter((r: any) => !r._hidden)
)

/** 当前节点是否可编辑该字段 */
function isEditable(field: any) {
  return field._permission === FieldPermissionType.WRITE
}

/** 只读时的展示值（必须用 .value 读取 ref 内的 formData，否则取不到已提交的表单数据） */
function getFieldDisplayValue(field: any) {
  const val = formPreview.value.formData[field.prop] ?? field.value
  if (isApiSelectField(field)) {
    const opts = apiSelectOptions.value[field.prop] || field.options || []
    if (Array.isArray(val)) {
      const labels = val.map((v: any) => {
        const o = opts.find((opt: any) => opt.value == v || String(opt.value) === String(v))
        return o ? (o.label ?? o.text ?? String(v)) : String(v)
      })
      return labels.join('，')
    }
    const opt = opts.find((o: any) => o.value == val || String(o.value) === String(val))
    if (opt) return opt.label ?? opt.text ?? val
  }
  return formatFieldValue(field, val)
}

/** 下拉选项列（wd-picker columns 格式） */
function selectColumns(field: any) {
  const opts = field.options || []
  return opts.map((o: any) => ({ label: o.label ?? o.text ?? String(o.value), value: o.value }))
}

/** 接口选择器选项列：优先用远程加载结果，否则用 field.options */
function apiSelectColumns(field: any) {
  const cached = apiSelectOptions.value[field.prop]
  if (cached && cached.length > 0) return cached
  return selectColumns(field)
}

/** 从接口返回项中解析显示文案（兼容 teamName、electricRoomName、roomName、staffName、name、nickname、label、text 等） */
function getItemLabel(item: any, labelField: string): string {
  const v = item[labelField] ?? item.teamName ?? item.electricRoomName ?? item.roomName ?? item.staffName ?? item.name ?? item.nickname ?? item.label ?? item.text
  return v != null ? String(v) : ''
}

/** 从接口返回项中解析选项值（兼容 teamAccount、electricRoomId、roomId、staffId、id、value 等） */
function getItemValue(item: any, valueField: string): any {
  if (item[valueField] !== undefined && item[valueField] !== null) return item[valueField]
  return item.teamAccount ?? item.electricRoomId ?? item.roomId ?? item.staffId ?? item.id ?? item.value
}

/**
 * 加载接口/用户选择器选项（ApiSelect 用 props.url，UserSelect 用默认接口）
 * 兼容多种接口返回格式：{ label, value }、{ teamName, teamAccount }、{ electricRoomName, electricRoomId }、{ roomName, roomId }、{ staffName, staffId }、{ name, id }、{ nickname, id } 等
 */
async function loadApiSelectOptions(field: any) {
  const t = (field?.type ?? '').toLowerCase()
  let url = field.props?.url
  let labelField = field.props?.labelField
  let valueField = field.props?.valueField
  if (!url || typeof url !== 'string') {
    if (t === 'userselect' || t === 'user-select') {
      url = '/system/user/simple-list'
      if (labelField === undefined) labelField = 'nickname'
      if (valueField === undefined) valueField = 'id'
    }
  }
  if (!url || typeof url !== 'string') return
  labelField = labelField ?? 'label'
  valueField = valueField ?? 'value'
  const method = (field.props?.method || 'GET').toUpperCase()
  try {
    let data: any
    if (method === 'POST') {
      const body = field.props?.data ? (typeof field.props.data === 'string' ? JSON.parse(field.props.data || '{}') : field.props.data) : {}
      data = await http.post(url, body)
    } else {
      data = await http.get(url)
    }
    // 兼容：http 可能返回 data 或完整 { data: [] }（若某处用 original）
    const list = Array.isArray(data) ? data : (data?.data ?? data?.list ?? [])
    const rows = Array.isArray(list) ? list : []
    apiSelectOptions.value[field.prop] = rows.map((item: any) => ({
      label: getItemLabel(item, labelField),
      value: getItemValue(item, valueField),
    }))
  } catch (e) {
    console.error('接口/用户选择器加载失败:', field.prop, e)
    apiSelectOptions.value[field.prop] = field.options || []
  }
}

/** 单图上传：选图后上传并写入表单值 */
async function handleUploadImg(field: any) {
  try {
    const res = await new Promise<UniApp.ChooseImageSuccessCallbackResult>((resolve, reject) => {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: resolve,
        fail: reject
      })
    })
    const tempPath = res.tempFilePaths?.[0]
    if (!tempPath) return
    const url = await uploadFileFromPath(tempPath, 'bpm')
    formPreview.value.formData[field.prop] = url
  } catch (e) {
    toast.show('上传失败')
  }
}

/** 可编辑字段名列表（审批提交时只提交这些字段） */
function getWritableFields(): string[] {
  return formPreview.value.rule
    .filter((r: any) => r._permission === FieldPermissionType.WRITE && r.prop)
    .map((r: any) => r.prop)
}

/** 获取可编辑字段的当前值（用于审批通过时提交） */
function getFormVariables(): Record<string, any> {
  const vars: Record<string, any> = {}
  getWritableFields().forEach((prop) => {
    if (formPreview.value.formData[prop] !== undefined) {
      vars[prop] = formPreview.value.formData[prop]
    }
  })
  return vars
}

defineExpose({
  getFormVariables,
  getWritableFields,
})
</script>

<style scoped>
.form-field-value {
  min-height: 64rpx;
}
.form-field-radio {
  padding: 12rpx 0;
}
.form-field-checkbox {
  padding: 12rpx 0;
}
.form-field-upload-img .upload-img-preview {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16rpx;
}
.form-field-upload-img .preview-img {
  width: 200rpx;
  height: 200rpx;
  border-radius: 8rpx;
  background: #f5f5f5;
}
.form-field-upload-img .upload-img-actions {
  display: flex;
  gap: 24rpx;
}
.form-field-upload-img .upload-action-btn {
  font-size: 26rpx;
  color: #1890ff;
}
.form-field-upload-img .upload-action-btn.danger {
  color: #ff4d4f;
}
.form-field-upload-img .upload-img-placeholder {
  width: 200rpx;
  height: 200rpx;
  border: 2rpx dashed #e0e0e0;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}
.form-field-upload-img .upload-placeholder-text {
  font-size: 24rpx;
  color: #999;
}
.readonly-upload-img .preview-img {
  width: 200rpx;
  height: 200rpx;
  border-radius: 8rpx;
  background: #f5f5f5;
}
</style>
