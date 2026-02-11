import type { PageParam, PageResult } from '@/http/types'
import { http } from '@/http/http'

/** 表单定义 */
export interface FormVO {
  id: number
  name: string
  conf: string
  fields: string[]
  status: number
  remark: string
  createTime: string
}

/** 创建工作流的表单定义 */
export function createForm(data: FormVO) {
  return http.post<string>('/bpm/form/create', data)
}

/** 更新工作流的表单定义 */
export function updateForm(data: FormVO) {
  return http.put<boolean>('/bpm/form/update', data)
}

/** 删除工作流的表单定义 */
export function deleteForm(id: number) {
  return http.delete<boolean>(`/bpm/form/delete?id=${id}`)
}

/** 获得工作流的表单定义 */
export function getForm(id: number) {
  return http.get<FormVO>(`/bpm/form/get?id=${id}`)
}

/** 获得工作流的表单定义分页 */
export function getFormPage(params: PageParam) {
  return http.get<PageResult<FormVO>>('/bpm/form/page', params)
}

/** 获得动态表单的精简列表 */
export function getFormSimpleList() {
  return http.get<FormVO[]>('/bpm/form/simple-list')
}