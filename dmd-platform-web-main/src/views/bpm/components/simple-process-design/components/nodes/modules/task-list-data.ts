import type { BasicColumn } from '@/components/Table';

import { DICT_TYPE } from '@/utils/dict';
import { formatToDateTime } from '@/utils/dateUtil';

/** 审批记录列表字段 */
export function useGridColumns(): BasicColumn[] {
  return [
    {
      dataIndex: 'assigneeUser',
      title: '审批人',
      width: 100,
      customRender: ({ record }) => {
        return record.assigneeUser?.nickname || record.ownerUser?.nickname;
      },
    },
    {
      dataIndex: 'deptName',
      title: '部门',
      width: 100,
      customRender: ({ record }) => {
        return record.assigneeUser?.deptName || record.ownerUser?.deptName;
      },
    },
    {
      dataIndex: 'createTime',
      title: '开始时间',
      width: 160,
      customRender: ({ text }) => {
        return text ? formatToDateTime(text) : '';
      },
    },
    {
      dataIndex: 'endTime',
      title: '结束时间',
      width: 160,
      customRender: ({ text }) => {
        return text ? formatToDateTime(text) : '';
      },
    },
    {
      dataIndex: 'status',
      title: '审批状态',
      width: 100,
      // TODO: 使用 DictTag 组件显示字典值
      // slots: { customRender: 'status' },
    },
    {
      dataIndex: 'reason',
      title: '审批建议',
      width: 160,
    },
    {
      dataIndex: 'durationInMillis',
      title: '耗时',
      width: 100,
      // TODO: 格式化耗时
    },
  ];
}
