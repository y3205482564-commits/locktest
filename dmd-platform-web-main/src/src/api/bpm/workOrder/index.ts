import { defHttp } from '@/utils/http/axios';

/**
 * 检修委托单VO类型定义（匹配后端RepairEntrustOrderVO）
 */
export namespace WorkOrderApi {
  // 检修委托单详情类型（与后端RepairEntrustOrderVO字段一一对应）
  export interface RepairEntrustOrderVO {
    /** 内码（主键） */
    internalCode: string;
    /** 委托单编号 */
    trustId: string;
    /** 设备编号 */
    deviceId: string;
    /** 设备名称 */
    deviceName: string;
    /** 项目类型 */
    projectType: string;
    /** 数量 */
    num: number;
    /** 数量单位 */
    numUnit: string;
    /** 单项申请单编号(项目号) */
    monoApplyformId: string;
    /** 委托时间 */
    trustTime: string;
    /** 需求日期 */
    reqDate: string;
    /** 委托人岗号(姓名) */
    entrustJobId: string;
    /** 点检岗号(姓名) */
    checkJobId: string;
    /** 缓急程度 */
    urgentDegree: string;
    /** 请修原因 */
    repairReason: string;
    /** 检修类别 */
    repairType: string;
    /** 施工类别 */
    constructType: string;
    /** 总人数 */
    totalMans: number;
    /** 总工时 */
    totalHour: number;
    /** 人工费用 */
    manFee: number;
    /** 机具费 */
    machinetoolFee: number;
    /** 物料费用 */
    smFee: number;
    /** 总费用(委托时后的费用信息，多个项目为多个项目的费用) */
    totalFee: number;
    /** 总费用单价（计算用） */
    globalTotalFee: number;
    /** 工作内容 */
    workContent: string;
    /** 开工日期 */
    startDate: string;
    /** 完工日期 */
    finishDate: string;
    /** 建议施工班组 */
    suggestConstructTeam: string;
    /** 实际施工班组 */
    actSquadCode: string;
    /** 完工数量 */
    finishNum: number;
    /** 回退状态 */
    rebukeStatus: string;
    /** 回退原因 */
    fallbackReason: string;
    /** 审核状态 */
    auditStatus: string;
    /** 审核人姓名 */
    auditUserName: string;
    /** 记录创建人姓名 */
    recCreatorName: string;
    /** 记录创建时间 */
    recCreateTime: string;
    /** 状态 */
    status: string;
    /** 可完工标记 */
    finishableFlag: string;
  }
}

/**
 * 通过内码查询工单精简信息
 * @param internalCode 工单内码（路径参数）
 * @returns 检修委托单详情
 */
export async function getRepairEntrustOrderByInternalCode(internalCode: string) {
  return defHttp.get<WorkOrderApi.RepairEntrustOrderVO>({
    url: `/digitalCard/work-order/getRepairEntrustOrderByInternalCode/${internalCode}`, // 后端接口路径
    // 若后端接口有前缀（如/bpm），需补充：url: `/bpm/getRepairEntrustOrderByInternalCode/${internalCode}`
  });
}
