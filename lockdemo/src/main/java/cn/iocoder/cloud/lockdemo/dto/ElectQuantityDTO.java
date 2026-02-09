package cn.iocoder.cloud.lockdemo.dto;

import lombok.Data;

/**
 * 电量更新DTO
 */
@Data
public class ElectQuantityDTO {
    
    /**
     * 设备ID
     */
    private String id;
    
    /**
     * 设备ID（前端可能使用 bluetoothId）
     */
    private String bluetoothId;
    
    /**
     * 电量
     */
    private Integer electQuantity;
}

