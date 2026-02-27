import { defHttp } from '@/utils/http/axios';

/**
 * 操作标签VO类型定义（匹配后端OperationTagVO）
 */
export namespace OperationTagApi {
  // 操作标签完整信息类型（与后端OperationTagVO字段一一对应）
  export interface OperationTagVO {
    /** 主键ID */
    id: number;
    /** 租户ID，用于多租户隔离 */
    tenantId: number;
    /** 标签类型（如：绿色操作牌/红色操作牌） */
    tagType: string;
    /** 归属区域（如：4300炉轧区） */
    area: string;
    /** 操作台编号（如：1#操作台） */
    consoleNo: string;
    /** 设备位置（如：加热炉入炉辊道） */
    deviceLocation: string;
    /** 归属单位（如：首钢京唐公司中厚板事业部） */
    belongUnit: string;
    /** 作业数（支持负数，如：0/-1） */
    workCount: number;
    /** 领用单位（如：首宝） */
    useUnit: string;
    /** 领用人（如：张三） */
    usePerson: string;
    /** 点检人员（如：李四） */
    inspector: string;
    /** 操作人员（如：王五） */
    operator: string;
    /** 领用时间（如：2025-10-10 08:30:00） */
    useTime: string;
    /** 创建人 */
    creator: string;
    /** 创建时间 */
    createTime: string;
    /** 更新人 */
    updater: string;
    /** 更新时间 */
    updateTime: string;
    /** 删除状态：0=未删除，1=已删除 */
    deleted: number;
  }
}

/**
 * 获取操作标签全部信息列表
 * @returns 操作标签完整信息列表（仅返回未删除的标签）
 */
export async function getOperationTagList() {
  return defHttp.get<OperationTagApi.OperationTagVO[]>({
    url: '/digitalCard/operation-tag/list-all', // 匹配后端Controller的接口路径
  });
}
