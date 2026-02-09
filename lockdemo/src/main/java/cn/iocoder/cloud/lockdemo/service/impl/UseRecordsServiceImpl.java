package cn.iocoder.cloud.lockdemo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import cn.iocoder.cloud.lockdemo.entity.UseRecords;
import cn.iocoder.cloud.lockdemo.service.UseRecordsService;
import cn.iocoder.cloud.lockdemo.mapper.UseRecordsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
* @author 32054
* @description 针对表【use_records(锁使用记录表)】的数据库操作Service实现
* @createDate 2026-02-09 14:14:30
*/
@Service
public class UseRecordsServiceImpl extends ServiceImpl<UseRecordsMapper, UseRecords>
    implements UseRecordsService{



}




