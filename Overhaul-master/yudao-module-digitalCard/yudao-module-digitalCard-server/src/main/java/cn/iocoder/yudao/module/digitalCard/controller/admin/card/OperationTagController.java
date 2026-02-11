package cn.iocoder.yudao.module.digitalCard.controller.admin.card;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.module.digitalCard.model.vo.card.OperationTagVO;
import cn.iocoder.yudao.module.digitalCard.model.vo.card.SimpleOperationTagVO;
import cn.iocoder.yudao.module.digitalCard.service.OperationTagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 操作标签控制器
 *
 * @author 编程助手
 * @version 1.0
 * @description: 操作标签（OperationTag）相关接口，提供查询等功能
 * @date 2026/1/21 15:00
 */
@RestController
@RequestMapping("/digitalCard/operation-tag")
public class OperationTagController {

    @Autowired
    private OperationTagService operationTagService;


    /**
     * 获取操作标签全部信息列表
     *
     * @return 操作标签全部信息列表（包含未删除的操作标签）
     */
    @GetMapping("/list-all")
    @Operation(summary = "获取操作标签全部信息列表", description = "只返回未删除的操作标签，无数据则返回空列表")
    public CommonResult<List<OperationTagVO>> getOperationTagList() {
        List<OperationTagVO> list = operationTagService.getOperationTagList();
        return CommonResult.success(list);
    }

    /**
     * 获取操作标签精简信息列表
     *
     * @return 操作标签精简信息列表（仅包含下拉选项所需核心字段）
     */
    @GetMapping({"/list-all-simple", "/simple-list"})
    @Operation(summary = "获取操作标签精简信息列表", description = "只包含未删除的操作标签，主要用于前端的下拉选项")
    public CommonResult<List<SimpleOperationTagVO>> getSimpleOperationTagList() {
        List<SimpleOperationTagVO> list = operationTagService.getSimpleOperationTagList();
        return CommonResult.success(list);
    }


    /**
     * 通过ID查询操作标签完整信息
     *
     * @param id 操作标签主键ID
     * @return 操作标签完整信息，无数据则返回空
     */
    @GetMapping("/{id}")
    @Operation(summary = "通过ID查询操作标签完整信息", description = "只返回未删除的操作标签，无数据则返回空")
    public CommonResult<OperationTagVO> getOperationTagById(
            @Parameter(description = "操作标签主键ID", required = true)
            @PathVariable Long id // 路径参数，必传
    ) {
        OperationTagVO vo = operationTagService.getOperationTagById(id);
        return CommonResult.success(vo);
    }

    /**
     * 通过租户ID查询操作标签列表
     *
     * @param tenantId 租户ID
     * @return 指定租户下的操作标签列表，无数据则返回空列表
     */
    @GetMapping("/list-by-tenant/{tenantId}")
    @Operation(summary = "通过租户ID查询操作标签列表", description = "只返回指定租户下未删除的操作标签，无数据则返回空列表")
    public CommonResult<List<OperationTagVO>> getOperationTagListByTenantId(
            @Parameter(description = "租户ID", required = true)
            @PathVariable Long tenantId // 路径参数，必传
    ) {
        List<OperationTagVO> list = operationTagService.getOperationTagListByTenantId(tenantId);
        return CommonResult.success(list);
    }

    /**
     * 通过标签类型查询操作标签列表
     *
     * @param tagType 标签类型（如：绿色操作牌/红色操作牌）
     * @return 指定类型的操作标签列表，无数据则返回空列表
     */
    @GetMapping("/list-by-tag-type/{tagType}")
    @Operation(summary = "通过标签类型查询操作标签列表", description = "只返回未删除的指定类型操作标签，无数据则返回空列表")
    public CommonResult<List<OperationTagVO>> getOperationTagListByTagType(
            @Parameter(description = "标签类型（如：绿色操作牌/红色操作牌）", required = true)
            @PathVariable String tagType // 路径参数，必传
    ) {
        List<OperationTagVO> list = operationTagService.getOperationTagListByTagType(tagType);
        return CommonResult.success(list);
    }


    /**
     * 通过站室ID查询操作牌列表
     */
    @GetMapping("/list-by-station-room/{stationRoomId}")
    @Operation(summary = "通过stationRoomId查询操作牌列表", description = "只返回未删除的指定stationRoomId操作牌，无数据则返回空列表")
    public CommonResult<List<OperationTagVO>> getOperationTagListByStationRoomId(
            @Parameter(description = "stationRoomId", required = true)
            @PathVariable Long stationRoomId // 路径参数，必传
    ) {
        List<OperationTagVO> list = operationTagService.getOperationTagListByStationRoomId(stationRoomId);
        return CommonResult.success(list);
    }
}
