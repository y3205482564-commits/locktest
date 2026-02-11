package cn.iocoder.yudao.module.digitalCard.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;

/**
 * 检修委托单表实体类
 * 对应数据库表：TQRJH03
 * @author 开发者
 * @date 2026-01-13
 */
@Data
@TableName(value = "TQRJH03")
public class Tqrjh03 implements Serializable {

    /**
     * 内码
     */
    @TableId(value = "INTERNAL_CODE", type = IdType.INPUT) // 内码为手动输入，非自增
    private String internalCode;

    /**
     * 委托单编号
     */
    @TableField(value = "TRUST_ID")
    private String trustId;

    /**
     * 设备编号
     */
    @TableField(value = "DEVICE_ID")
    private String deviceId;

    /**
     * 设备名称
     */
    @TableField(value = "DEVICE_NAME")
    private String deviceName;

    /**
     * 项目类型
     */
    @TableField(value = "PROJECT_TYPE")
    private String projectType;

    /**
     * 数量
     */
    @TableField(value = "NUM")
    private Long num;

    /**
     * 数量单位
     */
    @TableField(value = "NUM_UNIT")
    private String numUnit;

    /**
     * 单项申请单编号(项目号)
     */
    @TableField(value = "MONO_APPLYFORM_ID")
    private String monoApplyformId;

    /**
     * 委托时间
     */
    @TableField(value = "TRUST_TIME")
    private String trustTime;

    /**
     * 需求日期
     */
    @TableField(value = "REQ_DATE")
    private String reqDate;

    /**
     * 委托人岗号(姓名)
     */
    @TableField(value = "ENTRUST_JOB_ID")
    private String entrustJobId;

    /**
     * 点检岗号(姓名)
     */
    @TableField(value = "CHECK_JOB_ID")
    private String checkJobId;

    /**
     * 缓急程度
     */
    @TableField(value = "URGENT_DEGREE")
    private String urgentDegree;

    /**
     * 请修原因
     */
    @TableField(value = "REPAIR_REASON")
    private String repairReason;

    /**
     * 主控标记
     */
    @TableField(value = "MAIN_FLAG")
    private String mainFlag;

    /**
     * 标准项目编号
     */
    @TableField(value = "STANDARD_PROJECT_ID")
    private String standardProjectId;

    /**
     * 标准项目名称
     */
    @TableField(value = "STANDARD_PROJECT_NAME")
    private String standardProjectName;

    /**
     * 标准施工类别
     */
    @TableField(value = "STANDARD_CONSTRUCT_TYPE")
    private String standardConstructType;

    /**
     * 施工类别
     */
    @TableField(value = "CONSTRUCT_TYPE")
    private String constructType;

    /**
     * 成本中心代码
     */
    @TableField(value = "COST_CENTER_CODE")
    private String costCenterCode;

    /**
     * 费用分类
     */
    @TableField(value = "FEE_CAT")
    private String feeCat;

    /**
     * 检修类别
     */
    @TableField(value = "REPAIR_TYPE")
    private String repairType;

    /**
     * 工事分类
     */
    @TableField(value = "WORK_CAT")
    private String workCat;

    /**
     * 预计施工日期
     */
    @TableField(value = "ESTI_CONSTRUCT_DATE")
    private String estiConstructDate;

    /**
     * 质量层级
     */
    @TableField(value = "QUALITY_LEVEL")
    private String qualityLevel;

    /**
     * 高危等级
     */
    @TableField(value = "HEIGHT_LEVEL")
    private String heightLevel;

    /**
     * 双高精度
     */
    @TableField(value = "TWO_HIGH_ACCURACY")
    private String twoHighAccuracy;

    /**
     * 安全牌数量
     */
    @TableField(value = "SAFETY_CARD_NUM")
    private Long safetyCardNum;

    /**
     * 定额编号
     */
    @TableField(value = "QUOTA_ID")
    private String quotaId;

    /**
     * 定额名称
     */
    @TableField(value = "QUOTA_NAME")
    private String quotaName;

    /**
     * 总人数
     */
    @TableField(value = "TOTAL_MANS")
    private Long totalMans;

