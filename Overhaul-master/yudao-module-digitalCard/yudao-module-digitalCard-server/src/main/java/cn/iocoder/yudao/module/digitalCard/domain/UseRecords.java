package cn.iocoder.yudao.module.digitalCard.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 锁使用记录表
 */
@Data
@TableName("use_records")
public class UseRecords {

    /**
     * 记录ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 设备ID
     */
    private String bluetoothId;

    /**
     * 用户ID（关联 yudao 用户表）
     */
    private Long userId;

    /**
     * 锁状态（1=开锁，0=关锁）
     */
    private Integer lockStatus;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;
}

