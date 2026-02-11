package cn.iocoder.yudao.module.digitalCard.model.vo;

import lombok.Data;

/**
 * 检修委托单表实体类
 * 对应数据库表：TQRJH03
 * @author 开发者
 * @date 2026-01-13
 */
@Data
public class Tqrjh03VO {

    /**
     * 内码
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
    private Long num;

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
     * 主控标记
     */
    private String mainFlag;

    /**
     * 标准项目编号
     */
    private String standardProjectId;

    /**
     * 标准项目名称
     */
    private String standardProjectName;

    /**
     * 标准施工类别
     */
    private String standardConstructType;

    /**
     * 施工类别
     */
    private String constructType;

    /**
     * 成本中心代码
     */
    private String costCenterCode;

    /**
     * 费用分类
     */
    private String feeCat;

    /**
     * 检修类别
     */
    private String repairType;

    /**
     * 工事分类
     */
    private String workCat;

    /**
     * 预计施工日期
     */
    private String estiConstructDate;

    /**
     * 质量层级
     */
    private String qualityLevel;

    /**
     * 高危等级
     */
    private String heightLevel;

    /**
     * 双高精度
     */
    private String twoHighAccuracy;

    /**
     * 安全牌数量
     */
    private Long safetyCardNum;

    /**
     * 定额编号
     */
    private String quotaId;

    /**
     * 定额名称
     */
    private String quotaName;

    /**
     * 总人数
     */
    private Long totalMans;

    /**
     * 总工时
     */
    private Double totalHour;

    /**
     * 人工费用
     */
    private Double manFee;

    /**
     * 机具费
     */
    private Double machinetoolFee;

    /**
     * 物料费用
     */
    private Double smFee;

    /**
     * 总费用(委托时后的费用信息，多个项目为多个项目的费用)
     */
    private Double totalFee;

    /**
     * 工作内容
     */
    private String workContent;

    /**
     * 计划编号
     */
    private String planId;

    /**
     * 序号
     */
    private String seqNum;

    /**
     * 异常联络单编号
     */
    private String abnId;

    /**
     * 故障台账编号
     */
    private String failureLedgerId;

    /**
     * 验收记录
     */
    private String acceptRecord;

    /**
     * 开工日期
     */
    private String startDate;

    /**
     * 完工日期
     */
    private String finishDate;

    /**
     * 部位
     */
    private String position;

    /**
     * 现象
     */
    private String phenomenon;

    /**
     * 不良原因
     */
    private String badReason;

    /**
     * 建议施工班组
     */
    private String suggestConstructTeam;

    /**
     * 建议施工班组名
     */
    private String suggestUnitName;

    /**
     * 负责人
     */
    private String inchargeMan;

    /**
     * 实际施工班组
     */
    private String actSquadCode;

    /**
     * 实际施工班组名称
     */
    private String actSquadName;

    /**
     * 施工单位
     */
    private String constructUnit;

    /**
     * 工作内容补充
     */
    private String workContentAppend;

    /**
     * 处理方式
     */
    private String dealMode;

    /**
     * 加班工时
     */
    private Double overtimeManhour;

    /**
     * 完工数量
     */
    private Long finishNum;

    /**
     * 报支金额
     */
    private Double payAmount;

    /**
     * 报支日期
     */
    private String payDate;

    /**
     * 相符标记
     */
    private String accordFlag;

    /**
     * 加成
     */
    private String bonus;

    /**
     * 信息返馈代码
     */
    private String infoBackCode;

    /**
     * 回退状态
     */
    private String rebukeStatus;

    /**
     * 回退原因
     */
    private String fallbackReason;

    /**
     * 环境系数
     */
    private String environRatio;

    /**
     * 超高系数
     */
    private String heightRatio;

    /**
     * 技术难度
     */
    private String techDifficulty;

    /**
     * 误工补差
     */
    private String delayCompensation;

    /**
     * 定额金额
     */
    private Double quotaAmount;

    /**
     * 合同金额
     */
    private Double contractMoney;

    /**
     * 惩罚
     */
    private Double punish;

    /**
     * 奖励
     */
    private Double reward;

    /**
     * 可完工标记
     */
    private String finishableFlag;

    /**
     * 可打印标记
     */
    private String printableFlag;

    /**
     * 合同结算日期
     */
    private String totalSettleDate;

    /**
     * 大修项目号
     */
    private String overhaulPrjId;

    /**
     * 关键设备标记
     */
    private String crucialFlag;

    /**
     * 生产岗位号
     */
    private String manufactureJobId;

    /**
     * 确认人岗位
     */
    private String confirmJobId;

    /**
     * 合并委托单编号
     */
    private String combEntrustId;

    /**
     * 合并项目名称
     */
    private String combProjectName;

    /**
     * 合并标记
     */
    private String mergeFlag;

    /**
     * 打印标记
     */
    private String printFlag;

    /**
     * 打印时间
     */
    private String printTime;

    /**
     * 打印工号
     */
    private String printMan;

    /**
     * 打印人
     */
    private String printUser;

    /**
     * 文档编号
     */
    private Long docId;

    /**
     * 帐套
     */
    private String companyCode;

    /**
     * 创建人部门代码
     */
    private String createDeptId;

    /**
     * 创建人部门名称
     */
    private String createDeptName;

