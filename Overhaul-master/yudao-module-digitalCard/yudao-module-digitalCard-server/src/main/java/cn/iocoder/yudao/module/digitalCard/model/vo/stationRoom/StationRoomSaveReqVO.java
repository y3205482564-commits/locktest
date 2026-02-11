package cn.iocoder.yudao.module.digitalCard.model.vo.stationRoom;

import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * 站室保存请求VO
 */
@Data
public class StationRoomSaveReqVO {

    /**
     * 站室ID（更新时必填）
     */
    private Long id;

    /**
     * 站室名称（1级：事业部、2级：区域、3级：站室名）
     */
    @NotBlank(message = "站室名称不能为空")
    @Size(max = 30, message = "站室名称长度不能超过30个字符")
    private String name;

    /**
     * 上级站室ID（1级站室父ID为0）
     */
    @NotNull(message = "上级站室ID不能为空")
    private Long parentId;

    /**
     * 显示顺序
     */
    @NotNull(message = "排序值不能为空")
    private Integer sort;

    /**
     * 状态（0正常 1停用）
     */
    @NotNull(message = "状态不能为空")
    private Integer status;

    /**
     * 负责人用户ID
     */
    private Long leaderUserId;

    /**
     * 联系电话
     */
    @Size(max = 11, message = "联系电话长度不能超过11个字符")
    private String phone;

    /**
     * 邮箱
     */
    @Size(max = 50, message = "邮箱长度不能超过50个字符")
    private String email;
}
