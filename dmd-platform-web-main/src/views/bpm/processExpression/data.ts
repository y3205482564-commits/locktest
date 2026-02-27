import type { BasicColumn, FormSchema } from '@/components/Table';

import { useRender } from '@/components/Table';
import { DICT_TYPE, getDictOptions } from '@/utils/dict';
import { CommonStatusEnum } from '@/enums/systemEnum';

/** 新增/修改的表单 */
export function useFormSchema(): FormSchema[] {
  return [
    {
      field: 'id',
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
      field: 'expression',
      label: '表达式',
      component: 'InputTextArea',
      required: true,
      componentProps: {
        placeholder: '请输入表达式',
      },
      colProps: { span: 24 },
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
      field: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS),
        placeholder: '请选择状态',
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
      title: '状态',
      dataIndex: 'status',
      width: 100,
      customRender: ({ text }) => {
        return useRender.renderDict(text, DICT_TYPE.COMMON_STATUS);
      },
    },
    {
      title: '表达式',
      dataIndex: 'expression',
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
      customRender: ({ text }) => {
        return useRender.renderDate(text);
      },
    },
    // {
    //   title: '操作',
    //   width: 120,
    //   fixed: 'right',
    //   slots: { customRender: 'action' },
    // },
  ];
}
