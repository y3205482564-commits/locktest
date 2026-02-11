package cn.iocoder.yudao.module.digitalCard.model.vo.stationRoom;

import lombok.Data;

/**
 * 站室精简响应VO（用于下拉选择）
 */
@Data
public class StationRoomSimpleRespVO {

    /**
     * 站室ID
     */
    private Long id;

    /**
     * 站室名称
     */
    private String name;

    /**
     * 上级站室ID
     */
    private Long parentId;
}
