package cn.iocoder.yudao.module.digitalCard.model.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 电量更新请求 VO
 */
@Schema(description = "管理后台 - 电量更新请求 VO")
@Data
public class ElectQuantityReqVO {

    @Schema(description = "设备ID", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
    private String bluetoothId;

    @Schema(description = "电量", requiredMode = Schema.RequiredMode.REQUIRED, example = "80")
    private Integer electQuantity;
}

