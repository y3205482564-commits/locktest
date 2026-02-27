import type { BasicColumn, FormSchema } from '@/components/Table';
import { useRender } from '@/components/Table';
import { DICT_TYPE, getDictOptions } from '@/utils/dict';

/** 新增/修改的表单 */
export const formSchema: FormSchema[] = [
  {
    label: '编号',
    field: 'id',
    show: false,
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '分类名',
    field: 'name',
    required: true,
    component: 'Input',
    componentProps: {
      placeholder: '请输入分类名',
    },
    colProps: { span: 24 },
  },
  {
    label: '分类标志',
    field: 'code',
    required: true,
    component: 'Input',
    componentProps: {
      placeholder: '请输入分类标志',
    },
    colProps: { span: 24 },
  },
  {
    label: '分类描述',
    field: 'description',
    component: 'InputTextArea',
    componentProps: {
      placeholder: '请输入分类描述',
    },
    colProps: { span: 24 },
  },
  {
    label: '分类状态',
    field: 'status',
    required: true,
    component: 'RadioGroup',
    defaultValue: 0,
    componentProps: {
      options: getDictOptions(DICT_TYPE.COMMON_STATUS),
    },
    colProps: { span: 24 },
  },
  {
    label: '分类排序',
    field: 'sort',
    component: 'InputNumber',
    defaultValue: 1,
    componentProps: {
      min: 1,
      placeholder: '请输入分类排序',
    },
    colProps: { span: 24 },
  },
];

/** 重命名的表单 */
export const renameFormSchema: FormSchema[] = [
  {
    label: '分类名',
    field: 'name',
    required: true,
    component: 'Input',
    componentProps: {
      placeholder: '请输入分类名',
    },
  },
];

/** 列表的搜索表单 */
export const searchFormSchema: FormSchema[] = [
  {
    label: '分类名',
    field: 'name',
    component: 'Input',
    componentProps: {
      placeholder: '请输入分类名',
    },
    colProps: { span: 4 },
  },
  {
    label: '分类标志',
    field: 'code',
    component: 'Input',
    componentProps: {
      placeholder: '请输入分类标志',
    },
    colProps: { span: 4 },
  },
  {
    label: '分类状态',
    field: 'status',
    component: 'Select',
    componentProps: {
      options: getDictOptions(DICT_TYPE.COMMON_STATUS),
      placeholder: '请选择分类状态',
    },
    colProps: { span: 4 },
  },
  {
    label: '创建时间',
    field: 'createTime',
    component: 'RangePicker',
    colProps: { span: 6 },
  },
];

/** 列表的字段 */
export const columns: BasicColumn[] = [
  {
    title: '分类编号',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: '分类名',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '分类标志',
    dataIndex: 'code',
    width: 200,
  },
  {
    title: '分类描述',
    dataIndex: 'description',
    width: 200,
  },
  {
    title: '分类状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ text }) => {
      return useRender.renderDict(text, DICT_TYPE.COMMON_STATUS);
    },
  },
  {
    title: '分类排序',
    dataIndex: 'sort',
    width: 100,
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
