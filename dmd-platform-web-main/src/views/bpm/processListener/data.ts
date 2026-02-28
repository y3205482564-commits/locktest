import type { BasicColumn, FormSchema } from '@/components/Table';

import { useRender } from '@/components/Table';
import { DICT_TYPE, getDictOptions } from '@/utils/dict';
import { CommonStatusEnum } from '@/enums/systemEnum';
import { BpmNodeTypeEnum } from '@/enums';
export const EVENT_EXECUTION_OPTIONS = [
  {
    label: 'start',
    value: 'start',
  },
  {
    label: 'end',
    value: 'end',
  },
];

export const EVENT_OPTIONS = [
  { label: 'create', value: 'create' },
  { label: 'assignment', value: 'assignment' },
  { label: 'complete', value: 'complete' },
  { label: 'delete', value: 'delete' },
  { label: 'update', value: 'update' },
  { label: 'timeout', value: 'timeout' },
];

/** 新增/修改的表单 */
export function useFormSchema(): FormSchema[] {
  return [
    {
      field: 'id',
      label: '编号',
      component: 'Input',
      show: false,
      colProps: { span: 24 },
    },
    {
      field: 'name',
      label: '名字',
      component: 'Input',
      required: true,
      componentProps: {
        placeholder: '请输入名字',
      },
      colProps: { span: 24 },
    },
    {
      field: 'status',
      label: '状态',
      component: 'RadioButtonGroup',
      defaultValue: CommonStatusEnum.ENABLE,
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS),
      },
      colProps: { span: 24 },
    },
    {
      field: 'type',
      label: '类型',
      component: 'Select',
      required: true,
      componentProps: {
        options: getDictOptions(DICT_TYPE.BPM_PROCESS_LISTENER_TYPE),
        placeholder: '请选择类型',
        allowClear: true,
      },
      colProps: { span: 24 },
    },
    {
      field: 'event',
      label: '事件',
      component: 'Select',
      required: true,
      componentProps: {
        options: EVENT_OPTIONS,
        placeholder: '请选择事件',
        allowClear: true,
      },
      colProps: { span: 24 },
      ifShow: ({ values }) => values.type !== 'execution',
    },
    {
      field: 'event',
      label: '事件',
      component: 'Select',
      required: true,
      componentProps: {
        options: EVENT_EXECUTION_OPTIONS,
        placeholder: '请选择事件',
        allowClear: true,
      },
      colProps: { span: 24 },
      ifShow: ({ values }) => values.type === 'execution',
    },
    {
      field: 'valueType',
      label: '值类型',
      component: 'Select',
      required: true,
      componentProps: {
        options: getDictOptions(DICT_TYPE.BPM_PROCESS_LISTENER_VALUE_TYPE),
        placeholder: '请选择值类型',
        allowClear: true,
      },
      colProps: { span: 24 },
    },
    {
      field: 'value',
      label: '类路径|表达式',
      component: 'InputTextArea',
      required: true,
      componentProps: {
        placeholder: '请输入类路径或表达式',
        rows: 4,
      },
      colProps: { span: 24 },
      ifShow: ({ values }) => values.valueType === 'class' || values.valueType === 'expression' || values.valueType === 'delegateExpression',
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): FormSchema[] {
  return [
    {
      field: 'name',
      label: '名字',
      component: 'Input',
      componentProps: {
        placeholder: '请输入名字',
        allowClear: true,
      },
      colProps: { span: 8 },
    },
    {
      field: 'type',
      label: '类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择类型',
        options: getDictOptions(DICT_TYPE.BPM_PROCESS_LISTENER_TYPE),
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
      title: '编号',
      dataIndex: 'id',
      width: 100,
    },
    {
      title: '名字',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 120,
      customRender: ({ text }) => {
        return useRender.renderDict(text, DICT_TYPE.BPM_PROCESS_LISTENER_TYPE);
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      customRender: ({ text }) => {
        return useRender.renderDict(text, DICT_TYPE.COMMON_STATUS);
      },
    },
    {
      title: '事件',
      dataIndex: 'event',
      width: 120,
    },
    {
      title: '值类型',
      dataIndex: 'valueType',
      width: 120,
      customRender: ({ text }) => {
        return useRender.renderDict(text, DICT_TYPE.BPM_PROCESS_LISTENER_VALUE_TYPE);
      },
    },
    {
      title: '值',
      dataIndex: 'value',
      width: 200,
      customRender: ({ text }) => {
        return text ? (text.length > 30 ? text.substring(0, 30) + '...' : text) : '';
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
      customRender: ({ text }) => {
        return useRender.renderDate(text);
      },
    },
  ];
}
