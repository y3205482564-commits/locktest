package cn.iocoder.yudao.module.digitalCard.controller.admin.card;

import cn.iocoder.yudao.framework.apilog.core.annotation.ApiAccessLog;
import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.pojo.PageParam;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.framework.excel.core.util.ExcelUtils;
import cn.iocoder.yudao.module.digitalCard.domain.OperationTagRecord;
import cn.iocoder.yudao.module.digitalCard.model.dto.card.OperationTagRecordPageReqVO;
import cn.iocoder.yudao.module.digitalCard.model.dto.card.OperationTagRecordRespVO;
import cn.iocoder.yudao.module.digitalCard.model.dto.card.OperationTagRecordSaveReqVO;
import cn.iocoder.yudao.module.digitalCard.service.OperationTagRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

import static cn.iocoder.yudao.framework.apilog.core.enums.OperateTypeEnum.EXPORT;
import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

/**
 * 操作牌领用归还记录控制器
 *
 * @author 开发者
 */
@Tag(name = "管理后台 - 操作牌领用归还记录")
@RestController
@RequestMapping("/digitalCard/operation-tag-record")
@Validated
public class OperationTagRecordController {

    @Resource
    private OperationTagRecordService operationTagRecordService;

    /**
     * 创建操作牌领用归还记录
     */
    @PostMapping("/create")
    @Operation(summary = "创建操作牌领用归还记录")
    @PreAuthorize("@ss.hasPermission('digitalCard:operation-tag-record:create')")
    public CommonResult<Long> createOperationTagRecord(@Valid @RequestBody OperationTagRecordSaveReqVO createReqVO) {
        return success(operationTagRecordService.createOperationTagRecord(createReqVO));
    }

    /**
     * 修改操作牌领用归还记录
     */
    @PutMapping("/update")
    @Operation(summary = "修改操作牌领用归还记录")
    @PreAuthorize("@ss.hasPermission('digitalCard:operation-tag-record:update')")
    public CommonResult<Boolean> updateOperationTagRecord(@Valid @RequestBody OperationTagRecordSaveReqVO updateReqVO) {
        operationTagRecordService.updateOperationTagRecord(updateReqVO);
        return success(true);
    }

    /**
     * 删除操作牌领用归还记录
     */
    @DeleteMapping("/delete")
    @Operation(summary = "删除操作牌领用归还记录")
    @Parameter(name = "id", description = "操作牌领用归还记录编号", required = true, example = "1024")
    @PreAuthorize("@ss.hasPermission('digitalCard:operation-tag-record:delete')")
    public CommonResult<Boolean> deleteOperationTagRecord(@RequestParam("id") Long id) {
        operationTagRecordService.deleteOperationTagRecord(id);
        return success(true);
    }

    /**
     * 批量删除操作牌领用归还记录
     */
    @DeleteMapping("/delete-list")
    @Operation(summary = "批量删除操作牌领用归还记录")
    @Parameter(name = "ids", description = "编号列表", required = true)
    @PreAuthorize("@ss.hasPermission('digitalCard:operation-tag-record:delete')")
    public CommonResult<Boolean> deleteOperationTagRecordList(@RequestParam("ids") List<Long> ids) {
        operationTagRecordService.deleteOperationTagRecordList(ids);
        return success(true);
    }

    /**
     * 获得操作牌领用归还记录信息
     */
    @GetMapping("/get")
    @Operation(summary = "获得操作牌领用归还记录信息")
    @PreAuthorize("@ss.hasPermission('digitalCard:operation-tag-record:query')")
    public CommonResult<OperationTagRecordRespVO> getOperationTagRecord(@RequestParam("id") Long id) {
        OperationTagRecord record = operationTagRecordService.getOperationTagRecord(id);
        return success(BeanUtils.toBean(record, OperationTagRecordRespVO.class));
    }

    /**
     * 获得操作牌领用归还记录分页
     */
    @GetMapping("/page")
    @Operation(summary = "获得操作牌领用归还记录分页")
    @PreAuthorize("@ss.hasPermission('digitalCard:operation-tag-record:query')")
    public CommonResult<PageResult<OperationTagRecordRespVO>> getOperationTagRecordPage(OperationTagRecordPageReqVO pageReqVO) {
        PageResult<OperationTagRecord> pageResult = operationTagRecordService.getOperationTagRecordPage(pageReqVO);
        return success(BeanUtils.toBean(pageResult, OperationTagRecordRespVO.class));
    }

    /**
     * 获取操作牌领用归还记录精简信息列表
     * 主要用于前端的下拉选项
     */
    @GetMapping({"/list-all-simple", "/simple-list"})
    @Operation(summary = "获取操作牌领用归还记录精简信息列表", description = "主要用于前端的下拉选项")
    @PreAuthorize("@ss.hasPermission('digitalCard:operation-tag-record:query')")
    public CommonResult<List<OperationTagRecordRespVO>> getSimpleOperationTagRecordList() {
        List<OperationTagRecord> list = operationTagRecordService.getOperationTagRecordList();
        // 可根据业务需求添加排序规则，例如按领用时间倒序
        list.sort((o1, o2) -> o2.getUseTime().compareTo(o1.getUseTime()));
        return success(BeanUtils.toBean(list, OperationTagRecordRespVO.class));
    }

    /**
     * 导出操作牌领用归还记录 Excel
     */
    @GetMapping("/export-excel")
    @Operation(summary = "导出操作牌领用归还记录 Excel")
    @ApiAccessLog(operateType = EXPORT)
    @PreAuthorize("@ss.hasPermission('digitalCard:operation-tag-record:export')")
    public void export(HttpServletResponse response, @Validated OperationTagRecordPageReqVO exportReqVO) throws IOException {
        exportReqVO.setPageSize(PageParam.PAGE_SIZE_NONE); // 导出全部数据
        List<OperationTagRecord> list = operationTagRecordService.getOperationTagRecordPage(exportReqVO).getList();
        // 输出Excel文件
        ExcelUtils.write(response, "操作牌领用归还记录数据.xls", "数据", OperationTagRecordRespVO.class,
                BeanUtils.toBean(list, OperationTagRecordRespVO.class));
    }


    // 查询属于tagId的status为（1=已领用未归还）的领用记录
    @GetMapping("/get-by-tag-id")
    @Operation(summary = "根据tagId查询领用记录列表")
    @PreAuthorize("@ss.hasPermission('digitalCard:operation-tag-record:query')")
    public CommonResult<List<OperationTagRecordRespVO>> getOperationTagRecordByTagId(
            @Parameter(description = "操作牌ID", required = true)
            @RequestParam("tagId") Long tagId) {
        // 调用Service层获取列表
        List<OperationTagRecordRespVO> recordList = operationTagRecordService.getOperationTagRecordByTagId(tagId);
        // 返回列表格式的成功响应
        return success(recordList);
    }
}
