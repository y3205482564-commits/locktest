package cn.iocoder.cloud.lockdemo.dto;

import lombok.Data;

/**
 * 蓝牙设备信息DTO
 */
@Data
public class BluetoothBaseInfoDTO {
    
    /**
     * 设备ID
     */
    private String id;
    
    /**
     * 锁具编号
     */
    private String lockNum;
    
    /**
     * MAC地址
     */
    private String mac;
    
    /**
     * 锁类型（0/2/3）
     */
    private String blueType;
    
    /**
     * 密码
     */
    private String password;
    
    /**
     * 密钥
     */
    private String secretKey;
    
    /**
     * 使用次数
     */
    private Integer useCount;
    
    /**
     * 上次使用人
     */
    private String lastUser;
    
    /**
     * 上次使用时间
     */
    private String lastUseTime;
    
    /**
     * 是否有关锁功能（0/1）
     */
    private String isInstructClosed;
    
    /**
     * 是否需要答题（0/1）
     */
    private String answerQuestion;
    
    /**
     * 电量
     */
    private Integer electQuantity;
}

