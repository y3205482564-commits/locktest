package cn.iocoder.yudao.module.digitalCard.service.impl;

import cn.iocoder.yudao.framework.security.core.util.SecurityFrameworkUtils;
import cn.iocoder.yudao.module.digitalCard.domain.BluetoothBase;
import cn.iocoder.yudao.module.digitalCard.domain.UseRecords;
import cn.iocoder.yudao.module.digitalCard.mapper.BluetoothBaseMapper;
import cn.iocoder.yudao.module.digitalCard.mapper.UseRecordsMapper;
import cn.iocoder.yudao.module.digitalCard.model.vo.BluetoothBaseInfoVO;
import cn.iocoder.yudao.module.digitalCard.model.vo.ElectQuantityReqVO;
import cn.iocoder.yudao.module.digitalCard.model.vo.UseRecordReqVO;
import cn.iocoder.yudao.module.digitalCard.service.BluetoothBaseService;
import cn.iocoder.yudao.module.system.api.user.AdminUserApi;
import cn.iocoder.yudao.module.system.api.user.dto.AdminUserRespDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 蓝牙设备服务实现类
 */
@Slf4j
@Service
public class BluetoothBaseServiceImpl implements BluetoothBaseService {

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Autowired
    private BluetoothBaseMapper bluetoothBaseMapper;

    @Autowired
    private UseRecordsMapper useRecordsMapper;

    @Autowired
    private AdminUserApi adminUserApi;

    @Override
    public BluetoothBaseInfoVO getBluetoothBaseInfo(String id) {
        BluetoothBase bluetoothBase = bluetoothBaseMapper.selectById(id);
        if (bluetoothBase == null) {
            return null;
        }

        BluetoothBaseInfoVO vo = new BluetoothBaseInfoVO();
        BeanUtils.copyProperties(bluetoothBase, vo);

        // 转换时间格式
        if (bluetoothBase.getLastUseTime() != null) {
            vo.setLastUseTime(bluetoothBase.getLastUseTime().format(DATE_TIME_FORMATTER));
        }

        return vo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addUseRecords(UseRecordReqVO reqVO) {
        // 获取当前登录用户ID（如果前端没有传递，则使用当前登录用户）
        Long userId = null;
        if (reqVO.getUserId() != null && !reqVO.getUserId().trim().isEmpty()) {
            try {
                userId = Long.parseLong(reqVO.getUserId());
            }
            catch (NumberFormatException e) {
                log.warn("用户ID格式错误: {}", reqVO.getUserId());
            }
        }

        // 如果前端没有传递用户ID，则使用当前登录用户ID
        if (userId == null) {
            userId = SecurityFrameworkUtils.getLoginUserId();
        }

        if (userId == null) {
            throw new IllegalArgumentException("用户ID不能为空");
        }

        // 通过用户ID查询用户信息，获取用户名（使用 nickname，如果没有则使用用户ID）
        String username = String.valueOf(userId);
        try {
            AdminUserRespDTO user = adminUserApi.getUser(userId).getCheckedData();
            if (user != null && user.getNickname() != null && !user.getNickname().trim().isEmpty()) {
                username = user.getNickname();
            }
        }
        catch (Exception e) {
            log.warn("获取用户信息失败，使用用户ID作为用户名: userId={}, error={}", userId, e.getMessage());
        }

        // 创建使用记录
        UseRecords useRecord = new UseRecords();
        useRecord.setBluetoothId(reqVO.getBluetoothId());
        useRecord.setUserId(userId);
        useRecord.setLockStatus(reqVO.getLockStatus());
        useRecord.setCreateTime(LocalDateTime.now());
        useRecordsMapper.insert(useRecord);

        // 更新设备信息
        BluetoothBase bluetoothBase = bluetoothBaseMapper.selectById(reqVO.getBluetoothId());
        if (bluetoothBase != null) {
            bluetoothBase.setUseCount((bluetoothBase.getUseCount() == null ? 0 : bluetoothBase.getUseCount()) + 1);
            // 存储用户名而非用户ID
            bluetoothBase.setLastUser(username);
            bluetoothBase.setLastUseTime(LocalDateTime.now());
            bluetoothBaseMapper.updateById(bluetoothBase);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateElectQuantity(ElectQuantityReqVO reqVO) {
        String deviceId = reqVO.getBluetoothId();
        if (deviceId == null || deviceId.trim().isEmpty()) {
            throw new IllegalArgumentException("设备ID不能为空");
        }

        if (reqVO.getElectQuantity() == null) {
            throw new IllegalArgumentException("电量不能为空");
        }

        BluetoothBase bluetoothBase = bluetoothBaseMapper.selectById(deviceId);
        if (bluetoothBase != null) {
            bluetoothBase.setElectQuantity(reqVO.getElectQuantity());
            bluetoothBaseMapper.updateById(bluetoothBase);
        }
    }
}

