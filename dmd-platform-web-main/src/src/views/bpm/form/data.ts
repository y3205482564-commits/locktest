import type { BasicColumn } from '@/components/Table';
import type { FormSchema } from '@/components/Form';
import { useRender } from '@/components/Table';
import { DICT_TYPE } from '@/utils/dict';

/** 列表的搜索表单 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '表单名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入表单名称',
      allowClear: true,
    },
    colProps: { span: 6 },
  },
];

/** 列表的字段 */
export const columns: BasicColumn[] = [
  {
    title: '编号',
    dataIndex: 'id',
  },
  {
    title: '表单名称',
    dataIndex: 'name',
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender: ({ text }) => {
      return useRender.renderDict(text, DICT_TYPE.COMMON_STATUS);
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    customRender: ({ text }) => {
      return useRender.renderDate(text);
    },
  },
];
