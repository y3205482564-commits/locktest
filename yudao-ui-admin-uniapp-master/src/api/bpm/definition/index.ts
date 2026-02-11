import { http } from '@/http/http'

/** 流程定义 */
export interface ProcessDefinition {
  id: string
  key: string
  name: string
  description?: string
  icon?: string
  category: string
  formType?: number
  formId?: number
  formConf?: string
  formFields?: string
  formCustomCreatePath?: string
  formCustomViewPath?: string
  suspensionState: number
  bpmnXml?: string
  simpleModel?: string
}

/** 获取流程定义列表 */
export function getProcessDefinitionList(params?: { suspensionState?: number }) {
  return http.get<ProcessDefinition[]>('/bpm/process-definition/list', params)
}

/** 获取流程定义详情 */
export function getProcessDefinition(id: string) {
  return http.get<ProcessDefinition>(`/bpm/process-definition/get?id=${id}`)
}
