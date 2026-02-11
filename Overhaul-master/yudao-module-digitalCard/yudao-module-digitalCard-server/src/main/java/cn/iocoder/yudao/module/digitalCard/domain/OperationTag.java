package cn.iocoder.yudao.module.digitalCard.domain;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * 操作牌表
 * @TableName operation_tag
 */
@TableName(value ="operation_tag")
@Data
public class OperationTag implements Serializable {
    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 标签类型（如：绿色操作牌/红色操作牌）
     */
    private String tagType;

    /**
     * 站室ID
     * 默认为0，表示无归属
     */
    @TableField(value = "station_room_id", fill = FieldFill.DEFAULT)
    private Long stationRoomId = 0L;

    /**
     * 归属区域（如：4300炉轧区）
     */
    private String area;

    /**
     * 操作台编号（如：1#操作台）
     */
    private String consoleNo;

    /**
     * 设备位置（如：加热炉入炉辊道）
     */
    private String deviceLocation;

    /**
     * 归属单位（如：首钢京唐公司中厚板事业部）
     */
    private String belongUnit;

    /**
     * 作业数（支持负数，如：0/-1）
     */
    private Integer workCount;

    /**
     * 领用单位（如：首宝）
     */
    private String useUnit;

    /**
     * 领用人（如：张三）
     */
    private String usePerson;

    /**
     * 点检人员（如：李四）
     */
    private String inspector;

    /**
     * 操作人员（如：王五）
     */
    private String operator;

    /**
     * 领用时间（如：2025-10-10 08:30:00）
     */
    private Date useTime;

    /**
     * 创建人
     */
    private String creator;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新人
     */
    private String updater;

    /**
     * 更新时间
     */
    private Date updateTime;

    /**
     * 删除状态：0=未删除，1=已删除
     */
    private Integer deleted;

    /**
     * 租户ID，用于多租户隔离
     */
    private Long tenantId;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
