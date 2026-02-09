package cn.iocoder.cloud.lockdemo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 蓝牙设备信息实体类
 */
@Data
@TableName("bluetooth_base")
public class BluetoothBase {
    
    /**
     * 设备ID
     */
    @TableId(type = IdType.INPUT)
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
    private LocalDateTime lastUseTime;
    
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
    
    /**
     * 创建时间
     */
    private LocalDateTime createTime;
    
    /**
     * 更新时间
     */
    private LocalDateTime updateTime;
}

