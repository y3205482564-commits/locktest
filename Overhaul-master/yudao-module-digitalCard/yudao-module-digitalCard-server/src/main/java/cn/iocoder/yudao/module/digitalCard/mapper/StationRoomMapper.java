package cn.iocoder.yudao.module.digitalCard.mapper;

import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.digitalCard.model.dto.StationRoomDO;
import cn.iocoder.yudao.module.digitalCard.model.vo.stationRoom.StationRoomListReqVO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.Collection;
import java.util.List;

/**
* @author 鹏
* @description 针对表【station_room(首钢京唐公司站室表（多级层级：事业部→归属区域→站室）)】的数据库操作Mapper
* @createDate 2026-01-22 19:17:36
* @Entity generator.domain.StationRoom
*/
@Mapper
public interface StationRoomMapper extends BaseMapperX<StationRoomDO> {

    /**
     * 条件查询站室列表
     * 支持站室名称模糊查询、状态精准查询
     */
    default List<StationRoomDO> selectList(StationRoomListReqVO reqVO) {
        return selectList(new LambdaQueryWrapperX<StationRoomDO>()
                .likeIfPresent(StationRoomDO::getName, reqVO.getName()) // 站室名称模糊查询
                .eqIfPresent(StationRoomDO::getStatus, reqVO.getStatus())); // 站室状态精准查询
    }

    /**
     * 根据父站室ID和名称查询站室（校验同层级名称唯一性）
     * 用于创建/编辑时校验同层级下站室名称是否重复
     */
    default StationRoomDO selectByParentIdAndName(Long parentId, String name) {
        return selectOne(StationRoomDO::getParentId, parentId, StationRoomDO::getName, name);
    }

    /**
     * 根据父站室ID统计子站室数量
     * 用于删除时校验是否有子站室（如事业部下有区域则不允许删除）
     */
    default Long selectCountByParentId(Long parentId) {
        return selectCount(StationRoomDO::getParentId, parentId);
    }

    /**
     * 根据父站室ID列表查询子站室列表
     * 用于递归查询多级子站室（如事业部→区域→站室）
     */
    default List<StationRoomDO> selectListByParentId(Collection<Long> parentIds) {
        return selectList(StationRoomDO::getParentId, parentIds);
    }

    /**
     * 根据负责人用户ID查询站室列表
     * 用于关联查询某负责人管理的所有站室
     */
    default List<StationRoomDO> selectListByLeaderUserId(Long leaderUserId) {
        return selectList(StationRoomDO::getLeaderUserId, leaderUserId);
    }

}




