import { http } from '@/http/http'

const baseUrl = '/digitalCard/bluetooth-base'

/** 蓝牙设备信息 */
export interface BluetoothBaseInfo {
  id: string
  lockNum: string
  mac: string
  blueType: string
  password: string
  secretKey: string
  useCount: number
  lastUser: string
  lastUseTime: string
  isInstructClosed: string
  answerQuestion: string
  electQuantity: number
}

/** 使用记录请求 */
export interface UseRecordReq {
  bluetoothId: string
  userId: string
  lockStatus: number // 1=开锁，0=关锁
}

/** 电量更新请求 */
export interface ElectQuantityReq {
  bluetoothId: string
  electQuantity: number
}

/** 获取设备信息 */
export function getBluetoothBaseInfo(id: string) {
  return http.get<BluetoothBaseInfo>(`${baseUrl}/getBluetoothBaseInfo`, { id }, undefined)
}

/** 添加使用记录 */
export function addUseRecords(data: UseRecordReq) {
  return http.post<void>(`${baseUrl}/addUseRecords`, data)
}

/** 更新电量 */
export function updateElectQuantity(data: ElectQuantityReq) {
  return http.post<void>(`${baseUrl}/updateElectQuantity`, data)
}

