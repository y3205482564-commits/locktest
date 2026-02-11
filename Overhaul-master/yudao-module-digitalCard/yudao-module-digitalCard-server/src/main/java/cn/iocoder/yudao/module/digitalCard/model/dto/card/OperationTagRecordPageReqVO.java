package cn.iocoder.yudao.module.digitalCard.model.dto.card;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;
import java.util.Date;

@Data
public class OperationTagRecordPageReqVO {
    /**
     * 页码
     */
    private Integer pageNo = 1;

    /**
     * 每页条数
     */
    private Integer pageSize = 10;

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
     * 记录状态（1=已领用未归还 2=已归还 3=作废）
     */
    private Integer status;

    /**
     * 领用时间开始
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date useTimeStart;

    /**
     * 领用时间结束
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date useTimeEnd;

    /**
     * 租户编号
     */
    private Long tenantId;
}
