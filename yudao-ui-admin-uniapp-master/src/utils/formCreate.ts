/**
 * 表单创建工具函数
 * 用于解析表单配置和字段，构建表单渲染所需的数据结构
 */

/**
 * 设置表单配置和字段
 * @param formData 表单数据对象
 * @param conf 表单配置
 * @param fields 表单字段
 * @param formVariables 表单变量值
 * @param defaultDisabled 是否默认只读（流程详情会根据字段权限再覆盖；传 false 时由调用方按权限设置）
 */
export function setConfAndFields2(formData: any, conf: any, fields: any, formVariables?: any, defaultDisabled = true) {
  // 初始化表单数据：支持接口返回的 JSON 字符串，保证审批详情能展示已提交内容
  let initial: Record<string, any> = {}
  if (formVariables != null) {
    if (typeof formVariables === 'object') {
      initial = { ...formVariables }
    } else if (typeof formVariables === 'string') {
      try {
        const parsed = JSON.parse(formVariables)
        initial = parsed && typeof parsed === 'object' ? { ...parsed } : {}
      } catch {
        initial = {}
      }
    }
  }
  formData.formData = initial
  formData.rule = []
  formData.option = {
    submitBtn: false,
    resetBtn: false,
    formData: initial
  }

  // 解析配置
  if (conf) {
    try {
      const confObj = typeof conf === 'string' ? JSON.parse(conf) : conf
      if (confObj) {
        formData.option = {
          ...formData.option,
          ...confObj
        }
      }
    } catch (error) {
      console.error('解析表单配置失败:', error)
    }
  }

  // 解析字段（兼容 form-create 设计器：field/title 与 prop/label）
  if (fields != null && fields !== '') {
    try {
      let fieldsArray = typeof fields === 'string' ? JSON.parse(fields) : fields
      if (Array.isArray(fieldsArray)) {
        fieldsArray = fieldsArray.map((field: any) => {
          const parsed = typeof field === 'string' ? JSON.parse(field) : field
          return parsed && typeof parsed === 'object' ? parsed : null
        }).filter(Boolean)
        formData.rule = fieldsArray.map((field: any) => {
          const prop = field.prop ?? field.field
          const label = field.label ?? field.title ?? ''
          const value = initial[prop] !== undefined ? initial[prop] : (field.value !== undefined ? field.value : field.defaultValue)
          return {
            ...field,
            prop: prop,
            field: prop,
            label,
            title: label,
            value,
            props: {
              ...field.props,
              disabled: defaultDisabled
            }
          }
        })
        // 用每个字段的默认值/规则值回填 formData，保证无 formVariables 时展示与可编辑项都有初始值
        formData.rule.forEach((item: any) => {
          if (item.prop && formData.formData[item.prop] === undefined) {
            formData.formData[item.prop] = item.value
          }
        })
        // 多选字段值规范为数组（含接口/用户选择器 selectType=checkbox）
        formData.rule.forEach((item: any) => {
          if (!item.prop) return
          const t = String((item.type ?? '').toLowerCase())
          const selectType = item.props?.selectType ?? item.selectType
          const isMulti =
            item.type === 'checkbox' ||
            (item.type === 'select' && item.props?.multiple) ||
            selectType === 'checkbox' ||
            (['apiselect', 'api-select', 'userselect', 'user-select'].includes(t) && selectType === 'checkbox')
          if (isMulti) {
            const v = formData.formData[item.prop]
            formData.formData[item.prop] = Array.isArray(v) ? v : (v != null ? [v] : [])
          }
        })
      }
    } catch (error) {
      console.error('解析表单字段失败:', error)
    }
  }
}

/**
 * 构建表单字段值
 * @param fields 表单字段
 * @param formVariables 表单变量值
 * @returns 构建后的表单字段值对象
 */
export function buildFormValues(fields: any[], formVariables: any) {
  const values: any = {}
  
  if (Array.isArray(fields) && formVariables) {
    fields.forEach((field: any) => {
      if (field.prop && formVariables[field.prop] !== undefined) {
        values[field.prop] = formVariables[field.prop]
      }
    })
  }
  
  return values
}

