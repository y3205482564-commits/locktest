package cn.iocoder.yudao.module.digitalCard.model.vo.stationRoom;

import lombok.Data;
import java.util.Date;

/**
 * 站室响应VO
 */
@Data
public class StationRoomRespVO {

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

    /**
     * 显示顺序
     */
    private Integer sort;

    /**
     * 状态（0正常 1停用）
     */
    private Integer status;

    /**
     * 负责人用户ID
     */
    private Long leaderUserId;

    /**
     * 联系电话
     */
    private String phone;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 创建者
     */
    private String creator;

    /**
     * 更新时间
     */
    private Date updateTime;

    /**
     * 更新者
     */
    private String updater;

    /**
     * 租户ID
     */
    private Long tenantId;
}
