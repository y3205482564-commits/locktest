import type { FormSchema } from '@/components/Form';
import { DICT_TYPE, getDictOptions } from '@/utils/dict';

// 状态常量
const CommonStatusEnum = {
  ENABLE: 0,
  DISABLE: 1,
};

/** 新增/修改的表单 */
export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
    colProps: {
      span: 24,
    },
  },
  {
    field: 'name',
    label: '表单名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入表单名称',
    },
    required: true,
    colProps: {
      span: 24,
    },
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    componentProps: {
      options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
    },
    defaultValue: CommonStatusEnum.ENABLE,
    colProps: {
      span: 24,
    },
  },
  {
    field: 'remark',
    label: '备注',
    component: 'InputTextArea',
    componentProps: {
      placeholder: '请输入备注',
      rows: 4,
    },
    colProps: {
      span: 24,
    },
  },
];
