import type { BasicColumn } from '@/components/Table';

import { DICT_TYPE } from '@/utils/dict';
import { formatToDateTime } from '@/utils/dateUtil';

/** 流程实例列表字段 */
export function useGridColumns(): BasicColumn[] {
  return [
    {
      dataIndex: 'startUser',
      title: '发起人',
      width: 100,
      customRender: ({ record }) => {
        return record.startUser?.nickname;
      },
    },
    {
      dataIndex: 'deptName',
      title: '部门',
      width: 100,
      customRender: ({ record }) => {
        return record.startUser?.deptName;
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
      title: '流程状态',
      width: 100,
      // TODO: 使用 DictTag 组件显示字典值
      // slots: { customRender: 'status' },
    },
    {
      dataIndex: 'durationInMillis',
      title: '耗时',
      width: 100,
      // TODO: 格式化耗时
    },
  ];
}
