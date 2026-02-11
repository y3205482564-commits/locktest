package cn.iocoder.yudao.module.digitalCard.service.impl;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.iocoder.yudao.framework.common.enums.CommonStatusEnum;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.digitalCard.mapper.StationRoomMapper;
import cn.iocoder.yudao.module.digitalCard.model.dto.StationRoomDO;
import cn.iocoder.yudao.module.digitalCard.model.vo.stationRoom.StationRoomListReqVO;
import cn.iocoder.yudao.module.digitalCard.model.vo.stationRoom.StationRoomSaveReqVO;
import cn.iocoder.yudao.module.digitalCard.service.StationRoomService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import javax.annotation.Resource;
import java.util.*;
import java.util.stream.Collectors;

import static cn.iocoder.yudao.framework.common.exception.util.ServiceExceptionUtil.exception;
import static cn.iocoder.yudao.module.system.enums.ErrorCodeConstants.DEPT_NAME_DUPLICATE;

/**
* @author 鹏
* @description 针对表【station_room(首钢京唐公司站室表（多级层级：事业部→归属区域→站室）)】的数据库操作Service实现
* @createDate 2026-01-22 19:17:36
*/
@Service
@Validated
@Slf4j
public class StationRoomServiceImpl implements StationRoomService {

    @Resource
    private StationRoomMapper stationRoomMapper;

    // 站室缓存Key常量（需在RedisKeyConstants中新增）
    private static final String STATION_ROOM_CHILDREN_ID_LIST = "station_room:children:id:list";
    // 站室相关异常枚举（需在业务异常枚举中新增，与部门异常逻辑一致）
    private static final String STATION_ROOM_NOT_FOUND = "stationRoom.notFound"; // 站室不存在
    private static final String STATION_ROOM_EXITS_CHILDREN = "stationRoom.exitsChildren"; // 站室存在子站室
    private static final String STATION_ROOM_PARENT_ERROR = "stationRoom.parent.error"; // 父站室设置错误（自己为父）
    private static final String STATION_ROOM_PARENT_NOT_EXITS = "stationRoom.parent.notExists"; // 父站室不存在
    private static final String STATION_ROOM_PARENT_IS_CHILD = "stationRoom.parent.isChild"; // 父站室是子站室（环路）
    private static final String STATION_ROOM_NAME_DUPLICATE = "stationRoom.name.duplicate"; // 站室名称重复
    private static final String STATION_ROOM_NOT_ENABLE = "stationRoom.notEnable"; // 站室未启用

    @Override
    @CacheEvict(cacheNames = STATION_ROOM_CHILDREN_ID_LIST, allEntries = true)
    public Long createStationRoom(StationRoomSaveReqVO createReqVO) {
        // 父站室ID默认值（1级站室父ID为0）
        if (createReqVO.getParentId() == null) {
            createReqVO.setParentId(StationRoomDO.PARENT_ID_ROOT); // 需在StationRoomDO中定义 PARENT_ID_ROOT = 0L
        }
        // 校验父站室有效性
        validateParentStationRoom(null, createReqVO.getParentId());
        // 校验站室名称唯一性（同层级下名称不能重复）
        validateStationRoomNameUnique(null, createReqVO.getParentId(), createReqVO.getName());

        // 转换为DO并插入数据库
        StationRoomDO stationRoom = BeanUtils.toBean(createReqVO, StationRoomDO.class);
        stationRoomMapper.insert(stationRoom);
        return stationRoom.getId();
    }

    @Override
    @CacheEvict(cacheNames = STATION_ROOM_CHILDREN_ID_LIST, allEntries = true)
    public void updateStationRoom(StationRoomSaveReqVO updateReqVO) {
        // 父站室ID默认值
        if (updateReqVO.getParentId() == null) {
            updateReqVO.setParentId(StationRoomDO.PARENT_ID_ROOT);
        }
        // 校验当前站室存在
        validateStationRoomExists(updateReqVO.getId());
        // 校验父站室有效性
        validateParentStationRoom(updateReqVO.getId(), updateReqVO.getParentId());
        // 校验站室名称唯一性
        validateStationRoomNameUnique(updateReqVO.getId(), updateReqVO.getParentId(), updateReqVO.getName());

        // 更新站室信息
        StationRoomDO updateObj = BeanUtils.toBean(updateReqVO, StationRoomDO.class);
        stationRoomMapper.updateById(updateObj);
    }

    @Override
    @CacheEvict(cacheNames = STATION_ROOM_CHILDREN_ID_LIST, allEntries = true)
    public void deleteStationRoom(Long id) {
        // 校验站室存在
        validateStationRoomExists(id);
        // 校验是否有子站室（如事业部下有区域、区域下有站室则不允许删除）
        if (stationRoomMapper.selectCountByParentId(id) > 0) {
            throw exception(DEPT_NAME_DUPLICATE); // 替换为项目实际的异常抛出方式
        }
        // 删除站室
        stationRoomMapper.deleteById(id);
    }

    @Override
    @CacheEvict(cacheNames = STATION_ROOM_CHILDREN_ID_LIST, allEntries = true)
    public void deleteStationRoomList(List<Long> ids) {
        // 批量校验是否有子站室
        for (Long id : ids) {
            if (stationRoomMapper.selectCountByParentId(id) > 0) {
                throw exception(DEPT_NAME_DUPLICATE);
            }
        }
        // 批量删除站室
        stationRoomMapper.deleteByIds(ids);
    }

