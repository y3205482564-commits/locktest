import { defHttp } from '@/utils/http/axios';

export namespace BpmFormApi {
  /** 流程表单 */
  export interface Form {
    id?: number
    name: string
    conf: string
    fields: string[]
    status: number
    remark: string
    createTime: number
  }
}

/** 获取表单分页列表 */
export function getFormPage(params: any) {
  return defHttp.get({ url: '/bpm/form/page', params });
}

/** 获取表单详情 */
export function getForm(id: number) {
  return defHttp.get<BpmFormApi.Form>({ url: `/bpm/form/get?id=${id}` });
}

/** 创建表单 */
export function createForm(data: BpmFormApi.Form) {
  return defHttp.post({ url: '/bpm/form/create', data });
}

/** 更新表单 */
export function updateForm(data: BpmFormApi.Form) {
  return defHttp.put({ url: '/bpm/form/update', data });
}

/** 删除表单 */
export function deleteForm(id: number) {
  return defHttp.delete({ url: `/bpm/form/delete?id=${id}` });
}

/** 获取表单简单列表 */
export function getFormSimpleList() {
  return defHttp.get<BpmFormApi.Form[]>({ url: '/bpm/form/simple-list' });
}
