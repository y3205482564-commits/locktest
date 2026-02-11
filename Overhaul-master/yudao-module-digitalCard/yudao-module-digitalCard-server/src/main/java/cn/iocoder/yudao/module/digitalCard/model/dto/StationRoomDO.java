package cn.iocoder.yudao.module.digitalCard.model.dto;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.util.Date;
import java.util.List;

/**
 * 站室 DO
 * 对应数据库表：station_room
 * 适配层级：1级=首钢京唐公司xx事业部、2级=归属区域、3级=站室名称
 *
 * @author 自定义作者名
 */
@Data
@TableName(value = "station_room", autoResultMap = true) // autoResultMap 支持复杂类型映射
public class StationRoomDO {

    // ========== 核心常量定义 ==========
    /**
     * 根节点父ID（1级站室/事业部的父ID）
     */
    public static final Long PARENT_ID_ROOT = 0L;

    // ========== 数据库字段映射 ==========
    /**
     * 站室ID（主键、自增）
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 站室名称
     * 1级：首钢京唐公司xx事业部（如首钢京唐公司中厚板事业部）
     * 2级：归属区域（如区域1、南区操作区）
     * 3级：站室名称（如中控室、操作站）
     */
    @TableField("name")
    private String name;

    /**
     * 上级站室ID
     * - 1级站室（事业部）：parentId = PARENT_ID_ROOT（0）
     * - 2级站室（区域）：parentId = 对应1级事业部ID
     * - 3级站室（具体站室）：parentId = 对应2级区域ID
     */
    @TableField("parent_id")
    private Long parentId;

    /**
     * 显示顺序（同层级内排序）
     * 例如：同一事业部下的多个区域按sort升序展示
     */
    @TableField("sort")
    private Integer sort;

    /**
     * 负责人用户ID
     * 关联sys_user表的id字段
     */
    @TableField("leader_user_id")
    private Long leaderUserId;

    /**
     * 联系电话
     * 长度限制：11位
     */
    @TableField("phone")
    private String phone;

    /**
     * 邮箱
     * 长度限制：50位
     */
    @TableField("email")
    private String email;

    /**
     * 站室状态
     * 0：正常
     * 1：停用
     */
    @TableField("status")
    private Integer status;

    /**
     * 创建者
     * 存储创建人账号/姓名，长度64位
     */
    @TableField(value = "creator", fill = FieldFill.INSERT) // 插入时自动填充
    private String creator;

    /**
     * 创建时间
     * 默认值：CURRENT_TIMESTAMP
     */
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private Date createTime;

    /**
     * 更新者
     * 存储更新人账号/姓名，长度64位
     */
    @TableField(value = "updater", fill = FieldFill.INSERT_UPDATE) // 插入/更新时自动填充
    private String updater;

    /**
     * 更新时间
     * 默认值：CURRENT_TIMESTAMP，更新时自动刷新
     */
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private Date updateTime;

    /**
     * 是否删除（软删除）
     * false：未删除（默认值 b'0'）
     * true：已删除
     */
    @TableLogic // MyBatis-Plus软删除注解
    @TableField("deleted")
    private Boolean deleted;

    /**
     * 租户编号
     * 适配多租户场景，默认值0
     */
    @TableField("tenant_id")
    private Long tenantId;

    // ========== 非数据库字段（可选） ==========
    /**
     * 子站室列表（用于树形结构组装，非数据库字段）
     */
    @TableField(exist = false)
    private List<StationRoomDO> children;

}