    /**
     * 校验站室是否存在
     */
    void validateStationRoomExists(Long id) {
        if (id == null) {
            return;
        }
        StationRoomDO stationRoom = stationRoomMapper.selectById(id);
        if (stationRoom == null) {
            throw exception(DEPT_NAME_DUPLICATE);
        }
    }

    /**
     * 校验父站室有效性
     * 1. 不能设置自己为父站室
     * 2. 父站室必须存在
     * 3. 避免层级环路（如站室A→站室B→站室A）
     */
    void validateParentStationRoom(Long id, Long parentId) {
        // 根节点（1级站室）无需校验父站室
        if (parentId == null || StationRoomDO.PARENT_ID_ROOT.equals(parentId)) {
            return;
        }
        // 1. 不能设置自己为父站室
        if (Objects.equals(id, parentId)) {
            throw exception(DEPT_NAME_DUPLICATE);
        }
        // 2. 父站室不存在
        StationRoomDO parentStationRoom = stationRoomMapper.selectById(parentId);
        if (parentStationRoom == null) {
            throw exception(DEPT_NAME_DUPLICATE);
        }
        // 3. 新增场景无需校验环路，编辑场景校验避免层级环路
        if (id == null) {
            return;
        }
        // 递归校验父站室是否为当前站室的子站室（避免环路）
        for (int i = 0; i < Short.MAX_VALUE; i++) {
            parentId = parentStationRoom.getParentId();
            // 检测到环路
            if (Objects.equals(id, parentId)) {
                throw exception(DEPT_NAME_DUPLICATE);
            }
            // 到达根节点，结束校验
            if (parentId == null || StationRoomDO.PARENT_ID_ROOT.equals(parentId)) {
                break;
            }
            parentStationRoom = stationRoomMapper.selectById(parentId);
            if (parentStationRoom == null) {
                break;
            }
        }
    }

    /**
     * 校验同层级下站室名称唯一性
     */
    void validateStationRoomNameUnique(Long id, Long parentId, String name) {
        StationRoomDO stationRoom = stationRoomMapper.selectByParentIdAndName(parentId, name);
        if (stationRoom == null) {
            return;
        }
        // 新增场景：名称重复直接报错
        if (id == null) {
            throw exception(DEPT_NAME_DUPLICATE);
        }
        // 编辑场景：非当前站室的同名站室报错
        if (!ObjectUtil.equal(stationRoom.getId(), id)) {
            throw exception(DEPT_NAME_DUPLICATE);
        }
    }

    @Override
    public StationRoomDO getStationRoom(Long id) {
        return stationRoomMapper.selectById(id);
    }

    @Override
    public List<StationRoomDO> getStationRoomList(Collection<Long> ids) {
        if (CollUtil.isEmpty(ids)) {
            return Collections.emptyList();
        }
        return stationRoomMapper.selectByIds(ids);
    }

    @Override
    public List<StationRoomDO> getStationRoomList(StationRoomListReqVO reqVO) {
        List<StationRoomDO> list = stationRoomMapper.selectList(reqVO);
        // 按排序字段升序排列（同层级内排序）
        list.sort(Comparator.comparing(StationRoomDO::getSort));
        return list;
    }

    @Override
    public List<StationRoomDO> getChildStationRoomList(Collection<Long> ids) {
        List<StationRoomDO> children = new LinkedList<>();
        Collection<Long> parentIds = ids;
        // 递归查询所有子站室（适配多级层级：事业部→区域→站室）
        for (int i = 0; i < Short.MAX_VALUE; i++) {
            List<StationRoomDO> stationRooms = stationRoomMapper.selectListByParentId(parentIds);
            if (CollUtil.isEmpty(stationRooms)) {
                break;
            }
            children.addAll(stationRooms);
            // 下一级父ID为当前子站室的ID
            parentIds = stationRooms.stream().map(StationRoomDO::getId).collect(Collectors.toSet());
        }
        return children;
    }

    @Override
    public List<StationRoomDO> getStationRoomListByLeaderUserId(Long id) {
        return stationRoomMapper.selectListByLeaderUserId(id);
    }

    @Override
    @Cacheable(cacheNames = STATION_ROOM_CHILDREN_ID_LIST, key = "#id")
    public Set<Long> getChildStationRoomIdListFromCache(Long id) {
        List<StationRoomDO> children = getChildStationRoomList(id);
        return children.stream().map(StationRoomDO::getId).collect(Collectors.toSet());
    }

    @Override
    public void validateStationRoomList(Collection<Long> ids) {
        if (CollUtil.isEmpty(ids)) {
            return;
        }
        // 获取站室信息Map
        Map<Long, StationRoomDO> stationRoomMap = getStationRoomMap(ids);
        // 校验站室存在且启用
        ids.forEach(id -> {
            StationRoomDO stationRoom = stationRoomMap.get(id);
            if (stationRoom == null) {
                throw exception(DEPT_NAME_DUPLICATE);
            }
            if (!CommonStatusEnum.ENABLE.getStatus().equals(stationRoom.getStatus())) {
                throw exception(DEPT_NAME_DUPLICATE);
            }
        });
    }

}




