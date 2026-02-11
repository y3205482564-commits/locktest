package cn.iocoder.yudao.module.digitalCard.model.dto.card;

import lombok.Data;
import java.util.Date;

@Data
public class OperationTagRecordRespVO {
    /**
     * 主键ID
     */
    private Long id;

    /**
     * 关联操作牌ID
     */
    private Long tagId;

    /**
     * 关联站室ID
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
     * 归还时间
     */
    private Date returnTime;

    /**
     * 记录状态（1=已领用未归还 2=已归还 3=作废）
     */
    private Integer status;

    /**
     * 备注
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
     * 租户编号
     */
    private Long tenantId;
}
