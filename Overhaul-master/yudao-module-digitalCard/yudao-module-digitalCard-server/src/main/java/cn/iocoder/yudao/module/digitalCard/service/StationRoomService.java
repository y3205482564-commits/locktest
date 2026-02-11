package cn.iocoder.yudao.module.digitalCard.service;

import cn.iocoder.yudao.framework.common.util.collection.CollectionUtils;
import cn.iocoder.yudao.module.digitalCard.domain.StationRoom;
import cn.iocoder.yudao.module.digitalCard.model.dto.StationRoomDO;
import cn.iocoder.yudao.module.digitalCard.model.vo.stationRoom.StationRoomListReqVO;
import cn.iocoder.yudao.module.digitalCard.model.vo.stationRoom.StationRoomSaveReqVO;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.*;

/**
* @author 鹏
* @description 针对表【station_room(首钢京唐公司站室表（多级层级：事业部→归属区域→站室）)】的数据库操作Service
* @createDate 2026-01-22 19:17:36
*/
/**
 * 站室 Service 接口
 * 适配层级：1级首钢京唐公司xx事业部、2级归属区域、3级站室名称
 *
 * @author 自定义作者名
 */
public interface StationRoomService {

    /**
     * 创建站室
     *
     * @param createReqVO 站室信息
     * @return 站室编号
     */
    Long createStationRoom(StationRoomSaveReqVO createReqVO);

    /**
     * 更新站室
     *
     * @param updateReqVO 站室信息
     */
    void updateStationRoom(StationRoomSaveReqVO updateReqVO);

    /**
     * 删除站室
     *
     * @param id 站室编号
     */
    void deleteStationRoom(Long id);

    /**
     * 批量删除站室
     *
     * @param ids 站室编号数组
     */
    void deleteStationRoomList(List<Long> ids);

    /**
     * 获得站室信息
     *
     * @param id 站室编号
     * @return 站室信息
     */
    StationRoomDO getStationRoom(Long id);

    /**
     * 获得站室信息数组
     *
     * @param ids 站室编号数组
     * @return 站室信息数组
     */
    List<StationRoomDO> getStationRoomList(Collection<Long> ids);

    /**
     * 筛选站室列表
     *
     * @param reqVO 筛选条件请求 VO
     * @return 站室列表
     */
    List<StationRoomDO> getStationRoomList(StationRoomListReqVO reqVO);

    /**
     * 获得指定编号的站室 Map
     *
     * @param ids 站室编号数组
     * @return 站室 Map
     */
    default Map<Long, StationRoomDO> getStationRoomMap(Collection<Long> ids) {
        List<StationRoomDO> list = getStationRoomList(ids);
        return CollectionUtils.convertMap(list, StationRoomDO::getId);
    }

    /**
     * 获得指定站室的所有子站室
     * 适配层级：如获取某事业部下的所有区域/站室、某区域下的所有站室
     *
     * @param id 站室编号
     * @return 子站室列表
     */
    default List<StationRoomDO> getChildStationRoomList(Long id) {
        return getChildStationRoomList(Collections.singleton(id));
    }

    /**
     * 获得指定站室的所有子站室
     * 适配层级：批量获取多个父站室下的所有子站室
     *
     * @param ids 站室编号数组
     * @return 子站室列表
     */
    List<StationRoomDO> getChildStationRoomList(Collection<Long> ids);

    /**
     * 获得指定领导者的站室列表
     *
     * @param id 领导者编号
     * @return 站室列表
     */
    List<StationRoomDO> getStationRoomListByLeaderUserId(Long id);

    /**
     * 获得所有子站室ID，从缓存中
     * 适配层级：快速获取某父站室下的所有子站室ID（如事业部→区域→站室）
     *
     * @param id 父站室编号
     * @return 子站室ID列表
     */
    Set<Long> getChildStationRoomIdListFromCache(Long id);

    /**
     * 校验站室们是否有效。如下情况，视为无效：
     * 1. 站室编号不存在
     * 2. 站室被禁用
     *
     * @param ids 站室编号数组
     */
    void validateStationRoomList(Collection<Long> ids);

}
