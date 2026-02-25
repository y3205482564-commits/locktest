package cn.iocoder.yudao.module.digitalCard.model.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 使用记录请求 VO
 */
@Schema(description = "管理后台 - 使用记录请求 VO")
@Data
public class UseRecordReqVO {

    @Schema(description = "设备ID", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
    private String bluetoothId;

    @Schema(description = "用户ID", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
    private String userId;

    @Schema(description = "锁状态（1=开锁，0=关锁）", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
    private Integer lockStatus;
}

