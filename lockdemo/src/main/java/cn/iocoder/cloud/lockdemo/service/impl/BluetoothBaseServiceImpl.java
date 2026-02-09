package cn.iocoder.cloud.lockdemo.service.impl;

import cn.iocoder.cloud.lockdemo.dto.BluetoothBaseInfoDTO;
import cn.iocoder.cloud.lockdemo.dto.ElectQuantityDTO;
import cn.iocoder.cloud.lockdemo.dto.UseRecordDTO;
import cn.iocoder.cloud.lockdemo.entity.BluetoothBase;
import cn.iocoder.cloud.lockdemo.entity.UseRecords;
import cn.iocoder.cloud.lockdemo.mapper.BluetoothBaseMapper;
import cn.iocoder.cloud.lockdemo.mapper.UseRecordsMapper;
import cn.iocoder.cloud.lockdemo.service.BluetoothBaseService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

/**
 * 蓝牙设备服务实现类
 */
@Service
public class BluetoothBaseServiceImpl implements BluetoothBaseService {
    
    @Autowired
    private BluetoothBaseMapper bluetoothBaseMapper;
    
    @Autowired
    private UseRecordsMapper useRecordsMapper;

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    @Override
    public BluetoothBaseInfoDTO getBluetoothBaseInfo(String id) {
        BluetoothBase bluetoothBase = bluetoothBaseMapper.selectById(id);
        if (bluetoothBase == null) {
            return null;
        }
        
        BluetoothBaseInfoDTO dto = new BluetoothBaseInfoDTO();
        BeanUtils.copyProperties(bluetoothBase, dto);
        
        // 转换时间格式
        if (bluetoothBase.getLastUseTime() != null) {
            dto.setLastUseTime(bluetoothBase.getLastUseTime().format(DATE_TIME_FORMATTER));
        }
        
        return dto;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addUseRecords(UseRecordDTO dto) {
        // 创建使用记录
        UseRecords useRecord = new UseRecords();
        useRecord.setBluetooth_id(dto.getBluetoothId());
        useRecord.setUser_id(dto.getUserId());
        useRecord.setLock_status(dto.getLockStatus());
        useRecord.setCreate_time(new Date());
        useRecordsMapper.insert(useRecord);
        
        // 更新设备信息
        BluetoothBase bluetoothBase = bluetoothBaseMapper.selectById(dto.getBluetoothId());
        if (bluetoothBase != null) {
            bluetoothBase.setUseCount((bluetoothBase.getUseCount() == null ? 0 : bluetoothBase.getUseCount()) + 1);
            bluetoothBase.setLastUser(dto.getUserId());
            bluetoothBase.setLastUseTime(LocalDateTime.now());
            bluetoothBaseMapper.updateById(bluetoothBase);
        }
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateElectQuantity(ElectQuantityDTO dto) {
        // 支持 id 和 bluetoothId 两种字段名
        String deviceId = dto.getId() != null ? dto.getId() : dto.getBluetoothId();
        if (deviceId == null || deviceId.trim().isEmpty()) {
            throw new IllegalArgumentException("设备ID不能为空");
        }
        
        BluetoothBase bluetoothBase = bluetoothBaseMapper.selectById(deviceId);
        if (bluetoothBase != null) {
            bluetoothBase.setElectQuantity(dto.getElectQuantity());
            bluetoothBaseMapper.updateById(bluetoothBase);
        }
    }
}

