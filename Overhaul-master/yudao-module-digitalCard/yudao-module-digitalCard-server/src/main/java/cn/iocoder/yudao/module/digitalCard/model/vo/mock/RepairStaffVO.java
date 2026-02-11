package cn.iocoder.yudao.module.digitalCard.model.vo.mock;

import lombok.Data;

/**
 * 检修人员选择VO
 * 用于前端检修人员下拉选择、列表展示等场景
 */
@Data
public class RepairStaffVO {

    /**
     * 检修人员ID
     */
    private Long staffId;

    /**
     * 检修人员姓名
     */
    private String staffName;

}
