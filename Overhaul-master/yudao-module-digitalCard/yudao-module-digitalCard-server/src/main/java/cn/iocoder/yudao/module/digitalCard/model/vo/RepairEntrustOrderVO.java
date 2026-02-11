package cn.iocoder.yudao.module.digitalCard.model.vo;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 检修委托单 VO 类
 * 对应数据库表 TQRJH03
 * @author 开发者
 * @date 2026-01-14
 */
@Data
public class RepairEntrustOrderVO {

    /**
     * 内码（主键）
     */
    private String internalCode;

    /**
     * 委托单编号
     */
    private String trustId;

    /**
     * 设备编号
     */
    private String deviceId;

    /**
     * 设备名称
     */
    private String deviceName;

    /**
     * 项目类型
     */
    private String projectType;

    /**
     * 数量
     */
    private BigDecimal num;

    /**
     * 数量单位
     */
    private String numUnit;

    /**
     * 单项申请单编号(项目号)
     */
    private String monoApplyformId;

    /**
     * 委托时间
     */
    private String trustTime;

    /**
     * 需求日期
     */
    private String reqDate;

    /**
     * 委托人岗号(姓名)
     */
    private String entrustJobId;

    /**
     * 点检岗号(姓名)
     */
    private String checkJobId;

    /**
     * 缓急程度
     */
    private String urgentDegree;

    /**
     * 请修原因
     */
    private String repairReason;

    /**
     * 检修类别
     */
    private String repairType;

    /**
     * 施工类别
     */
    private String constructType;

    /**
     * 总人数
     */
    private BigDecimal totalMans;

    /**
     * 总工时
     */
    private BigDecimal totalHour;

    /**
     * 人工费用
     */
    private BigDecimal manFee;

    /**
     * 机具费
     */
    private BigDecimal machinetoolFee;

    /**
     * 物料费用
     */
    private BigDecimal smFee;

    /**
     * 总费用(委托时后的费用信息，多个项目为多个项目的费用)
     */
    private BigDecimal totalFee;

    /**
     * 总费用单价（计算用）
     */
    private BigDecimal globalTotalFee;

    /**
     * 工作内容
     */
    private String workContent;

    /**
     * 开工日期
     */
    private String startDate;

    /**
     * 完工日期
     */
    private String finishDate;

    /**
     * 建议施工班组
     */
    private String suggestConstructTeam;

    /**
     * 实际施工班组
     */
    private String actSquadCode;

    /**
     * 完工数量
     */
    private BigDecimal finishNum;

    /**
     * 回退状态
     */
    private String rebukeStatus;

    /**
     * 回退原因
     */
    private String fallbackReason;

    /**
     * 审核状态
     */
    private String auditStatus;

    /**
     * 审核人姓名
     */
    private String auditUserName;

    /**
     * 记录创建人姓名
     */
    private String recCreatorName;

    /**
     * 记录创建时间
     */
    private String recCreateTime;

    /**
     * 状态
     */
    private String status;

    /**
     * 可完工标记
     */
    private String finishableFlag;


}
