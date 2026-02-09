package cn.iocoder.cloud.lockdemo.service;

import cn.iocoder.cloud.lockdemo.dto.BluetoothBaseInfoDTO;
import cn.iocoder.cloud.lockdemo.dto.ElectQuantityDTO;
import cn.iocoder.cloud.lockdemo.dto.UseRecordDTO;

/**
 * 蓝牙设备服务接口
 */
public interface BluetoothBaseService {
    
    /**
     * 获取设备信息
     * @param id 设备ID
     * @return 设备信息
     */
    BluetoothBaseInfoDTO getBluetoothBaseInfo(String id);
    
    /**
     * 添加使用记录
     * @param dto 使用记录DTO
     */
    void addUseRecords(UseRecordDTO dto);
    
    /**
     * 更新电量
     * @param dto 电量更新DTO
     */
    void updateElectQuantity(ElectQuantityDTO dto);
}

