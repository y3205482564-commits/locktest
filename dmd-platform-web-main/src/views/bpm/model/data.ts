import type { BasicColumn } from '@/components/Table';

/** 列表的字段 - BasicTable 用 */
export const columns: BasicColumn[] = [
  {
    dataIndex: 'name',
    title: '流程名称',
    width: 200,
  },
  {
    dataIndex: 'startUserIds',
    title: '可见范围',
    width: 150,
  },
  {
    dataIndex: 'type',
    title: '流程类型',
    width: 120,
    customRender: ({ record }) => {
      // TODO: 使用字典标签显示
      return record.type;
    },
  },
  {
    dataIndex: 'formType',
    title: '表单信息',
    width: 150,
  },
  {
    dataIndex: 'deploymentTime',
    title: '最后发布',
    width: 280,
  },
];

// 备注：原 VxeTable 字段配置已注释，项目中未配置 vxe-table 适配器
/*
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
export function useGridColumns(): VxeTableGridOptions<ModelVO>['columns'] {
  return [
    {
      field: 'name',
      title: '流程名称',
      minWidth: 200,
      slots: { default: 'name' },
    },
    {
      field: 'startUserIds',
      title: '可见范围',
      minWidth: 150,
      slots: { default: 'startUserIds' },
    },
    {
      field: 'type',
      title: '流程类型',
      minWidth: 120,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.BPM_MODEL_TYPE },
      },
    },
    {
      field: 'formType',
      title: '表单信息',
      minWidth: 150,
      slots: { default: 'formInfo' },
    },
    {
      field: 'deploymentTime',
      title: '最后发布',
      minWidth: 280,
      slots: { default: 'deploymentTime' },
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
*/
