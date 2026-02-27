import type { FormSchema } from '@/components/Form';
import type { BasicColumn } from '@/components/Table';

import { getRangePickerDefaultProps } from '@/utils/rangePickerProps';
import { formatToDateTime } from '@/utils/dateUtil';

/** 列表的搜索表单 */
export function useSearchForm(): FormSchema[] {
  return [
    {
      field: 'name',
      label: '流程名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入流程名称',
        allowClear: true,
      },
      colProps: {
        span: 8,
      },
    },
    {
      field: 'createTime',
      label: '抄送时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
      colProps: {
        span: 8,
      },
    },
  ];
}

/** 列表的字段 */
export function useColumns(): BasicColumn[] {
  return [
    {
      title: '流程名称',
      dataIndex: 'processInstanceName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '摘要',
      dataIndex: 'summary',
      width: 200,
      customRender: ({ record }) => {
        const summary = record?.summary;
        if (!summary || summary.length === 0) return '-';

        return summary
          .map((item: any) => `${item.key} : ${item.value}`)
          .join('\n');
      },
    },
    {
      title: '流程发起人',
      dataIndex: ['startUser', 'nickname'],
      width: 120,
    },
    {
      title: '流程发起时间',
      dataIndex: 'processInstanceStartTime',
      width: 180,
      customRender: ({ text }) => {
        return text ? formatToDateTime(text) : '-';
      },
    },
    {
      title: '抄送节点',
      dataIndex: 'activityName',
      width: 120,
    },
    {
      title: '抄送人',
      dataIndex: ['createUser', 'nickname'],
      width: 120,
      customRender: ({ text }) => {
        return text || '-';
      },
    },
    {
      title: '抄送意见',
      dataIndex: 'reason',
      width: 180,
    },
    {
      title: '抄送时间',
      dataIndex: 'createTime',
      width: 180,
      customRender: ({ text }) => {
        return text ? formatToDateTime(text) : '-';
      },
    }
  ];
}