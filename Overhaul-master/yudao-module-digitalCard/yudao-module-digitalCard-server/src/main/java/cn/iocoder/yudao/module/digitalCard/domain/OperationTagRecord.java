package cn.iocoder.yudao.module.digitalCard.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * 操作牌领用归还记录表
 * @TableName operation_tag_record
 */
@TableName(value ="operation_tag_record")
@Data
public class OperationTagRecord implements Serializable {
    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 关联操作牌ID（operation_tag表id）
     */
    private Long tagId;

    /**
     * 关联站室ID（station_room表id）
     */
    private Long stationRoomId;

    /**
     * 领用单位
     */
    private String useUnit;

    /**
     * 领用人
     */
    private String usePerson;

    /**
     * 领用时点检人员
     */
    private String useInspector;

    /**
     * 领用操作人员
     */
    private String useOperator;

    /**
     * 领用时间
     */
    private Date useTime;

    /**
     * 归还人
     */
    private String returnPerson;

    /**
     * 归还时点检人员
     */
    private String returnInspector;

    /**
     * 归还操作人员
     */
    private String returnOperator;

    /**
     * 归还时间（NULL表示未归还）
     */
    private Date returnTime;

    /**
     * 记录状态（1=已领用未归还 2=已归还 3=作废）
     */
    private Integer status;

    /**
     * 备注（领用/归还说明）
     */
    private String remark;

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
     * 是否删除（0=未删除 1=已删除）
     */
    private Boolean deleted;

    /**
     * 租户编号（多租户隔离）
     */
    private Long tenantId;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
