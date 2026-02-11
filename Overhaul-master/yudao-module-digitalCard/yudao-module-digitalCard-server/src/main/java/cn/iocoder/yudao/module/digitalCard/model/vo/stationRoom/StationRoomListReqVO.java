package cn.iocoder.yudao.module.digitalCard.model.vo.stationRoom;

import lombok.Data;

/**
 * 站室列表查询请求VO
 */
@Data
public class StationRoomListReqVO {

    /**
     * 站室名称（模糊查询）
     */
    private String name;

    /**
     * 状态（0正常 1停用）
     */
    private Integer status;
}