    /**
     * 记录创建人岗号
     */
    private String recCreateJobId;

    /**
     * 备用字段1(已经启用，与检修记录卡相关)
     */
    private String backCol1;

    /**
     * 备用字段2(已经启用，与检修实际登录有关) 1：已完工  0：未完工
     */
    private String backCol2;

    /**
     * 备用字段3(完工实绩登录时间)
     */
    private String backCol3;

    /**
     * 备用字段4(结算单号)
     */
    private String backCol4;

    /**
     * 备用字段5(下次排程时间)
     */
    private String backCol5;

    /**
     * 备用字段6（周期）
     */
    private String backCol6;

    /**
     * 备用字段7（周期单位）
     */
    private String backCol7;

    /**
     * 备用字段8(前1/2周期)
     */
    private String backCol8;

    /**
     * 备用字段9(后1/2周期)
     */
    private String backCol9;

    /**
     * 备用字段10(定额费用)
     */
    private Double backCol10;

    /**
     * 备用字段11
     */
    private Double backCol11;

    /**
     * 备用字段12
     */
    private Double backCol12;

    /**
     * 审核人工号
     */
    private String auditUserId;

    /**
     * 审核人岗号
     */
    private String auditJobId;

    /**
     * 审核人姓名
     */
    private String auditUserName;

    /**
     * 审核层级
     */
    private String auditLevel;

    /**
     * 审核状态
     */
    private String auditStatus;

    /**
     * 审核日期
     */
    private String auditDate;

    /**
     * 审核意见
     */
    private String auditOpinion;

    /**
     * 审核履历
     */
    private String auditLog;

    /**
     * 记录创建人
     */
    private String recCreator;

    /**
     * 记录创建人姓名
     */
    private String recCreatorName;

    /**
     * 记录创建时间
     */
    private String recCreateTime;

    /**
     * 记录修改人
     */
    private String recRevisor;

    /**
     * 记录修改人姓名
     */
    private String recRevisorName;

    /**
     * 记录修改时间
     */
    private String recReviseTime;

    /**
     * 归档标志
     */
    private String archiveFlag;

    /**
     * 归档时间
     */
    private String archiveTime;

    /**
     * 归档邮戳号
     */
    private String archiveStampNo;

    /**
     * 状态
     */
    private String status;

    /**
     * 工作流实例ID
     */
    private String processInstanceId;

    /**
     * 高危属性
     */
    private String heightProp;

    /**
     * 待修原因
     */
    private String moveOutReason;

    /**
     * 计划名称
     */
    private String planName;

    /**
     * 备用字段13(预计完工日期)
     */
    private String backCol13;

    /**
     * 备用字段14(计划调整日期)
     */
    private String backCol14;

    /**
     * 备用字段15(计划完工调整日期)
     */
    private String backCol15;

    /**
     * 备用字段16(确认人)
     */
    private String backCol16;

    /**
     * 备用字段17(日期变更流程Id)
     */
    private String backCol17;

    /**
     * 备用字段18(审核状态)
     */
    private String backCol18;

    /**
     * 备用字段19(部门代码C4)
     */
    private String backCol19;

    /**
     * 备用字段20(异常状态)
     */
    private String backCol20;

    /**
     * 备用字段21(验收标准)
     */
    private String backCol21;

    /**
     * 备用字段22
     */
    private String backCol22;

    /**
     * 备用字段23(发送日管控标识Y：已发送)
     */
    private String backCol23;

    /**
     * 施工类别H
     */
    private String constructTypeH;

    /**
     * 备用字段24
     */
    private Double backCol24;

    /**
     * 备用字段25
     */
    private Double backCol25;

    /**
     * 备用字段26
     */
    private Double backCol26;

    /**
     * 备用字段27
     */
    private Double backCol27;

    /**
     * 备用字段28
     */
    private Double backCol28;

    /**
     * (已经启用)临时工单类别
     */
    private String backCol29;

    /**
     * (已经启用)工单备注
     */
    private String backCol30;

    /**
     * 备用字段31
     */
    private String backCol31;

    /**
     * 备用字段32
     */
    private String backCol32;

    /**
     * 备用字段33
     */
    private String backCol33;

    /**
     * 备用字段34
     */
    private String backCol34;

    /**
     * 备用字段35
     */
    private String backCol35;

    /**
     * 备用字段36
     */
    private Double backCol36;

    /**
     * 备用字段37
     */
    private Double backCol37;

    /**
     * 备用字段38
     */
    private Double backCol38;

    /**
     * 备用字段39
     */
    private Double backCol39;

    /**
     * 备用字段40
     */
    private Double backCol40;

    /**
     * 备用字段41
     */
    private Double backCol41;

    /**
     * 备用字段42
     */
    private Double backCol42;

    /**
     * 备用字段43
     */
    private Double backCol43;

    /**
     * 备用字段44
     */
    private Double backCol44;

    /**
     * 备用字段45
     */
    private Double backCol45;

    /**
     * 备用字段46
     */
    private String backCol46;

    /**
     * 备用字段47
     */
    private String backCol47;

    /**
     * (已经启用)一次性工单标识
     */
    private String backCol48;

    /**
     * 电机结算单号
     */
    private String bagId;

    /**
     * 总费用单价（计算用）
     */
    private Double globalTotalFee;
}