    /**
     * 总工时
     */
    @TableField(value = "TOTAL_HOUR")
    private Double totalHour;

    /**
     * 人工费用
     */
    @TableField(value = "MAN_FEE")
    private Double manFee;

    /**
     * 机具费
     */
    @TableField(value = "MACHINETOOL_FEE")
    private Double machinetoolFee;

    /**
     * 物料费用
     */
    @TableField(value = "SM_FEE")
    private Double smFee;

    /**
     * 总费用(委托时后的费用信息，多个项目为多个项目的费用)
     */
    @TableField(value = "TOTAL_FEE")
    private Double totalFee;

    /**
     * 工作内容
     */
    @TableField(value = "WORK_CONTENT")
    private String workContent;

    /**
     * 计划编号
     */
    @TableField(value = "PLAN_ID")
    private String planId;

    /**
     * 序号
     */
    @TableField(value = "SEQ_NUM")
    private String seqNum;

    /**
     * 异常联络单编号
     */
    @TableField(value = "ABN_ID")
    private String abnId;

    /**
     * 故障台账编号
     */
    @TableField(value = "FAILURE_LEDGER_ID")
    private String failureLedgerId;

    /**
     * 验收记录
     */
    @TableField(value = "ACCEPT_RECORD")
    private String acceptRecord;

    /**
     * 开工日期
     */
    @TableField(value = "START_DATE")
    private String startDate;

    /**
     * 完工日期
     */
    @TableField(value = "FINISH_DATE")
    private String finishDate;

    /**
     * 部位
     */
    @TableField(value = "POSITION")
    private String position;

    /**
     * 现象
     */
    @TableField(value = "PHENOMENON")
    private String phenomenon;

    /**
     * 不良原因
     */
    @TableField(value = "BAD_REASON")
    private String badReason;

    /**
     * 建议施工班组
     */
    @TableField(value = "SUGGEST_CONSTRUCT_TEAM")
    private String suggestConstructTeam;

    /**
     * 建议施工班组名
     */
    @TableField(value = "SUGGEST_UNIT_NAME")
    private String suggestUnitName;

    /**
     * 负责人
     */
    @TableField(value = "INCHARGE_MAN")
    private String inchargeMan;

    /**
     * 实际施工班组
     */
    @TableField(value = "ACT_SQUAD_CODE")
    private String actSquadCode;

    /**
     * 实际施工班组名称
     */
    @TableField(value = "ACT_SQUAD_NAME")
    private String actSquadName;

    /**
     * 施工单位
     */
    @TableField(value = "CONSTRUCT_UNIT")
    private String constructUnit;

    /**
     * 工作内容补充
     */
    @TableField(value = "WORK_CONTENT_APPEND")
    private String workContentAppend;

    /**
     * 处理方式
     */
    @TableField(value = "DEAL_MODE")
    private String dealMode;

    /**
     * 加班工时
     */
    @TableField(value = "OVERTIME_MANHOUR")
    private Double overtimeManhour;

    /**
     * 完工数量
     */
    @TableField(value = "FINISH_NUM")
    private Long finishNum;

    /**
     * 报支金额
     */
    @TableField(value = "PAY_AMOUNT")
    private Double payAmount;

    /**
     * 报支日期
     */
    @TableField(value = "PAY_DATE")
    private String payDate;

    /**
     * 相符标记
     */
    @TableField(value = "ACCORD_FLAG")
    private String accordFlag;

    /**
     * 加成
     */
    @TableField(value = "BONUS")
    private String bonus;

    /**
     * 信息返馈代码
     */
    @TableField(value = "INFO_BACK_CODE")
    private String infoBackCode;

    /**
     * 回退状态
     */
    @TableField(value = "REBUKE_STATUS")
    private String rebukeStatus;

    /**
     * 回退原因
     */
    @TableField(value = "FALLBACK_REASON")
    private String fallbackReason;

    /**
     * 环境系数
     */
    @TableField(value = "ENVIRON_RATIO")
    private String environRatio;

