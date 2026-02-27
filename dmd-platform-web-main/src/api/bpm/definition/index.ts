import { defHttp } from '@/utils/http/axios';

import type { UserInfoVO } from '@/api/bpm/model';

/** 流程定义 */
export interface ProcessDefinitionVO {
  id: string
  key?: string
  version: number
  name: string
  category: string
  description: string
  deploymentTime: number
  suspensionState: number
  modelType: number
  modelId: string
  formType?: number
  formId?: number
  formName?: string
  formCustomCreatePath?: string
  bpmnXml?: string
  simpleModel?: string
  formFields?: string[]
  icon?: string
  startUsers?: UserInfoVO[]
}

/** 查询流程定义 */
export function getProcessDefinition(id?: string, key?: string) {
  return defHttp.get<ProcessDefinitionVO>({ url: '/bpm/process-definition/get', params: { id, key } });
}

/** 分页查询流程定义 */
export function getProcessDefinitionPage(params: any) {
  return defHttp.get({ url: '/bpm/process-definition/page', params });
}

/** 查询流程定义列表 */
export function getProcessDefinitionList(params: any) {
  return defHttp.get<ProcessDefinitionVO[]>({ url: '/bpm/process-definition/list', params });
}

/** 查询流程定义列表（简单列表） */
export function getSimpleProcessDefinitionList() {
  return defHttp.get<ProcessDefinitionVO[]>({ url: '/bpm/process-definition/simple-list' });
}
