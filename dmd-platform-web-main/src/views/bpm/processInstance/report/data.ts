import type { FormSchema } from '@/components/Form';
import type { BasicColumn } from '@/components/Table';
import { useRender } from '@/components/Table';

import { DICT_TYPE, getDictOptions } from '@/utils/dict';

import { getSimpleUserList } from '@/api/system/user';
import { getRangePickerDefaultProps } from '@/utils/rangePickerProps';

interface FormField {
  field: string
  title: string
  type: string
}

/** 列表的搜索表单 */
export function useGridFormSchema(
  formFields: FormField[] = [],
): FormSchema[] {
  // 基础搜索字段配置
  const baseFormSchema: FormSchema[] = [
    {
      field: 'startUserId',
      label: '发起人',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择发起人',
        allowClear: true,
        api: getSimpleUserList,
        labelField: 'nickname',
        valueField: 'id',
      },
      colProps: { span: 6 },
    },
    {
      field: 'name',
      label: '流程名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入流程名称',
        allowClear: true,
      },
      colProps: { span: 6 },

    },
    {
      field: 'status',
      label: '流程状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择流程状态',
        allowClear: true,
        options: getDictOptions(
          DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS,
          'number',
        ),
      },
      colProps: { span: 6 },

    },
    {
      field: 'createTime',
      label: '发起时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
      colProps: { span: 6 },
    },
    {
      field: 'endTime',
      label: '结束时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
      colProps: { span: 6 },
    },
  ];

  // 动态表单字段配置：目前支持 input 和 textarea 类型
  const dynamicFormSchema: FormSchema[] = formFields
    .filter((item) => ['input', 'textarea'].includes(item.type))
    .map((item) => ({
      field: `formFieldsParams.${item.field}`,
      label: item.title,
      component: 'Input',
      componentProps: {
        placeholder: `请输入${item.title}`,
        allowClear: true,
      },
    }));

  return [...baseFormSchema, ...dynamicFormSchema];
}

/** 列表的字段 */
export function useGridColumns(
  formFields: FormField[] = [],
): BasicColumn[] {
  // 基础列配置
  const baseColumns: BasicColumn[] = [
    {
      dataIndex: 'name',
      title: '流程名称',
      width: 250,
      fixed: 'left',
    },
    {
      dataIndex: 'startUser.nickname',
      title: '流程发起人',
      width: 200,
      customRender: ({ record }) => {
        return record.startUser?.nickname || '';
      },
    },
    {
      dataIndex: 'status',
      title: '流程状态',
      width: 120,
      customRender: ({ text }) => {
        return useRender.renderDict(text, DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS);
      },
    },
    {
      dataIndex: 'startTime',
      title: '发起时间',
      width: 180,
      customRender: ({ text }) => {
        return useRender.renderDate(text);
      },
    },
    {
      dataIndex: 'endTime',
      title: '结束时间',
      width: 180,
      customRender: ({ text }) => {
        return useRender.renderDate(text);
      },
    },
  ];

  // 动态表单字段列配置：根据表单字段生成对应的列，从 formVariables 中获取值
  const formFieldColumns = formFields.map((item) => ({
    dataIndex: `formVariables.${item.field}`,
    title: item.title,
    width: 120,
    customRender: ({ record }: any) => {
      return record.formVariables?.[item.field] ?? '';
    },
  }));

  return [
    ...baseColumns,
    ...formFieldColumns,
  ];
}
