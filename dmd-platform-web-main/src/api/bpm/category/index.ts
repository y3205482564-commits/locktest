import { defHttp } from '@/utils/http/axios';

/** 流程分类 VO */
export interface CategoryVO {
  id?: number
  name: string
  code: string
  status: number
  description?: string
  sort: number
}

/** 流程分类分页请求 VO */
export interface CategoryPageReqVO {
  name?: string
  code?: string
  status?: number
  createTime?: [Date, Date]
}

/** 查询流程分类分页 */
export function getCategoryPage(params: CategoryPageReqVO) {
  return defHttp.get({ url: '/bpm/category/page', params });
}

/** 查询流程分类详情 */
export function getCategory(id: number) {
  return defHttp.get({ url: `/bpm/category/get?id=${id}` });
}

/** 新增流程分类 */
export function createCategory(data: CategoryVO) {
  return defHttp.post({ url: '/bpm/category/create', data });
}

/** 修改流程分类 */
export function updateCategory(data: CategoryVO) {
  return defHttp.put({ url: '/bpm/category/update', data });
}

/** 删除流程分类 */
export function deleteCategory(id: number) {
  return defHttp.delete({ url: `/bpm/category/delete?id=${id}` });
}

/** 查询流程分类列表 */
export function getCategorySimpleList() {
  return defHttp.get({ url: '/bpm/category/simple-list' });
}

/** 批量修改流程分类的排序 */
export function updateCategorySortBatch(ids: number[]) {
  const params = ids.join(',');
  return defHttp.put({ url: `/bpm/category/update-sort-batch?ids=${params}` });
}
