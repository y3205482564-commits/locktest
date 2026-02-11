package cn.iocoder.yudao.module.digitalCard.model.vo.card;

import lombok.Data;

/**
 * 操作标签精简信息 VO
 * 仅包含下拉选项所需核心字段，用于前端下拉选择场景
 *
 * @author 编程助手
 * @version 1.0
 * @date 2026/1/21
 */
@Data
public class SimpleOperationTagVO {
    /**
     * 主键ID（下拉选项的value）
     */
    private Long id;

    /**
     * 标签名称/显示文本（下拉选项的label）
     * 拼接规则：标签类型 + 区域 + 操作台编号，便于前端展示
     */
    private String label;

    /**
     * 标签类型（如：绿色操作牌/红色操作牌）
     */
    private String tagType;

    /**
     * 站室ID
     */
    private Long stationRoomId;

    /**
     * 归属区域（如：4300炉轧区）
     */
    private String area;

    /**
     * 操作台编号（如：1#操作台）
     */
    private String consoleNo;

    /**
     * 租户ID（用于多租户隔离场景的下拉筛选）
     */
    private Long tenantId;
}
