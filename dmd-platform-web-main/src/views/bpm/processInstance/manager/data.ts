import type { BasicColumn } from '@/components/Table';
import type { FormSchema } from '@/components/Form';
import { useRender } from '@/components/Table';
import { DICT_TYPE, getDictOptions } from '@/utils/dict';
import { getCategorySimpleList } from '@/api/bpm/category';
import { getListSimpleUsers } from '@/api/system/user';

/** 列表的搜索表单 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'startUserId',
    label: '发起人',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '请选择发起人',
      allowClear: true,
      api: getListSimpleUsers,
      labelField: 'nickname',
      valueField: 'id',
    },
    colProps: { span: 8 },
  },
  {
    field: 'name',
    label: '流程名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入流程名称',
      allowClear: true,
    },
    colProps: { span: 8 },
  },
  {
    field: 'category',
    label: '流程分类',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '请输入流程分类',
      allowClear: true,
      api: getCategorySimpleList,
      labelField: 'name',
      valueField: 'code',
    },
    colProps: { span: 8 },
  },
  {
    field: 'status',
    label: '流程状态',
    component: 'Select',
    componentProps: {
      options: getDictOptions(DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS, 'number'),
      placeholder: '请选择流程状态',
      allowClear: true,
    },
    colProps: { span: 8 },
  },
  {
    field: 'createTime',
    label: '发起时间',
    component: 'RangePicker',
    componentProps: {
      allowClear: true,
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    colProps: { span: 8 },
  },
];

/** 流程实例状态枚举 */
export const BpmProcessInstanceStatus = {
  RUNNING: 1, // 进行中
  APPROVE: 2, // 审批通过
  REJECT: 3, // 审批不通过
  CANCEL: 4, // 已取消
};

/** 列表的字段 */
export const columns: BasicColumn[] = [
  {
    title: '流程编号',
    dataIndex: 'id',
    width: 320,
    fixed: 'left',
  },
  {
    title: '流程名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '流程分类',
    dataIndex: 'categoryName',
    width: 120,
  },
  {
    title: '流程发起人',
    dataIndex: 'startUser',
    width: 120,
    customRender: ({ record }) => {
      return record.startUser?.nickname || '-';
    },
  },
  {
    title: '发起部门',
    dataIndex: 'startUserDept',
    width: 120,
    customRender: ({ record }) => {
      return record.startUser?.deptName || '-';
    },
  },
  {
    title: '流程状态',
    dataIndex: 'status',
    width: 120,
    customRender: ({ text }) => {
      return useRender.renderDict(text, DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS);
    },
  },
  {
    title: '发起时间',
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
    title: '当前审批任务',
    dataIndex: 'tasks',
    width: 200,
  },
];
