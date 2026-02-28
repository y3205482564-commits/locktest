import { defHttp } from '@/utils/http/axios';

export namespace BpmUserGroupApi {
  /** 用户组 */
  export interface UserGroup {
    id?: number
    name: string
    description: string
    userIds: number[]
    status: number
    remark: string
    createTime: string
  }
}

/** 查询用户组分页 */
export function getUserGroupPage(params: any) {
  return defHttp.get({ url: '/bpm/user-group/page', params });
}

/** 查询用户组详情 */
export function getUserGroup(id: number) {
  return defHttp.get<BpmUserGroupApi.UserGroup>({ url: `/bpm/user-group/get?id=${id}` });
}

/** 新增用户组 */
export function createUserGroup(data: BpmUserGroupApi.UserGroup) {
  return defHttp.post<number>({ url: '/bpm/user-group/create', data });
}

/** 修改用户组 */
export function updateUserGroup(data: BpmUserGroupApi.UserGroup) {
  return defHttp.put<boolean>({ url: '/bpm/user-group/update', data });
}

/** 删除用户组 */
export function deleteUserGroup(id: number) {
  return defHttp.delete<boolean>({ url: `/bpm/user-group/delete?id=${id}` });
}

/** 查询用户组列表 */
export function getUserGroupSimpleList() {
  return defHttp.get<BpmUserGroupApi.UserGroup[]>({ url: `/bpm/user-group/simple-list` });
}
