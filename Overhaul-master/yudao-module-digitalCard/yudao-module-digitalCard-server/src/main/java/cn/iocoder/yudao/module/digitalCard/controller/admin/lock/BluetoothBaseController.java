package cn.iocoder.yudao.module.digitalCard.controller.admin.lock;

import cn.iocoder.yudao.framework.common.exception.enums.GlobalErrorCodeConstants;
import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.module.digitalCard.model.vo.BluetoothBaseInfoVO;
import cn.iocoder.yudao.module.digitalCard.model.vo.ElectQuantityReqVO;
import cn.iocoder.yudao.module.digitalCard.model.vo.UseRecordReqVO;
import cn.iocoder.yudao.module.digitalCard.service.BluetoothBaseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * 蓝牙设备控制器
 */
@Tag(name = "管理后台 - 智能锁管理")
@RestController
@RequestMapping("/digitalCard/bluetooth-base")
@Validated
public class BluetoothBaseController {

    @Autowired
    private BluetoothBaseService bluetoothBaseService;

    /**
     * 获取设备信息
     */
    @Operation(summary = "获取设备信息")
    @GetMapping("/getBluetoothBaseInfo")
    public CommonResult<BluetoothBaseInfoVO> getBluetoothBaseInfo(
            @Parameter(description = "设备ID", required = true)
            @RequestParam(required = false) String id) {
        if (id == null || id.trim().isEmpty()) {
            return CommonResult.error(GlobalErrorCodeConstants.BAD_REQUEST.getCode(), "设备ID不能为空");
        }

        BluetoothBaseInfoVO info = bluetoothBaseService.getBluetoothBaseInfo(id);
        if (info == null) {
            return CommonResult.error(GlobalErrorCodeConstants.NOT_FOUND.getCode(), "设备不存在");
        }

        return CommonResult.success(info);
    }

    /**
     * 添加使用记录
     */
    @Operation(summary = "添加使用记录")
    @PostMapping("/addUseRecords")
    public CommonResult<Void> addUseRecords(@Valid @RequestBody UseRecordReqVO reqVO) {
        if (reqVO.getBluetoothId() == null || reqVO.getBluetoothId().trim().isEmpty()) {
            return CommonResult.error(GlobalErrorCodeConstants.BAD_REQUEST.getCode(), "设备ID不能为空");
        }
        if (reqVO.getLockStatus() == null) {
            return CommonResult.error(GlobalErrorCodeConstants.BAD_REQUEST.getCode(), "锁状态不能为空");
        }

        bluetoothBaseService.addUseRecords(reqVO);
        return CommonResult.success(null);
    }

    /**
     * 更新电量
     */
    @Operation(summary = "更新电量")
    @PostMapping("/updateElectQuantity")
    public CommonResult<Void> updateElectQuantity(@Valid @RequestBody ElectQuantityReqVO reqVO) {
        if (reqVO.getBluetoothId() == null || reqVO.getBluetoothId().trim().isEmpty()) {
            return CommonResult.error(GlobalErrorCodeConstants.BAD_REQUEST.getCode(), "设备ID不能为空");
        }
        if (reqVO.getElectQuantity() == null) {
            return CommonResult.error(GlobalErrorCodeConstants.BAD_REQUEST.getCode(), "电量不能为空");
        }

        bluetoothBaseService.updateElectQuantity(reqVO);
        return CommonResult.success(null);
    }
}

