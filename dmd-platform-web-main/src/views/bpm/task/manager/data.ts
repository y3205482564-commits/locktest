import type { FormSchema } from '@/components/Form';
import {BasicColumn, useRender} from '@/components/Table';

import { DICT_TYPE } from '@/utils/dict'
// import { formatToDateTime, formatPast2 } from '@/utils/dateUtil';

import { getRangePickerDefaultProps } from '@/utils/rangePickerProps';

/** 列表的搜索表单 */
export function useGridFormSchema(): FormSchema[] {
  return [
    {
      field: 'name',
      label: '任务名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入任务名称',
        allowClear: true,
      },
    },
    {
      field: 'createTime',
      label: '创建时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): BasicColumn[] {
  return [
    {
      dataIndex: 'processInstance.name',
      title: '流程',
      minWidth: 200,
      customRender: ({ record }) => {
        return record.processInstance.name
      }
    },
    {
      dataIndex: 'processInstance.startUser.nickname',
      title: '发起人',
      minWidth: 120,
      customRender: ({ record }) => {
        return record.processInstance.startUser.nickname
      }
    },
    {
      dataIndex: 'name',
      title: '当前任务',
      minWidth: 180,
    },
    {
      dataIndex: 'createTime',
      title: '任务开始时间',
      minWidth: 180,
      // customRender: ({ text }) => {
      //   return text ? formatPast2(text) : '-';
      // },
    },
    {
      dataIndex: 'endTime',
      title: '任务结束时间',
      minWidth: 180,
      // customRender: ({ text }) => {
      //   return text ? formatPast2(text) : '-';
      // },
    },
    {
      dataIndex: 'assigneeUser.nickname',
      title: '审批人',
      minWidth: 180,
      customRender: ({ record }) => {
        return record.assigneeUser.nickname
      }
    },
    {
      dataIndex: 'status',
      title: '审批状态',
      minWidth: 180,
      customRender: ({ text }) => {
        return useRender.renderDict(text, DICT_TYPE.BPM_TASK_STATUS)
      },
    },
    {
      dataIndex: 'reason',
      title: '审批建议',
      minWidth: 180,
    },
    {
      dataIndex: 'durationInMillis',
      title: '耗时',
      minWidth: 180,
      // customRender: ({ text }) => {
      //   return text ? formatPast2(text) : '-';
      // },
    },
    {
      dataIndex: 'processInstanceId',
      title: '流程编号',
      minWidth: 100,
    },
    {
      dataIndex: 'id',
      title: '任务编号',
      minWidth: 100,
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
