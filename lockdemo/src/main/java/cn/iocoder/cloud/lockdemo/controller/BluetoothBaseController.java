package cn.iocoder.cloud.lockdemo.controller;

import cn.iocoder.cloud.lockdemo.dto.BluetoothBaseInfoDTO;
import cn.iocoder.cloud.lockdemo.dto.ElectQuantityDTO;
import cn.iocoder.cloud.lockdemo.dto.Result;
import cn.iocoder.cloud.lockdemo.dto.UseRecordDTO;
import cn.iocoder.cloud.lockdemo.service.BluetoothBaseService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 蓝牙设备控制器
 */
@Api(tags = "智能锁管理")
@RestController
@RequestMapping("/lock/bluetoothBase")
public class BluetoothBaseController {
    
    @Autowired
    private BluetoothBaseService bluetoothBaseService;
    
    /**
     * 获取设备信息
     */
    @ApiOperation("获取设备信息")
    @PostMapping("/getBluetoothBaseInfo")
    public Result<BluetoothBaseInfoDTO> getBluetoothBaseInfo(@RequestParam(required = false) String id,
                                                               @RequestBody(required = false) Map<String, String> params) {
        // 支持 query 参数和 POST body
        if (id == null || id.trim().isEmpty()) {
            if (params != null && params.get("id") != null) {
                id = params.get("id");
            }
        }
        
        if (id == null || id.trim().isEmpty()) {
            return Result.error("设备ID不能为空");
        }
        
        BluetoothBaseInfoDTO info = bluetoothBaseService.getBluetoothBaseInfo(id);
        if (info == null) {
            return Result.error("设备不存在");
        }
        
        return Result.success(info);
    }
    
    /**
     * 添加使用记录
     */
    @ApiOperation("添加使用记录")
    @PostMapping("/addUseRecords")
    public Result<Void> addUseRecords(@RequestBody UseRecordDTO dto) {
        if (dto.getBluetoothId() == null || dto.getBluetoothId().trim().isEmpty()) {
            return Result.error("设备ID不能为空");
        }
        if (dto.getUserId() == null || dto.getUserId().trim().isEmpty()) {
            return Result.error("用户ID不能为空");
        }
        if (dto.getLockStatus() == null) {
            return Result.error("锁状态不能为空");
        }
        
        bluetoothBaseService.addUseRecords(dto);
        return Result.success();
    }
    
    /**
     * 更新电量
     */
    @ApiOperation("更新电量")
    @PostMapping("/updateElectQuantity")
    public Result<Void> updateElectQuantity(@RequestBody ElectQuantityDTO dto) {
        // 支持 id 和 bluetoothId 两种字段名
        String deviceId = dto.getId() != null ? dto.getId() : dto.getBluetoothId();
        if (deviceId == null || deviceId.trim().isEmpty()) {
            return Result.error("设备ID不能为空");
        }
        if (dto.getElectQuantity() == null) {
            return Result.error("电量不能为空");
        }
        
        bluetoothBaseService.updateElectQuantity(dto);
        return Result.success();
    }
}

