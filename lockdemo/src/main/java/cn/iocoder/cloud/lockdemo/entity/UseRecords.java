package cn.iocoder.cloud.lockdemo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.util.Date;
import lombok.Data;

/**
 * 锁使用记录表
 * @TableName use_records
 */
@TableName(value ="use_records")
@Data
public class UseRecords {
    /**
     * 记录ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 设备ID
     */
    private String bluetooth_id;

    /**
     * 用户ID
     */
    private String user_id;

    /**
     * 锁状态（1=开锁，0=关锁）
     */
    private Integer lock_status;

    /**
     * 
     */
    private Date create_time;
}