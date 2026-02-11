package cn.iocoder.yudao.module.digitalCard.controller.admin.station;


import cn.iocoder.yudao.framework.common.enums.CommonStatusEnum;
import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.digitalCard.model.dto.StationRoomDO;
import cn.iocoder.yudao.module.digitalCard.model.vo.stationRoom.StationRoomListReqVO;
import cn.iocoder.yudao.module.digitalCard.model.vo.stationRoom.StationRoomRespVO;
import cn.iocoder.yudao.module.digitalCard.model.vo.stationRoom.StationRoomSaveReqVO;
import cn.iocoder.yudao.module.digitalCard.model.vo.stationRoom.StationRoomSimpleRespVO;
import cn.iocoder.yudao.module.digitalCard.service.StationRoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;

import java.util.List;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

/**
 * 管理后台 - 站室控制器
 * 适配层级：1级首钢京唐公司xx事业部、2级归属区域、3级站室名称
 */
@Tag(name = "管理后台 - 站室")
@RestController
@RequestMapping("/digitalCard/station-room") // 接口路径遵循RESTful风格，与前端API对应
@Validated
public class StationRoomController {

    @Resource
    private StationRoomService stationRoomService; // 站室业务层（需自行实现）

    /**
     * 创建站室
     * @param createReqVO 站室创建请求参数
     * @return 站室ID
     */
    @PostMapping("create")
    @Operation(summary = "创建站室")
    @PreAuthorize("@ss.hasPermission('room:stationRoom:create')") // 站室创建权限
    public CommonResult<Long> createStationRoom(@Valid @RequestBody StationRoomSaveReqVO createReqVO) {
        Long stationRoomId = stationRoomService.createStationRoom(createReqVO);
        return success(stationRoomId);
    }

    /**
     * 更新站室
     * @param updateReqVO 站室更新请求参数
     * @return 更新结果
     */
    @PutMapping("update")
    @Operation(summary = "更新站室")
    @PreAuthorize("@ss.hasPermission('room:stationRoom:update')") // 站室更新权限
    public CommonResult<Boolean> updateStationRoom(@Valid @RequestBody StationRoomSaveReqVO updateReqVO) {
        stationRoomService.updateStationRoom(updateReqVO);
        return success(true);
    }

    /**
     * 删除站室
     * @param id 站室ID
     * @return 删除结果
     */
    @DeleteMapping("delete")
    @Operation(summary = "删除站室")
    @Parameter(name = "id", description = "站室编号", required = true, example = "1024")
    @PreAuthorize("@ss.hasPermission('room:stationRoom:delete')") // 站室删除权限
    public CommonResult<Boolean> deleteStationRoom(@RequestParam("id") Long id) {
        stationRoomService.deleteStationRoom(id);
        return success(true);
    }

    /**
     * 批量删除站室
     * @param ids 站室ID列表
     * @return 删除结果
     */
    @DeleteMapping("/delete-list")
    @Operation(summary = "批量删除站室")
    @Parameter(name = "ids", description = "站室编号列表", required = true)
    @PreAuthorize("@ss.hasPermission('room:stationRoom:delete')") // 复用删除权限
    public CommonResult<Boolean> deleteStationRoomList(@RequestParam("ids") List<Long> ids) {
        stationRoomService.deleteStationRoomList(ids);
        return success(true);
    }

    /**
     * 获取站室列表（树形/分页）
     * @param reqVO 站室查询参数
     * @return 站室列表
     */
    @GetMapping("/list")
    @Operation(summary = "获取站室列表")
    @PreAuthorize("@ss.hasPermission('room:stationRoom:query')") // 站室查询权限
    public CommonResult<List<StationRoomRespVO>> getStationRoomList(StationRoomListReqVO reqVO) {
        List<StationRoomDO> list = stationRoomService.getStationRoomList(reqVO);
        return success(BeanUtils.toBean(list, StationRoomRespVO.class)); // 转换为VO返回
    }

    /**
     * 获取站室精简信息列表（用于前端下拉选择）
     * 仅返回启用状态的站室，适配层级选择场景
     */
    @GetMapping(value = {"/list-all-simple", "/simple-list"})
    @Operation(summary = "获取站室精简信息列表", description = "只包含被开启的站室，主要用于前端的下拉选项（适配事业部/区域/站室层级选择）")
    public CommonResult<List<StationRoomSimpleRespVO>> getSimpleStationRoomList() {
        StationRoomListReqVO reqVO = new StationRoomListReqVO();
        reqVO.setStatus(CommonStatusEnum.ENABLE.getStatus()); // 仅查询启用状态
        List<StationRoomDO> list = stationRoomService.getStationRoomList(reqVO);
        return success(BeanUtils.toBean(list, StationRoomSimpleRespVO.class));
    }

    /**
     * 获取站室详情
     * @param id 站室ID
     * @return 站室详情
     */
    @GetMapping("/get")
    @Operation(summary = "获得站室信息")
    @Parameter(name = "id", description = "站室编号", required = true, example = "1024")
    @PreAuthorize("@ss.hasPermission('room:stationRoom:query')") // 复用查询权限
    public CommonResult<StationRoomRespVO> getStationRoom(@RequestParam("id") Long id) {
        StationRoomDO stationRoom = stationRoomService.getStationRoom(id);
        return success(BeanUtils.toBean(stationRoom, StationRoomRespVO.class));
    }

}
