import { defHttp } from '@/utils/http/axios';

/** 流程模型 */
export interface ModelVO {
  id: number
  key: string
  name: string
  icon?: string
  description: string
  category: string
  categoryName?: string
  formName: string
  formType: number
  formId: number
  formCustomCreatePath: string
  formCustomViewPath: string
  processDefinition: ProcessDefinitionVO
  status: number
  remark: string
  createTime: string
  bpmnXml: string
  startUsers?: UserInfoVO[]
  startDepts?: DeptInfoVO[]
  managerUserIds?: number[]
  simpleModel?: any
  startUserIds?: number[]
  startDeptIds?: number[]
  visible?: boolean
  allowCancelRunningProcess?: boolean
  processIdRule?: any
  autoApprovalType?: number
  titleSetting?: any
  summarySetting?: any
  allowWithdrawTask?: boolean
  processBeforeTriggerSetting?: any
  processAfterTriggerSetting?: any
  taskBeforeTriggerSetting?: any
  taskAfterTriggerSetting?: any
  printTemplateSetting?: any
  startUserType?: number
  type?: number
}

/** 流程定义 */
export interface ProcessDefinitionVO {
  id: string
  key?: string
  version: number
  deploymentTime: number
  suspensionState: number
  formType?: number
  formCustomViewPath?: string
  formFields?: string[]
}

/** 用户信息 */
export interface UserInfoVO {
  id: number
  nickname: string
  avatar?: string
  deptId?: number
  deptName?: string
}

/** 部门信息 */
export interface DeptInfoVO {
  id: number
  name: string
}

/** 模型分类信息 */
export interface ModelCategoryInfo {
  id: number
  name: string
  modelList: ModelVO[]
}

/** 获取流程模型列表 */
export function getModelList(name?: string) {
  return defHttp.get<ModelVO[]>({ url: '/bpm/model/list', params: { name } });
}

/** 获取流程模型详情 */
export function getModel(id: string) {
  return defHttp.get<ModelVO>({ url: `/bpm/model/get?id=${id}` });
}

/** 更新流程模型 */
export function updateModel(data: ModelVO) {
  return defHttp.put({ url: '/bpm/model/update', data });
}

/** 批量修改流程模型排序 */
export function updateModelSortBatch(ids: number[]) {
  const params = ids.join(',');
  return defHttp.put<boolean>({ url: `/bpm/model/update-sort-batch?ids=${params}` });
}

/** 更新流程模型的 BPMN XML */
export function updateModelBpmn(data: ModelVO) {
  return defHttp.put({ url: '/bpm/model/update-bpmn', data });
}

/** 更新流程模型状态 */
export function updateModelState(id: number, state: number) {
  const data = { id, state };
  return defHttp.put({ url: '/bpm/model/update-state', data });
}

/** 创建流程模型 */
export function createModel(data: ModelVO) {
  return defHttp.post({ url: '/bpm/model/create', data });
}

/** 删除流程模型 */
export function deleteModel(id: number) {
  return defHttp.delete({ url: `/bpm/model/delete?id=${id}` });
}

/** 部署流程模型 */
export function deployModel(id: number) {
  return defHttp.post({ url: `/bpm/model/deploy?id=${id}` });
}

/** 清理流程模型 */
export function cleanModel(id: number) {
  return defHttp.delete({ url: `/bpm/model/clean?id=${id}` });
}
