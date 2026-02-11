package cn.iocoder.yudao.module.digitalCard.model.vo.mock;

import lombok.Data;

/**
 * 操作室选择VO
 * 用于前端操作室下拉选择、列表展示等场景
 */
@Data
public class OperationRoomVO {

    /**
     * 操作室ID
     */
    private Long roomId;

    /**
     * 操作室名称
     */
    private String roomName;
}
