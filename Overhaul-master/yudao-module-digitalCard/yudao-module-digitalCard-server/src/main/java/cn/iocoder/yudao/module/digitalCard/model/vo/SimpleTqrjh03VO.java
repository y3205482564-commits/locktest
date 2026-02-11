package cn.iocoder.yudao.module.digitalCard.model.vo;

import lombok.Data;

/**
 * @author 鹏
 * @version 1.0
 * @description: TODO
 * @date 2026/1/13 18:53
 */
@Data
public class SimpleTqrjh03VO {

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
}
