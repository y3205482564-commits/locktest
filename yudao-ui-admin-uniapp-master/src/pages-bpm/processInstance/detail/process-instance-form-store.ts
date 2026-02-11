/**
 * 审批时待提交的表单变量（仅可编辑字段）
 * 从流程详情页点击「通过」时写入，审批页提交时读取并随 approve 请求发送
 */
let pendingFormVariables: Record<string, any> = {}

export function setPendingFormVariables(vars: Record<string, any>) {
  pendingFormVariables = vars || {}
}

export function getPendingFormVariables(): Record<string, any> {
  return pendingFormVariables
}

export function clearPendingFormVariables() {
  pendingFormVariables = {}
}

/** 节点/办理表单（与 PC 端「填写表单【formName】」一致，审批通过时需填写） */
export interface PendingTaskForm {
  formName?: string
  formConf?: string
  formFields?: string[]
  formVariables?: Record<string, any>
}

let pendingTaskForm: PendingTaskForm | null = null

export function setPendingTaskForm(task: PendingTaskForm | null) {
  pendingTaskForm = task ? {
    formName: task.formName,
    formConf: task.formConf,
    formFields: task.formFields,
    formVariables: task.formVariables ?? {},
  } : null
}

export function getPendingTaskForm(): PendingTaskForm | null {
  return pendingTaskForm
}

export function clearPendingTaskForm() {
  pendingTaskForm = null
}