    /**
     * 超高系数
     */
    @TableField(value = "HEIGHT_RATIO")
    private String heightRatio;

    /**
     * 技术难度
     */
    @TableField(value = "TECH_DIFFICULTY")
    private String techDifficulty;

    /**
     * 误工补差
     */
    @TableField(value = "DELAY_COMPENSATION")
    private String delayCompensation;

    /**
     * 定额金额
     */
    @TableField(value = "QUOTA_AMOUNT")
    private Double quotaAmount;

    /**
     * 合同金额
     */
    @TableField(value = "CONTRACT_MONEY")
    private Double contractMoney;

    /**
     * 惩罚
     */
    @TableField(value = "PUNISH")
    private Double punish;

    /**
     * 奖励
     */
    @TableField(value = "REWARD")
    private Double reward;

    /**
     * 可完工标记
     */
    @TableField(value = "FINISHABLE_FLAG")
    private String finishableFlag;

    /**
     * 可打印标记
     */
    @TableField(value = "PRINTABLE_FLAG")
    private String printableFlag;

    /**
     * 合同结算日期
     */
    @TableField(value = "TOTAL_SETTLE_DATE")
    private String totalSettleDate;

    /**
     * 大修项目号
     */
    @TableField(value = "OVERHAUL_PRJ_ID")
    private String overhaulPrjId;

    /**
     * 关键设备标记
     */
    @TableField(value = "CRUCIAL_FLAG")
    private String crucialFlag;

    /**
     * 生产岗位号
     */
    @TableField(value = "MANUFACTURE_JOB_ID")
    private String manufactureJobId;

    /**
     * 确认人岗位
     */
    @TableField(value = "CONFIRM_JOB_ID")
    private String confirmJobId;

    /**
     * 合并委托单编号
     */
    @TableField(value = "COMB_ENTRUST_ID")
    private String combEntrustId;

    /**
     * 合并项目名称
     */
    @TableField(value = "COMB_PROJECT_NAME")
    private String combProjectName;

    /**
     * 合并标记
     */
    @TableField(value = "MERGE_FLAG")
    private String mergeFlag;

    /**
     * 打印标记
     */
    @TableField(value = "PRINT_FLAG")
    private String printFlag;

    /**
     * 打印时间
     */
    @TableField(value = "PRINT_TIME")
    private String printTime;

    /**
     * 打印工号
     */
    @TableField(value = "PRINT_MAN")
    private String printMan;

    /**
     * 打印人
     */
    @TableField(value = "PRINT_USER")
    private String printUser;

    /**
     * 文档编号
     */
    @TableField(value = "DOC_ID")
    private Long docId;

    /**
     * 帐套
     */
    @TableField(value = "COMPANY_CODE")
    private String companyCode;

    /**
     * 创建人部门代码
     */
    @TableField(value = "CREATE_DEPT_ID")
    private String createDeptId;

    /**
     * 创建人部门名称
     */
    @TableField(value = "CREATE_DEPT_NAME")
    private String createDeptName;

    /**
     * 记录创建人岗号
     */
    @TableField(value = "REC_CREATE_JOB_ID")
    private String recCreateJobId;

    /**
     * 备用字段1(已经启用，与检修记录卡相关)
     */
    @TableField(value = "BACK_COL_1")
    private String backCol1;

    /**
     * 备用字段2(已经启用，与检修实际登录有关) 1：已完工  0：未完工
     */
    @TableField(value = "BACK_COL_2")
    private String backCol2;

    /**
     * 备用字段3(完工实绩登录时间)
     */
    @TableField(value = "BACK_COL_3")
    private String backCol3;

    /**
     * 备用字段4(结算单号)
     */
    @TableField(value = "BACK_COL_4")
    private String backCol4;

    /**
     * 备用字段5(下次排程时间)
     */
    @TableField(value = "BACK_COL_5")
    private String backCol5;

    /**
     * 备用字段6（周期）
     */
    @TableField(value = "BACK_COL_6")
    private String backCol6;

    /**
     * 备用字段7（周期单位）
     */
    @TableField(value = "BACK_COL_7")
    private String backCol7;

