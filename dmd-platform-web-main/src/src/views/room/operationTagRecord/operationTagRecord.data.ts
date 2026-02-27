import type { BasicColumn, FormSchema } from '@/components/Table'
import { useRender } from '@/components/Table'
import { DICT_TYPE, getDictOptions } from '@/utils/dict'

/**
 * 表格列配置
 */
export const columns: BasicColumn[] = [
  {
    title: '记录ID',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: '操作牌ID',
    dataIndex: 'tagId',
    width: 100,
  },
  {
    title: '站室ID',
    dataIndex: 'stationRoomId',
    width: 100,
  },
  {
    title: '领用单位',
    dataIndex: 'useUnit',
    width: 120,
  },
  {
    title: '领用人',
    dataIndex: 'usePerson',
    width: 100,
  },
  {
    title: '领用时间',
    dataIndex: 'useTime',
    width: 180,
    customRender: ({ text }) => {
      return useRender.renderDate(text)
    },
  },
  {
    title: '记录状态',
    dataIndex: 'status',
    width: 120,
    customRender: ({ text }) => {
      const statusMap = {
        1: { text: '已领用未归还', type: 'warning' },
        2: { text: '已归还', type: 'success' },
        3: { text: '已作废', type: 'default' },
      }
      const status = statusMap[text] || { text: '未知', type: 'default' }
      return useRender.renderTag(status.text, status.type)
    },
  },
  {
    title: '归还时间',
    dataIndex: 'returnTime',
    width: 180,
    customRender: ({ text }) => {
      return text ? useRender.renderDate(text) : '-'
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
    customRender: ({ text }) => {
      return useRender.renderDate(text)
    },
  },
]

/**
 * 搜索表单配置
 */
export const searchFormSchema: FormSchema[] = [
  {
    label: '操作牌ID',
    field: 'tagId',
    component: 'InputNumber',
    colProps: { span: 8 },
  },
  {
    label: '站室ID',
    field: 'stationRoomId',
    component: 'InputNumber',
    colProps: { span: 8 },
  },
  {
    label: '领用人',
    field: 'usePerson',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    label: '记录状态',
    field: 'status',
    component: 'Select',
    componentProps: {
      options: [
        { label: '已领用未归还', value: 1 },
        { label: '已归还', value: 2 },
        { label: '已作废', value: 3 },
      ],
    },
    colProps: { span: 8 },
  },
  {
    label: '领用时间',
    field: 'useTime',
    component: 'RangePicker',
    colProps: { span: 8 },
  },
]

/**
 * 新增/编辑表单配置
 */
export const formSchema: FormSchema[] = [
  {
    label: '记录ID',
    field: 'id',
    show: false,
    component: 'Input',
  },
  {
    label: '操作牌ID',
    field: 'tagId',
    required: true,
    component: 'InputNumber',
    rules: [
      { required: true, message: '请输入操作牌ID', trigger: 'blur' },
    ],
  },
  {
    label: '站室ID',
    field: 'stationRoomId',
    required: true,
    component: 'InputNumber',
    rules: [
      { required: true, message: '请输入站室ID', trigger: 'blur' },
    ],
  },
  {
    label: '领用单位',
    field: 'useUnit',
    component: 'Input',
    rules: [
      { max: 100, message: '领用单位长度不能超过100个字符', trigger: 'blur' },
    ],
  },
  {
    label: '领用人',
    field: 'usePerson',
    required: true,
    component: 'Input',
    rules: [
      { required: true, message: '请输入领用人', trigger: 'blur' },
      { max: 50, message: '领用人长度不能超过50个字符', trigger: 'blur' },
    ],
  },
  {
    label: '领用点检人员',
    field: 'useInspector',
    component: 'Input',
    rules: [
      { max: 50, message: '领用点检人员长度不能超过50个字符', trigger: 'blur' },
    ],
  },
  {
    label: '领用操作人员',
    field: 'useOperator',
    component: 'Input',
    rules: [
      { max: 50, message: '领用操作人员长度不能超过50个字符', trigger: 'blur' },
    ],
  },
  {
    label: '领用时间',
    field: 'useTime',
    required: true,
    component: 'DatePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      showTime: true,
    },
    rules: [
      { required: true, message: '请选择领用时间', trigger: 'change' },
    ],
  },
  {
    label: '记录状态',
    field: 'status',
    required: true,
    component: 'Select',
    componentProps: {
      options: [
        { label: '已领用未归还', value: 1 },
        { label: '已归还', value: 2 },
        { label: '已作废', value: 3 },
      ],
    },
    rules: [
      { required: true, message: '请选择记录状态', trigger: 'change' },
    ],
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    rules: [
      { max: 200, message: '备注长度不能超过200个字符', trigger: 'blur' },
    ],
  },
]

/**
 * 归还表单配置
 */
export const returnFormSchema: FormSchema[] = [
  {
    label: '记录ID',
    field: 'id',
    show: false,
    component: 'Input',
  },
  {
    label: '操作牌ID',
    field: 'tagId',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '领用人',
    field: 'usePerson',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '领用时间',
    field: 'useTime',
    component: 'DatePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      showTime: true,
    },
    dynamicDisabled: true,
  },
  {
    label: '归还人',
    field: 'returnPerson',
    required: true,
    component: 'Input',
    rules: [
      { required: true, message: '请输入归还人', trigger: 'blur' },
      { max: 50, message: '归还人长度不能超过50个字符', trigger: 'blur' },
    ],
  },
  {
    label: '归还点检人员',
    field: 'returnInspector',
    component: 'Input',
    rules: [
      { max: 50, message: '归还点检人员长度不能超过50个字符', trigger: 'blur' },
    ],
  },
  {
    label: '归还操作人员',
    field: 'returnOperator',
    component: 'Input',
    rules: [
      { max: 50, message: '归还操作人员长度不能超过50个字符', trigger: 'blur' },
    ],
  },
  {
    label: '归还备注',
    field: 'remark',
    component: 'InputTextArea',
    rules: [
      { max: 200, message: '备注长度不能超过200个字符', trigger: 'blur' },
    ],
  },
]

/**
 * 作废表单配置
 */
export const invalidFormSchema: FormSchema[] = [
  {
    label: '记录ID',
    field: 'id',
    show: false,
    component: 'Input',
  },
  {
    label: '操作牌ID',
    field: 'tagId',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '领用人',
    field: 'usePerson',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '作废备注',
    field: 'remark',
    required: true,
    component: 'InputTextArea',
    rules: [
      { required: true, message: '请输入作废原因', trigger: 'blur' },
      { max: 200, message: '作废备注长度不能超过200个字符', trigger: 'blur' },
    ],
  },
]
