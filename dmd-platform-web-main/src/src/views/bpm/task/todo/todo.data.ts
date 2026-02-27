import type { BasicColumn, FormSchema } from '@/components/Table'
import { useRender } from '@/components/Table'
import { DICT_TYPE, getDictOptions } from '@/utils/dict';
import { getCategorySimpleList } from '@/api/bpm/category';
import { getSimpleProcessDefinitionList } from '@/api/bpm/definition';
export const columns: BasicColumn[] = [
  {
    title: '任务编号',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: '任务名称',
    dataIndex: 'name',
    width: 180,
  },
  {
    title: '流程名名称',
    dataIndex: 'processInstanceName',
    width: 180,
    customRender: ({ record }) => {
      return  record.processInstance.name
    },
  },
  {
    title: '流程发起人',
    dataIndex: 'processInstanceStartUserNickname',
    width: 180,
    customRender: ({ record }) => {
      return  record.processInstance.startUser.nickname
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
    customRender: ({ text }) => {
      return useRender.renderDate(text)
    },
  }
]

export const searchFormSchema: FormSchema[] = [
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
    // {
    //   field: 'status',
    //   label: '流程状态',
    //   component: 'Select',
    //   componentProps: {
    //     options: getDictOptions(DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS, 'number'),
    //     placeholder: '请选择流程状态',
    //     allowClear: true,
    //   },
    //   colProps: { span: 8 },
    // },
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
    }
]
