package cn.iocoder.yudao.module.digitalCard.model.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 蓝牙设备信息 VO
 */
@Schema(description = "管理后台 - 蓝牙设备信息 VO")
@Data
public class BluetoothBaseInfoVO {

    @Schema(description = "设备ID", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
    private String id;

    @Schema(description = "锁具编号", example = "LOCK001")
    private String lockNum;

    @Schema(description = "MAC地址", example = "AA:BB:CC:DD:EE:FF")
    private String mac;

    @Schema(description = "锁类型（0/2/3）", example = "0")
    private String blueType;

    @Schema(description = "密码")
    private String password;

    @Schema(description = "密钥")
    private String secretKey;

    @Schema(description = "使用次数", example = "10")
    private Integer useCount;

    @Schema(description = "上次使用人", example = "admin")
    private String lastUser;

    @Schema(description = "上次使用时间", example = "2024-01-01 12:00:00")
    private String lastUseTime;

    @Schema(description = "是否有关锁功能（0/1）", example = "1")
    private String isInstructClosed;

    @Schema(description = "是否需要答题（0/1）", example = "0")
    private String answerQuestion;

    @Schema(description = "电量", example = "80")
    private Integer electQuantity;
}

