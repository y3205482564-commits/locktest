import { defHttp } from '@/utils/http/axios'

/**
 * 站室VO（视图对象），对应站室表的字段结构
 */
export interface StationRoomVO {
  id?: number
  name: string // 站室名称（1级：首钢京唐公司xx事业部、2级：归属区域、3级：站室名称）
  parentId: number // 上级站室id（1级站室父ID为0）
  status: number // 站室状态（0正常 1停用）
  sort: number // 显示顺序
  leaderUserId: number // 站室负责人ID
  phone: string // 联系电话
  email: string // 邮箱
  createTime: Date // 创建时间
  // 如需完整字段可补充：creator、updater、updateTime、deleted、tenantId
}

/**
 * 站室分页查询请求参数
 */
export interface StationRoomPageReqVO {
  name?: string // 站室名称（模糊查询）
  status?: number // 站室状态
}

// 查询站室（精简)列表（用于下拉选择等场景）
export function listSimpleStationRoom() {
  return defHttp.get({ url: '/digitalCard/station-room/list-all-simple' })
}

// 查询站室列表（分页/树形）
export function getStationRoomPage(params: StationRoomPageReqVO) {
  return defHttp.get({ url: '/digitalCard/station-room/list', params })
}

// 查询站室详情
export function getStationRoom(id: number) {
  return defHttp.get({ url: `/digitalCard/station-room/get?id=${id}` })
}

// 新增站室
export function createStationRoom(data: StationRoomVO) {
  return defHttp.post({ url: '/digitalCard/station-room/create', data })
}

// 修改站室
export function updateStationRoom(params: StationRoomVO) {
  return defHttp.put({ url: '/digitalCard/station-room/update', data: params })
}

// 删除站室
export function deleteStationRoom(id: number) {
  return defHttp.delete({ url: `/digitalCard/station-room/delete?id=${id}` })
}

/** 查询站室（精简)列表（备用接口，与listSimpleStationRoom功能一致） */
export async function getSimpleStationRoomList() {
  return defHttp.get({ url: '/digitalCard/station-room/simple-list' })
}
