package cn.iocoder.yudao.module.digitalCard.controller.admin;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.module.digitalCard.model.vo.RepairEntrustOrderVO;
import cn.iocoder.yudao.module.digitalCard.model.vo.SimpleTqrjh03VO;
import cn.iocoder.yudao.module.digitalCard.model.vo.Tqrjh03VO;
import cn.iocoder.yudao.module.digitalCard.service.Tqrjh03Service;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author 鹏
 * @version 1.0
 * @description: TODO
 * @date 2026/1/12 15:57
 */
@RestController
@RequestMapping("/digitalCard/work-order")
public class WorkOrderController {

    @Autowired
    private Tqrjh03Service tqrjh03Service;


//    @GetMapping({"/list-all-simple", "/simple-list"})
//    @Operation(summary = "获取工单精简信息列表", description = "只包含被开启的工单，主要用于前端的下拉选项")
//    public CommonResult<List<Tqrjh03>> getWorkOrderList() {
//        List<Tqrjh03> list = tqrjh03Service.list();
//        return success(list);
//    }


    /**
     * 获取工单精简信息列表
     * @return
     */
    @GetMapping({"/list-all-simple", "/simple-list"})
    @Operation(summary = "获取工单精简信息列表", description = "只包含被开启的工单，主要用于前端的下拉选项")
    public CommonResult<List<SimpleTqrjh03VO>> getSimpleWorkOrderList() {
        List<SimpleTqrjh03VO> list = tqrjh03Service.getSimpleWorkOrderList();
        return CommonResult.success(list);
    }


    @GetMapping("/simple/{internalCode}")
    @Operation(summary = "通过内码查询工单精简信息", description = "只返回开启状态的工单，无数据则返回空")
    public CommonResult<Tqrjh03VO> getSimpleWorkOrderByInternalCode(
            @Parameter(description = "工单内码", required = true)
            @PathVariable String internalCode // 路径参数，必传
    ) {
        Tqrjh03VO vo = tqrjh03Service.getSimpleWorkOrderByInternalCode(internalCode);
        return CommonResult.success(vo);
    }



    // 通过内码查询工单，返回RepairEntrustOrderVO

    /**
     * 通过内码查询工单精简信息
     *
     * @param internalCode 工单内码（主键）
     * @return 工单核心信息（RepairEntrustOrderVO），无数据则返回空
     */
    @GetMapping("/getRepairEntrustOrderByInternalCode/{internalCode}")
    @Operation(summary = "通过内码查询工单精简信息", description = "只返回开启状态的工单，无数据则返回空")
    public CommonResult<RepairEntrustOrderVO> getRepairEntrustOrderByInternalCode(
            @Parameter(description = "工单内码", required = true)
            @PathVariable String internalCode // 路径参数，必传
    ) {
        // 调用服务层方法，获取RepairEntrustOrderVO类型的结果
        RepairEntrustOrderVO vo = tqrjh03Service.getRepairEntrustOrderByInternalCode(internalCode);
        // 返回成功结果（无数据时vo为null，CommonResult.success会处理空值）
        return CommonResult.success(vo);
    }








}
