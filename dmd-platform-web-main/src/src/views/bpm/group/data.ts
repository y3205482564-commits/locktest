import { h, ref } from 'vue';
import { Tag } from 'ant-design-vue';
import type { BasicColumn } from '@/components/Table';
import type { FormSchema } from '@/components/Form';

import { useRender } from '@/components/Table';
import { DICT_TYPE, getDictOptions } from '@/utils/dict';
import { getListSimpleUsers } from '@/api/system/user';

// 状态常量
const CommonStatusEnum = {
  ENABLE: 0,
  DISABLE: 1,
};

/** 关联数据 */
const userList = ref<any[]>([]);
getListSimpleUsers().then((data) => (userList.value = data));

/** 新增/修改的表单 */
export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
    colProps: { span: 24 },
  },
  {
    field: 'name',
    label: '组名',
    component: 'Input',
    componentProps: {
      placeholder: '请输入组名',
    },
    required: true,
    colProps: { span: 24 },
  },
  {
    field: 'description',
    label: '描述',
    component: 'InputTextArea',
    componentProps: {
      placeholder: '请输入描述',
      rows: 3,
    },
    colProps: { span: 24 },
  },
  {
    field: 'userIds',
    label: '成员',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '请选择成员',
      api: getListSimpleUsers,
      labelField: 'nickname',
      valueField: 'id',
      mode: 'multiple',
      rows: 3,
    },
    required: true,
    colProps: { span: 24 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    componentProps: {
      options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
    },
    defaultValue: CommonStatusEnum.ENABLE,
    colProps: { span: 24 },
  },
];

/** 列表的搜索表单 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '组名',
    component: 'Input',
    componentProps: {
      placeholder: '请输入组名',
      allowClear: true,
    },
    colProps: { span: 4 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      placeholder: '请选择状态',
      options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
      allowClear: true,
    },
    colProps: { span: 4 },
  },
  {
    field: 'createTime',
    label: '创建时间',
    component: 'RangePicker',
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
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
    title: '组名',
    dataIndex: 'name',
  },
  {
    title: '描述',
    dataIndex: 'description',
  },
  {
    title: '成员',
    dataIndex: 'userIds',
    customRender: ({ record }) => {
      const userIds = record.userIds || [];
      return h(
        'div',
        { class: 'flex flex-wrap gap-1' },
        userIds.map((userId: number) =>
          h(
            Tag,
            { color: 'blue' },
            () => userList.value.find((u) => u.id === userId)?.nickname || userId,
          ),
        ),
      );
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender: ({ text }) => {
      return useRender.renderDict(text, DICT_TYPE.COMMON_STATUS);
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    customRender: ({ text }) => {
      return useRender.renderDate(text);
    },
  },
];
