package cn.iocoder.yudao.module.digitalCard.model.dto.card;

import lombok.Data;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Data
public class OperationTagRecordSaveReqVO {
    /**
     * 主键ID（修改时必填）
     */
    private Long id;

    /**
     * 关联操作牌ID
     */
    @NotNull(message = "操作牌ID不能为空")
    private Long tagId;

    /**
     * 关联站室ID
     */
    @NotNull(message = "站室ID不能为空")
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
     * 租户编号
     */
    private Long tenantId;
}
