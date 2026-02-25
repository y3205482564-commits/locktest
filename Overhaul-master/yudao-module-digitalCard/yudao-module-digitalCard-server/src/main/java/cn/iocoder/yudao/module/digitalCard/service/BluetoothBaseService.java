package cn.iocoder.yudao.module.digitalCard.service;

import cn.iocoder.yudao.module.digitalCard.model.vo.BluetoothBaseInfoVO;
import cn.iocoder.yudao.module.digitalCard.model.vo.ElectQuantityReqVO;
import cn.iocoder.yudao.module.digitalCard.model.vo.UseRecordReqVO;

/**
 * 蓝牙设备服务接口
 */
public interface BluetoothBaseService {

    /**
     * 获取设备信息
     *
     * @param id 设备ID
     * @return 设备信息
     */
    BluetoothBaseInfoVO getBluetoothBaseInfo(String id);

    /**
     * 添加使用记录
     *
     * @param reqVO 使用记录请求VO
     */
    void addUseRecords(UseRecordReqVO reqVO);

    /**
     * 更新电量
     *
     * @param reqVO 电量更新请求VO
     */
    void updateElectQuantity(ElectQuantityReqVO reqVO);
}

