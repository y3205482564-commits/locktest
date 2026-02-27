import {FormSchema} from '@/components/Table'
import {listSimpleStationRoom} from '@/api/room/stationRoom/stationRoom'
import {getListSimpleUsers} from '@/api/system/user'

// 全局变量：存储用户列表（用于负责人下拉选项）
let userOptions: any[] = []

// 初始化加载用户列表（页面加载时执行）
async function initUserData() {
  try {
    const res = await getListSimpleUsers()
    userOptions = res || []
  } catch (error) {
    console.error('加载用户列表失败：', error)
    userOptions = []
  }
}
await initUserData()

// 表格列配置
export const columns = [
  {
    title: '站室名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
    align: 'left',
  },
  {
    title: '负责人',
    dataIndex: 'leaderUserId',
    key: 'leader',
    width: 120,
    customRender: ({ text }) => {
      if (!text) return '未设置'
      const user = userOptions.find(item => item.id === text)
      return user ? user.nickname : `未知【${text}】`
    },
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    key: 'phone',
    width: 150,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    width: 200,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    customRender: ({ record }) => {
      return record.status === 0 ? '正常' : '停用'
    },
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
    width: 80,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
    customRender: ({ text }) => {
      if (!text) return '-'
      return new Date(text).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    },
  },
] as any[]

// 搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '站室名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入站室名称',
    },
    colProps: { span: 8 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      placeholder: '请选择状态',
      options: [
        { label: '正常', value: 0 },
        { label: '停用', value: 1 },
      ],
    },
    colProps: { span: 8 },
  },
]

// 新增/编辑站室表单配置
export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: '站室ID',
    component: 'Input',
    show: false,
  },

  {
    field: 'parentId',
    label: '上级站室',
    component: 'ApiTreeSelect',
    required: true,
    componentProps: {
      api: () => listSimpleStationRoom(),
      placeholder: '请选择上级站室（1级站室请选根节点）',
      handleTree: 'id',
    },
  },
  {
    field: 'name',
    label: '站室名称',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入站室名称（最长30个字符）',
    },
    rules: [
      { required: true, message: '请输入站室名称' },
      { max: 30, message: '站室名称长度不能超过30个字符' },
    ],
  },
  {
    field: 'sort',
    label: '显示顺序',
    component: 'InputNumber',
    required: true,
    defaultValue: 0,
    componentProps: {
      min: 0,
      max: 999,
      placeholder: '请输入显示顺序（0-999）',
    },
    rules: [
      { required: true, message: '请输入显示顺序' },
      { type: 'number', min: 0, max: 999, message: '显示顺序需为0-999的数字' },
    ],
  },
  {
    field: 'leaderUserId',
    label: '负责人',
    component: 'Select',
    componentProps: {
      placeholder: '请选择负责人',
      options: userOptions.map(user => ({
        label: user.nickname,
        value: user.id,
      })),
      allowClear: true,
    },
    rules: [
      { type: 'number', message: '请选择有效的负责人' },
    ],
  },
  {
    field: 'phone',
    label: '联系电话',
    component: 'Input',
    componentProps: {
      placeholder: '请输入11位手机号码',
    },
    rules: [
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号' },
      { max: 11, message: '联系电话长度不能超过11个字符' },
    ],
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'Input',
    componentProps: {
      placeholder: '请输入邮箱地址',
    },
    rules: [
      { type: 'email', message: '请输入正确的邮箱格式' },
      { max: 50, message: '邮箱长度不能超过50个字符' },
    ],
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    required: true,
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '正常', value: 0 },
        { label: '停用', value: 1 },
      ],
    },
  },
]