/**
 * 格式化表单字段显示值
 * @param field 表单字段
 * @param value 字段值
 * @returns 格式化后的显示值
 */
export function formatFieldValue(field: any, value: any) {
  if (value === undefined || value === null) {
    // 显示字段的默认值，如果没有默认值则显示空字符串
    return field.defaultValue !== undefined ? field.defaultValue : ''
  }
  
  // 处理选择框、单选（设计器可能用 label 或 text；value 与 option 可能数字/字符串混用，用宽松比较）
  if ((field.type === 'select' || field.type === 'radio') && field.options) {
    const option = field.options.find((opt: any) => opt.value == value || String(opt.value) === String(value))
    return option ? (option.label ?? option.text ?? String(value)) : value
  }
  
  // 处理日期类型（含 el-date-picker / el-datetime-picker，与 PC 一致）
  const dateType = (field.type ?? '').toLowerCase()
  if (dateType === 'date' || dateType === 'datetime' || dateType === 'el-date-picker' || dateType === 'el-datetime-picker') {
    if (typeof value === 'string') {
      return value
    }
    const date = new Date(value)
    if (isNaN(date.getTime())) return value
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }
  
  // 处理数组类型：多选框、文件/图片上传等
  if (Array.isArray(value)) {
    if (field.options && value.length > 0) {
      // 多选框：按选项转成文案再拼接
      const labels = value.map((v: any) => {
        const opt = field.options.find((o: any) => o.value == v || String(o.value) === String(v))
        return opt ? (opt.label ?? opt.text ?? String(v)) : String(v)
      })
      return labels.join('，')
    }
    // 文件/图片上传：可能是 { url, name } 或 字符串
    const parts = value.map((item: any) => {
      if (item && typeof item === 'object') {
        return item.name ?? item.url ?? item.title ?? ''
      }
      return String(item ?? '')
    }).filter(Boolean)
    return parts.length > 0 ? parts.join('，') : ''
  }
  
  return value === undefined || value === null ? '' : value
}

/** 字段类型判断（兼容 form-create 设计器 type：如 el-switch、input 等） */
function _typeIs(field: any, ...types: string[]) {
  const t = (field?.type ?? '').toLowerCase()
  return types.some((k) => t === k.toLowerCase() || t === `el-${k}`.toLowerCase())
}

export function isSwitchField(field: any) {
  return _typeIs(field, 'switch')
}

export function isInputField(field: any) {
  return _typeIs(field, 'input') || !field?.type
}

export function isTextareaField(field: any) {
  return _typeIs(field, 'textarea') || field?.props?.type === 'textarea'
}

export function isNumberField(field: any) {
  return _typeIs(field, 'number', 'input-number')
}

export function isSelectField(field: any) {
  return _typeIs(field, 'select')
}

export function isRadioField(field: any) {
  return _typeIs(field, 'radio')
}

/** 多选框（多选，值为数组） */
export function isCheckboxField(field: any) {
  return _typeIs(field, 'checkbox') || (field?.type === 'select' && field?.props?.multiple === true)
}

/**
 * 接口选择器 / 用户选择器（均基于接口加载选项，支持下拉框/单选框/多选框）
 * - ApiSelect：通用接口选择器，url 在 props
 * - UserSelect：用户选择器，默认 /system/user/simple-list
 */
export function isApiSelectField(field: any) {
  const t = (field?.type ?? '').toLowerCase()
  return (
    t === 'apiselect' ||
    t === 'api-select' ||
    t === 'userselect' ||
    t === 'user-select' ||
    (field?.props?.url && typeof field.props.url === 'string')
  )
}

/**
 * 接口/用户选择器的展示类型（下拉框 select、单选框 radio、多选框 checkbox）
 */
export function getApiSelectType(field: any): 'select' | 'radio' | 'checkbox' {
  const t = (field?.props?.selectType ?? field?.selectType ?? 'select').toLowerCase()
  if (t === 'radio' || t === 'checkbox') return t
  return 'select'
}

/** 单图上传（UploadImg，值为单张图片 URL） */
export function isUploadImgField(field: any) {
  const t = (field?.type ?? '').toLowerCase()
  return t === 'uploadimg' || t === 'upload-img' || t === 'el-uploadimg'
}