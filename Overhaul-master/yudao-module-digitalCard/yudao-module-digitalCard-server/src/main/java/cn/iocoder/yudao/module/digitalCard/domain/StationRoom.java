package cn.iocoder.yudao.module.digitalCard.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * 首钢京唐公司站室表（多级层级：事业部→归属区域→站室）
 * @TableName station_room
 */
@TableName(value ="station_room")
@Data
public class StationRoom implements Serializable {
    /**
     * 站室id（唯一标识）
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 站室名称（1级：首钢京唐公司xx事业部、2级：归属区域、3级：站室名称）
     */
    private String name;

    /**
     * 上级站室id（1级事业部父ID为0；2级归属区域父ID对应1级事业部ID；3级站室父ID对应2级归属区域ID）
     */
    private Long parentId;

    /**
     * 站室显示顺序（同层级内排序）
     */
    private Integer sort;

    /**
     * 站室负责人ID
     */
    private Long leaderUserId;

    /**
     * 站室联系电话
     */
    private String phone;

    /**
     * 站室邮箱
     */
    private String email;

    /**
     * 站室状态（0正常 1停用）
     */
    private Integer status;

    /**
     * 站室创建者
     */
    private String creator;

    /**
     * 站室创建时间
     */
    private Date createTime;

    /**
     * 站室更新者
     */
    private String updater;

    /**
     * 站室更新时间（自动更新）
     */
    private Date updateTime;

    /**
     * 站室是否删除（0未删除 1已删除）
     */
    private Boolean deleted;

    /**
     * 租户编号（适配多租户场景下的站室隔离）
     */
    private Long tenantId;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
