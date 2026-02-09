package cn.iocoder.cloud.lockdemo.dto;

import lombok.Data;

/**
 * 使用记录DTO
 */
@Data
public class UseRecordDTO {
    
    /**
     * 设备ID
     */
    private String bluetoothId;
    
    /**
     * 用户ID
     */
    private String userId;
    
    /**
     * 锁状态（1=开锁，0=关锁）
     */
    private Integer lockStatus;
}

