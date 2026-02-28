import { defHttp } from '@/utils/http/axios';

export namespace BpmProcessInstanceApi {
  /** 流程实例 */
  export interface ProcessInstance {
    businessKey: string
    category: string
    categoryName?: string
    createTime: string
    endTime: string
    fields: string[]
    formVariables: Record<string, any>
    id: number
    name: string
    processDefinition?: any
    processDefinitionId: string
    remark: string
    result: number
    startTime?: Date
    startUser?: User
    status: number
    summary?: {
      key: string
      value: string
    }[]
    tasks?: Task[]
  }

  /** 流程实例的任务 */
  export interface Task {
    id: number
    name: string
    assigneeUser?: User
  }

  /** 流程实例的用户信息 */
  export interface User {
    id: number
    nickname: string
    avatar: string
    deptName?: string
  }

  /** 审批详情 */
  export interface ApprovalDetailRespVO {
    activityNodes: ApprovalNodeInfo[]
    formFieldsPermission: any
    processDefinition: any
    processInstance: ProcessInstance
    status: number
    todoTask: any
  }

  /** 审批详情的节点信息 */
  export interface ApprovalNodeInfo {
    candidateStrategy?: number
    candidateUsers?: User[]
    endTime?: Date
    id: string
    name: string
    nodeType: number
    startTime?: Date
    status: number
    processInstanceId?: string
    tasks: ApprovalTaskInfo[]
  }

  /** 审批详情的节点的任务 */
  export interface ApprovalTaskInfo {
    id: number
    assigneeUser: User
    ownerUser: User
    reason: string
    signPicUrl: string
    status: number
  }

  /** 抄送流程实例 */
  export interface ProcessInstanceCopyRespVO {
    activityId: string
    activityName: string
    createTime: number
    createUser: User
    id: number
    processInstanceId: string
    processInstanceName: string
    processInstanceStartTime: number
    reason: string
    startUser: User
    summary: {
      key: string
      value: string
    }[]
    taskId: string
  }

  /** 流程实例的打印数据响应 */
  export interface ProcessPrintDataRespVO {
    printTemplateEnable: boolean
    printTemplateHtml?: string
    processInstance: ProcessInstance
    tasks: {
      description: string
      id: number
      name: string
      signPicUrl?: string
    }[]
  }
}

/** 查询我的流程实例分页 */
export function getProcessInstanceMyPage(params: any) {
  return defHttp.get({ url: '/bpm/process-instance/my-page', params });
}

/** 查询管理员流程实例分页 */
export function getProcessInstanceManagerPage(params: any) {
  return defHttp.get({ url: '/bpm/process-instance/manager-page', params });
}

/** 新增流程实例 */
export function createProcessInstance(data: any) {
  return defHttp.post({ url: '/bpm/process-instance/create', data });
}

/** 申请人主动取消流程实例 */
export function cancelProcessInstanceByStartUser(id: number, reason: string) {
  return defHttp.delete({
    url: '/bpm/process-instance/cancel-by-start-user',
    data: { id, reason },
  });
}

/** 管理员取消流程实例 */
export function cancelProcessInstanceByAdmin(id: number, reason: string) {
  return defHttp.delete({
    url: '/bpm/process-instance/cancel-by-admin',
    data: { id, reason },
  });
}

/** 查询流程实例详情 */
export function getProcessInstance(id: number | string) {
  return defHttp.get<BpmProcessInstanceApi.ProcessInstance>({
    url: `/bpm/process-instance/get?id=${id}`,
  });
}

/** 查询复制流程实例分页 */
export function getProcessInstanceCopyPage(params: any) {
  return defHttp.get({ url: '/bpm/process-instance/copy/page', params });
}

/** 更新流程实例 */
export function updateProcessInstance(data: BpmProcessInstanceApi.ProcessInstance) {
  return defHttp.put({ url: '/bpm/process-instance/update', data });
}

/** 获取审批详情 */
export function getApprovalDetail(params: any) {
  return defHttp.get<BpmProcessInstanceApi.ApprovalDetailRespVO>({
    url: '/bpm/process-instance/get-approval-detail',
    params,
  });
}

/** 获取下一个执行的流程节点 */
export function getNextApprovalNodes(params: any) {
  return defHttp.get<BpmProcessInstanceApi.ApprovalNodeInfo[]>({
    url: '/bpm/process-instance/get-next-approval-nodes',
    params,
  });
}

/** 获取流程实例 BPMN 模型视图 */
export function getProcessInstanceBpmnModelView(id: string) {
  return defHttp.get({
    url: `/bpm/process-instance/get-bpmn-model-view?id=${id}`,
  });
}

/** 获取流程实例打印数据 */
export function getProcessInstancePrintData(id: string) {
  return defHttp.get<BpmProcessInstanceApi.ProcessPrintDataRespVO>({
    url: `/bpm/process-instance/get-print-data?processInstanceId=${id}`,
  });
}
