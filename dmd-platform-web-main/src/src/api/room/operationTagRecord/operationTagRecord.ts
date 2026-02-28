import { defHttp } from '@/utils/http/axios'
import { PageParam } from '@/api/model/baseModel'

/**
 * 操作牌领用归还记录 VO
 */
export interface OperationTagRecordVO {
  /** 主键ID */
  id?: number
  /** 关联操作牌ID */
  tagId: number
  /** 关联站室ID */
  stationRoomId: number
  /** 领用单位 */
  useUnit?: string
  /** 领用人 */
  usePerson?: string
  /** 领用时点检人员 */
  useInspector?: string
  /** 领用操作人员 */
  useOperator?: string
  /** 领用时间 */
  useTime?: Date
  /** 归还人 */
  returnPerson?: string
  /** 归还时点检人员 */
  returnInspector?: string
  /** 归还操作人员 */
  returnOperator?: string
  /** 归还时间 */
  returnTime?: Date
  /** 记录状态（1=已领用未归还 2=已归还 3=作废） */
  status?: number
  /** 备注 */
  remark?: string
  /** 创建人 */
  creator?: string
  /** 创建时间 */
  createTime?: Date
  /** 更新人 */
  updater?: string
  /** 更新时间 */
  updateTime?: Date
  /** 是否删除 */
  deleted?: boolean
  /** 租户编号 */
  tenantId?: number
}

/**
 * 操作牌领用归还记录分页查询请求 VO
 */
export interface OperationTagRecordPageReqVO extends PageParam {
  /** 关联操作牌ID */
  tagId?: number
  /** 关联站室ID */
  stationRoomId?: number
  /** 领用单位 */
  useUnit?: string
  /** 领用人 */
  usePerson?: string
  /** 记录状态（1=已领用未归还 2=已归还 3=作废） */
  status?: number
  /** 领用时间开始 */
  useTimeStart?: Date
  /** 领用时间结束 */
  useTimeEnd?: Date
  /** 租户编号 */
  tenantId?: number
}

/**
 * 操作牌归还操作请求 VO
 */
export interface OperationTagRecordReturnReqVO {
  /** 记录ID */
  id: number
  /** 归还人 */
  returnPerson: string
  /** 归还时点检人员 */
  returnInspector?: string
  /** 归还操作人员 */
  returnOperator?: string
  /** 备注 */
  remark?: string
}

/**
 * 操作牌作废操作请求 VO
 */
export interface OperationTagRecordInvalidReqVO {
  /** 记录ID */
  id: number
  /** 作废备注 */
  remark?: string
}

/**
 * 导出请求 VO
 */
export interface OperationTagRecordExportReqVO {
  /** 关联操作牌ID */
  tagId?: number
  /** 关联站室ID */
  stationRoomId?: number
  /** 领用单位 */
  useUnit?: string
  /** 领用人 */
  usePerson?: string
  /** 记录状态（1=已领用未归还 2=已归还 3=作废） */
  status?: number
  /** 领用时间开始 */
  useTimeStart?: Date
  /** 领用时间结束 */
  useTimeEnd?: Date
  /** 租户编号 */
  tenantId?: number
}

// ============================== 接口请求方法 ==============================

/**
 * 查询操作牌领用归还记录分页
 */
export function getOperationTagRecordPage(params: OperationTagRecordPageReqVO) {
  return defHttp.get({ url: '/digitalCard/operation-tag-record/page', params })
}

/**
 * 获取操作牌领用归还记录精简列表（下拉选项用）
 */
export function listSimpleOperationTagRecords() {
  return defHttp.get({ url: '/digitalCard/operation-tag-record/list-all-simple' })
}

/**
 * 获取操作牌领用归还记录精简列表（兼容路径）
 */
export function getSimpleOperationTagRecordList() {
  return defHttp.get({ url: '/digitalCard/operation-tag-record/simple-list' })
}

/**
 * 查询操作牌领用归还记录详情
 */
export function getOperationTagRecord(id: number) {
  return defHttp.get({ url: `/digitalCard/operation-tag-record/get?id=${id}` })
}

/**
 * 新增操作牌领用归还记录
 */
export function createOperationTagRecord(data: OperationTagRecordVO) {
  return defHttp.post({ url: '/digitalCard/operation-tag-record/create', data })
}

/**
 * 修改操作牌领用归还记录
 */
export function updateOperationTagRecord(data: OperationTagRecordVO) {
  return defHttp.put({ url: '/digitalCard/operation-tag-record/update', data })
}

/**
 * 删除操作牌领用归还记录
 */
export function deleteOperationTagRecord(id: number) {
  return defHttp.delete({ url: `/digitalCard/operation-tag-record/delete?id=${id}` })
}

/**
 * 批量删除操作牌领用归还记录
 */
export function deleteOperationTagRecordList(ids: number[]) {
  return defHttp.delete({ url: `/digitalCard/operation-tag-record/delete-list?ids=${ids.join(',')}` })
}

/**
 * 完成操作牌归还操作
 */
export function completeReturn(data: OperationTagRecordReturnReqVO) {
  return defHttp.put({ url: '/digitalCard/operation-tag-record/complete-return', data })
}

/**
 * 作废操作牌领用归还记录
 */
export function invalidOperationTagRecord(data: OperationTagRecordInvalidReqVO) {
  return defHttp.put({ url: '/digitalCard/operation-tag-record/invalid', data })
}

/**
 * 导出操作牌领用归还记录
 */
export function exportOperationTagRecord(params: OperationTagRecordExportReqVO) {
  return defHttp.download({ url: '/digitalCard/operation-tag-record/export-excel', params }, '操作牌领用归还记录.xls')
}
