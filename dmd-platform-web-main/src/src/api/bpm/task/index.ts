import type { BpmProcessInstanceApi } from '../processInstance';

import { defHttp } from '@/utils/http/axios';

export namespace BpmTaskApi {
  /** 流程任务 */
  export interface Task {
    id: number // 编号
    name: string // 监听器名字
    type: string // 监听器类型
    status: number // 监听器状态
    event: string // 监听事件
    valueType: string // 监听器值类型
    processInstance?: BpmProcessInstanceApi.ProcessInstance // 流程实例
  }

  /** 任务管理 */
  export interface TaskManager {
    id: string; // 编号
    name: string; // 任务名称
    createTime: number; // 创建时间
    endTime: number; // 结束时间
    durationInMillis: number; // 持续时间
    status: number; // 状态
    reason: string; // 原因
    ownerUser: any; // 负责人
    assigneeUser: any; // 处理人
    taskDefinitionKey: string; // 任务定义key
    processInstanceId: string; // 流程实例id
    processInstance: BpmProcessInstanceApi.ProcessInstance; // 流程实例
    parentTaskId: any; // 父任务id
    children: any; // 子任务
    formId: any; // 表单id
    formName: any; // 表单名称
    formConf: any; // 表单配置
    formFields: any; // 表单字段
    formVariables: any; // 表单变量
    buttonsSetting: any; // 按钮设置
    signEnable: any; // 签名设置
    reasonRequire: any; // 原因设置
    nodeType: any; // 节点类型
  }
}

/** 查询待办任务分页 */
export function getTaskTodoPage(params: any) {
  return defHttp.get({ url: '/bpm/task/todo-page', params });
}

/** 查询已办任务分页 */
export function getTaskDonePage(params: any) {
  return defHttp.get({ url: '/bpm/task/done-page', params });
}

/** 查询任务管理分页 */
export function getTaskManagerPage(params: any) {
  return defHttp.get({ url: '/bpm/task/manager-page', params });
}

/** 审批任务 */
export function approveTask(data: any) {
  return defHttp.put({ url: '/bpm/task/approve', data });
}

/** 驳回任务 */
export function rejectTask(data: any) {
  return defHttp.put({ url: '/bpm/task/reject', data });
}

/** 根据流程实例 ID 查询任务列表 */
export function getTaskListByProcessInstanceId(id: string) {
  return defHttp.get<BpmTaskApi.TaskManager[]>({
    url: `/bpm/task/list-by-process-instance-id?processInstanceId=${id}`,
  });
}

/** 获取所有可退回的节点 */
export function getTaskListByReturn(id: string) {
  return defHttp.get({ url: `/bpm/task/list-by-return?id=${id}` });
}

/** 退回任务 */
export function returnTask(data: any) {
  return defHttp.put({ url: '/bpm/task/return', data });
}

/** 委派任务 */
export function delegateTask(data: any) {
  return defHttp.put({ url: '/bpm/task/delegate', data });
}

/** 转派任务 */
export function transferTask(data: any) {
  return defHttp.put({ url: '/bpm/task/transfer', data });
}

/** 加签任务 */
export function signCreateTask(data: any) {
  return defHttp.put({ url: '/bpm/task/create-sign', data });
}

/** 减签任务 */
export function signDeleteTask(data: any) {
  return defHttp.delete({ url: '/bpm/task/delete-sign', data });
}

/** 抄送任务 */
export function copyTask(data: any) {
  return defHttp.put({ url: '/bpm/task/copy', data });
}

/** 获取加签任务列表 */
export function getChildrenTaskList(id: string) {
  return defHttp.get({
    url: `/bpm/task/list-by-parent-task-id?parentTaskId=${id}`,
  });
}

/** 撤回任务 */
export function withdrawTask(taskId: string) {

 return defHttp.put({
    url: `/bpm/task/withdraw?taskId=${taskId}`,
  });
}