    /**
     * 备用字段8(前1/2周期)
     */
    @TableField(value = "BACK_COL_8")
    private String backCol8;

    /**
     * 备用字段9(后1/2周期)
     */
    @TableField(value = "BACK_COL_9")
    private String backCol9;

    /**
     * 备用字段10(定额费用)
     */
    @TableField(value = "BACK_COL_10")
    private Double backCol10;

    /**
     * 备用字段11
     */
    @TableField(value = "BACK_COL_11")
    private Double backCol11;

    /**
     * 备用字段12
     */
    @TableField(value = "BACK_COL_12")
    private Double backCol12;

    /**
     * 审核人工号
     */
    @TableField(value = "AUDIT_USER_ID")
    private String auditUserId;

    /**
     * 审核人岗号
     */
    @TableField(value = "AUDIT_JOB_ID")
    private String auditJobId;

    /**
     * 审核人姓名
     */
    @TableField(value = "AUDIT_USER_NAME")
    private String auditUserName;

    /**
     * 审核层级
     */
    @TableField(value = "AUDIT_LEVEL")
    private String auditLevel;

    /**
     * 审核状态
     */
    @TableField(value = "AUDIT_STATUS")
    private String auditStatus;

    /**
     * 审核日期
     */
    @TableField(value = "AUDIT_DATE")
    private String auditDate;

    /**
     * 审核意见
     */
    @TableField(value = "AUDIT_OPINION")
    private String auditOpinion;

    /**
     * 审核履历
     */
    @TableField(value = "AUDIT_LOG")
    private String auditLog;

    /**
     * 记录创建人
     */
    @TableField(value = "REC_CREATOR")
    private String recCreator;

    /**
     * 记录创建人姓名
     */
    @TableField(value = "REC_CREATOR_NAME")
    private String recCreatorName;

    /**
     * 记录创建时间
     */
    @TableField(value = "REC_CREATE_TIME")
    private String recCreateTime;

    /**
     * 记录修改人
     */
    @TableField(value = "REC_REVISOR")
    private String recRevisor;

    /**
     * 记录修改人姓名
     */
    @TableField(value = "REC_REVISOR_NAME")
    private String recRevisorName;

    /**
     * 记录修改时间
     */
    @TableField(value = "REC_REVISE_TIME")
    private String recReviseTime;

    /**
     * 归档标志
     */
    @TableField(value = "ARCHIVE_FLAG")
    private String archiveFlag;

    /**
     * 归档时间
     */
    @TableField(value = "ARCHIVE_TIME")
    private String archiveTime;

    /**
     * 归档邮戳号
     */
    @TableField(value = "ARCHIVE_STAMP_NO")
    private String archiveStampNo;

    /**
     * 状态
     */
    @TableField(value = "STATUS")
    private String status;

    /**
     * 工作流实例ID
     */
    @TableField(value = "PROCESS_INSTANCE_ID")
    private String processInstanceId;

    /**
     * 高危属性
     */
    @TableField(value = "HEIGHT_PROP")
    private String heightProp;

    /**
     * 待修原因
     */
    @TableField(value = "MOVE_OUT_REASON")
    private String moveOutReason;

    /**
     * 计划名称
     */
    @TableField(value = "PLAN_NAME")
    private String planName;

    /**
     * 备用字段13(预计完工日期)
     */
    @TableField(value = "BACK_COL_13")
    private String backCol13;

    /**
     * 备用字段14(计划调整日期)
     */
    @TableField(value = "BACK_COL_14")
    private String backCol14;

    /**
     * 备用字段15(计划完工调整日期)
     */
    @TableField(value = "BACK_COL_15")
    private String backCol15;

    /**
     * 备用字段16(确认人)
     */
    @TableField(value = "BACK_COL_16")
    private String backCol16;

    /**
     * 备用字段17(日期变更流程Id)
     */
    @TableField(value = "BACK_COL_17")
    private String backCol17;

    /**
     * 备用字段18(审核状态)
     */
    @TableField(value = "BACK_COL_18")
    private String backCol18;

