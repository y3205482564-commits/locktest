package cn.iocoder.yudao.module.digitalCard.model.vo.mock;

import lombok.Data;

/**
 * 电气室选择VO
 * 用于前端电气室下拉选择、列表展示等场景
 */
@Data
public class ElectricRoomVO {

    /**
     * 电气室ID
     */
    private Long electricRoomId;

    /**
     * 电气室名称
     */
    private String electricRoomName;
}
