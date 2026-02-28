import type { BasicColumn, FormSchema } from '@/components/Table';
import type { DescItem } from '@/components/Description';

import { h } from 'vue';

import { useRender } from '@/components/Table';
import { DICT_TYPE, getDictOptions } from '@/utils/dict';
import { formatDateTime } from '@/utils/date';
/** 新增/修改的表单 */
export function useFormSchema(): FormSchema[] {
  return [
    {
      field: 'id',
      component: 'Input',
      show: false,
    },
    {
      field: 'type',
      label: '请假类型',
      component: 'Select',
      required: true,
      componentProps: {
        placeholder: '请选择请假类型',
        options: getDictOptions(DICT_TYPE.BPM_OA_LEAVE_TYPE),
        allowClear: true,
      },
    },

    {
      field: 'startTime',
      label: '开始时间',
      component: 'DatePicker',
      required: true,
      componentProps: {
        placeholder: '请选择开始时间',
        showTime: true,
        valueFormat: 'x',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      field: 'endTime',
      label: '结束时间',
      component: 'DatePicker',
      required: true,
      componentProps: {
        placeholder: '请选择结束时间',
        showTime: true,
        valueFormat: 'x',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      field: 'reason',
      label: '原因',
      component: 'InputTextArea',
      required: true,
      componentProps: {
        placeholder: '请输入原因',
      },
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): FormSchema[] {
  return [
    {
      field: 'type',
      label: '请假类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择请假类型',
        options: getDictOptions(DICT_TYPE.BPM_OA_LEAVE_TYPE),
        allowClear: true,
      },
      colProps: { span: 8 },
    },
    {
      field: 'createTime',
      label: '创建时间',
      component: 'RangePicker',
      componentProps: {
        allowClear: true,
      },
      colProps: { span: 8 },
    },
    {
      field: 'status',
      label: '审批结果',
      component: 'Select',
      componentProps: {
        placeholder: '请选择审批结果',
        allowClear: true,
        options: getDictOptions(DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS),
      },
      colProps: { span: 8 },
    },
    {
      field: 'reason',
      label: '原因',
      component: 'Input',
      componentProps: {
        placeholder: '请输入原因',
        allowClear: true,
      },
      colProps: { span: 8 },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): BasicColumn[] {
  return [
    {
      title: '申请编号',
      dataIndex: 'id',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      customRender: ({ text }) => {
        return useRender.renderDict(text, DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS);
      },
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      width: 180,
      customRender: ({ text }) => {
        return useRender.renderDate(text);
      },
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 180,
      customRender: ({ text }) => {
        return useRender.renderDate(text);
      },
    },
    {
      title: '请假类型',
      dataIndex: 'type',
      width: 100,
      customRender: ({ text }) => {
        return useRender.renderDict(text, DICT_TYPE.BPM_OA_LEAVE_TYPE);
      },
    },
    {
      title: '原因',
      dataIndex: 'reason',
      width: 150,
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      width: 180,
      customRender: ({ text }) => {
        return useRender.renderDate(text);
      },
    },
    {
      title: '操作',
      width: 220,
      fixed: 'right',
    },
  ];
}

/** 详情 */
export function useDetailFormSchema(): DescItem[] {
  return [
    {
      label: '请假类型',
      field: 'type',
      render: (val) =>
        useRender.renderDict(val, DICT_TYPE.BPM_OA_LEAVE_TYPE),
    },
    {
      label: '开始时间',
      field: 'startTime',
      render: (val) => formatDateTime(val) as string,
    },
    {
      label: '结束时间',
      field: 'endTime',
      render: (val) => formatDateTime(val) as string,
    },
    {
      label: '原因',
      field: 'reason',
    },
  ];
}