    /**
     * 备用字段19(部门代码C4)
     */
    @TableField(value = "BACK_COL_19")
    private String backCol19;

    /**
     * 备用字段20(异常状态)
     */
    @TableField(value = "BACK_COL_20")
    private String backCol20;

    /**
     * 备用字段21(验收标准)
     */
    @TableField(value = "BACK_COL_21")
    private String backCol21;

    /**
     * 备用字段22
     */
    @TableField(value = "BACK_COL_22")
    private String backCol22;

    /**
     * 备用字段23(发送日管控标识Y：已发送)
     */
    @TableField(value = "BACK_COL_23")
    private String backCol23;

    /**
     * 施工类别H
     */
    @TableField(value = "CONSTRUCT_TYPE_H")
    private String constructTypeH;

    /**
     * 备用字段24
     */
    @TableField(value = "BACK_COL_24")
    private Double backCol24;

    /**
     * 备用字段25
     */
    @TableField(value = "BACK_COL_25")
    private Double backCol25;

    /**
     * 备用字段26
     */
    @TableField(value = "BACK_COL_26")
    private Double backCol26;

    /**
     * 备用字段27
     */
    @TableField(value = "BACK_COL_27")
    private Double backCol27;

    /**
     * 备用字段28
     */
    @TableField(value = "BACK_COL_28")
    private Double backCol28;

    /**
     * (已经启用)临时工单类别
     */
    @TableField(value = "BACK_COL_29")
    private String backCol29;

    /**
     * (已经启用)工单备注
     */
    @TableField(value = "BACK_COL_30")
    private String backCol30;

    /**
     * 备用字段31
     */
    @TableField(value = "BACK_COL_31")
    private String backCol31;

    /**
     * 备用字段32
     */
    @TableField(value = "BACK_COL_32")
    private String backCol32;

    /**
     * 备用字段33
     */
    @TableField(value = "BACK_COL_33")
    private String backCol33;

    /**
     * 备用字段34
     */
    @TableField(value = "BACK_COL_34")
    private String backCol34;

    /**
     * 备用字段35
     */
    @TableField(value = "BACK_COL_35")
    private String backCol35;

    /**
     * 备用字段36
     */
    @TableField(value = "BACK_COL_36")
    private Double backCol36;

    /**
     * 备用字段37
     */
    @TableField(value = "BACK_COL_37")
    private Double backCol37;

    /**
     * 备用字段38
     */
    @TableField(value = "BACK_COL_38")
    private Double backCol38;

    /**
     * 备用字段39
     */
    @TableField(value = "BACK_COL_39")
    private Double backCol39;

    /**
     * 备用字段40
     */
    @TableField(value = "BACK_COL_40")
    private Double backCol40;

    /**
     * 备用字段41
     */
    @TableField(value = "BACK_COL_41")
    private Double backCol41;

    /**
     * 备用字段42
     */
    @TableField(value = "BACK_COL_42")
    private Double backCol42;

    /**
     * 备用字段43
     */
    @TableField(value = "BACK_COL_43")
    private Double backCol43;

    /**
     * 备用字段44
     */
    @TableField(value = "BACK_COL_44")
    private Double backCol44;

    /**
     * 备用字段45
     */
    @TableField(value = "BACK_COL_45")
    private Double backCol45;

    /**
     * 备用字段46
     */
    @TableField(value = "BACK_COL_46")
    private String backCol46;

    /**
     * 备用字段47
     */
    @TableField(value = "BACK_COL_47")
    private String backCol47;

    /**
     * (已经启用)一次性工单标识
     */
    @TableField(value = "BACK_COL_48")
    private String backCol48;

    /**
     * 电机结算单号
     */
    @TableField(value = "BAG_ID")
    private String bagId;

    /**
     * 总费用单价（计算用）
     */
    @TableField(value = "GLOBAL_TOTAL_FEE")
    private Double globalTotalFee;

    /**
     * 租户编号
     */
    @TableField(value = "TENANT_ID")
    private Long tenantId; // 对应bigint类型，默认值0

    /**
     * 序列化版本号
     */
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
