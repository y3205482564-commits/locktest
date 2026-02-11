package cn.iocoder.yudao.module.digitalCard.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.extra.spring.SpringUtil;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.digitalCard.model.dto.card.OperationTagRecordPageReqVO;
import cn.iocoder.yudao.module.digitalCard.model.dto.card.OperationTagRecordRespVO;
import cn.iocoder.yudao.module.digitalCard.model.dto.card.OperationTagRecordSaveReqVO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import cn.iocoder.yudao.module.digitalCard.domain.OperationTagRecord;
import cn.iocoder.yudao.module.digitalCard.service.OperationTagRecordService;
import cn.iocoder.yudao.module.digitalCard.mapper.OperationTagRecordMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import javax.annotation.Resource;
import java.util.*;
import java.util.stream.Collectors;

import static cn.iocoder.yudao.framework.common.exception.util.ServiceExceptionUtil.exception;
import static cn.iocoder.yudao.framework.common.util.collection.CollectionUtils.convertList;
import static cn.iocoder.yudao.framework.common.util.collection.CollectionUtils.convertMap;
import static cn.iocoder.yudao.module.system.enums.ErrorCodeConstants.OPERATION_TAG_RECORD_ERROR;
import static cn.iocoder.yudao.module.system.enums.ErrorCodeConstants.ROLE_NOT_EXISTS;

/**
 * @author 鹏
 * @description 针对表【operation_tag_record(操作牌领用归还记录表)】的数据库操作Service实现
 * @createDate 2026-01-23 09:05:42
 */
@Slf4j
@Service
@Validated
public class OperationTagRecordServiceImpl extends ServiceImpl<OperationTagRecordMapper, OperationTagRecord>
        implements OperationTagRecordService {

    // 缓存key常量（需根据项目实际缓存配置调整）
    private static final String REDIS_KEY = "digitalCard:operationTagRecord:";

    @Resource
    private OperationTagRecordMapper operationTagRecordMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    // 可根据项目日志注解规范添加操作日志
    // @LogRecord(type = OPERATION_TAG_RECORD_TYPE, subType = CREATE_SUB_TYPE, bizNo = "{{#record.id}}", success = CREATE_SUCCESS)
    public Long createOperationTagRecord(OperationTagRecordSaveReqVO createReqVO) {
        // 1. 业务校验
        validateCreateRecord(createReqVO);

        // 2. 转换为DO对象
        OperationTagRecord record = BeanUtils.toBean(createReqVO, OperationTagRecord.class);
        // 设置默认值
        record.setStatus(ObjectUtil.defaultIfNull(createReqVO.getStatus(), 1)); // 默认状态：已领用未归还
        record.setCreateTime(new Date());
        record.setUpdateTime(new Date());
        record.setDeleted(false); // 默认未删除
        // 租户ID可根据项目的租户上下文获取，示例：record.setTenantId(TenantContextHolder.getTenantId());

        // 3. 插入数据库
        operationTagRecordMapper.insert(record);

        // 4. 记录日志上下文（如果使用日志注解）
        // LogRecordContext.putVariable("record", record);
        return record.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = REDIS_KEY, key = "#updateReqVO.id")
    // @LogRecord(type = OPERATION_TAG_RECORD_TYPE, subType = UPDATE_SUB_TYPE, bizNo = "{{#updateReqVO.id}}", success = UPDATE_SUCCESS)
    public void updateOperationTagRecord(OperationTagRecordSaveReqVO updateReqVO) {
        // 1. 校验记录是否可更新
        OperationTagRecord oldRecord = validateRecordForUpdate(updateReqVO.getId());

        // 2. 业务校验（例如已归还/作废的记录不允许修改核心字段）
        validateUpdateRecord(updateReqVO, oldRecord);

        // 3. 转换为更新对象
        OperationTagRecord updateObj = BeanUtils.toBean(updateReqVO, OperationTagRecord.class);
        updateObj.setUpdateTime(new Date()); // 更新时间

        // 4. 执行更新
        operationTagRecordMapper.updateById(updateObj);

        // 5. 日志上下文（如有需要）
        // LogRecordContext.putVariable(DiffParseFunction.OLD_OBJECT, BeanUtils.toBean(oldRecord, OperationTagRecordSaveReqVO.class));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = REDIS_KEY, key = "#id")
    // @LogRecord(type = OPERATION_TAG_RECORD_TYPE, subType = DELETE_SUB_TYPE, bizNo = "{{#id}}", success = DELETE_SUCCESS)
    public void deleteOperationTagRecord(Long id) {
        // 1. 校验记录是否可删除
        OperationTagRecord record = validateRecordForUpdate(id);

        // 2. 逻辑删除（而非物理删除）
        OperationTagRecord deleteObj = new OperationTagRecord();
        deleteObj.setId(id);
        deleteObj.setDeleted(true);
        deleteObj.setUpdateTime(new Date());
        operationTagRecordMapper.updateById(deleteObj);

        // 3. 日志上下文
        // LogRecordContext.putVariable("record", record);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteOperationTagRecordList(List<Long> ids) {
        if (CollectionUtil.isEmpty(ids)) {
            return;
        }

        // 1. 批量校验
        ids.forEach(this::validateRecordForUpdate);

        // 2. 批量逻辑删除
        List<OperationTagRecord> deleteList = ids.stream().map(id -> {
            OperationTagRecord deleteObj = new OperationTagRecord();
            deleteObj.setId(id);
            deleteObj.setDeleted(true);
            deleteObj.setUpdateTime(new Date());
            return deleteObj;
        }).collect(Collectors.toList());

        // 批量更新（推荐使用mybatis-plus的批量更新，或自定义批量SQL）
        this.updateBatchById(deleteList);
    }


    @Override
    @Transactional(rollbackFor = Exception.class)
    public void invalidOperationTagRecord(Long id, String remark) {
        // 1. 校验记录
        OperationTagRecord record = validateRecordForUpdate(id);
        // 已作废的记录无需重复操作
        if (record.getStatus().equals(3)) {
            return;
        }

        // 2. 更新为作废状态
        OperationTagRecord updateObj = new OperationTagRecord();
        updateObj.setId(id);
        updateObj.setStatus(3); // 作废状态
        updateObj.setRemark(StrUtil.isNotBlank(remark) ? remark : record.getRemark()); // 补充作废备注
        updateObj.setUpdateTime(new Date());
        operationTagRecordMapper.updateById(updateObj);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void completeReturn(Long id, String returnPerson, String returnInspector, String returnOperator, String remark) {
        // 1. 校验记录
        OperationTagRecord record = validateRecordForUpdate(id);
        // 校验状态：只能对已领用未归还的记录进行归还操作
        if (!record.getStatus().equals(1)) {
            throw exception(OPERATION_TAG_RECORD_ERROR);
        }

        // 2. 构建归还更新对象
        OperationTagRecord updateObj = new OperationTagRecord();
        updateObj.setId(id);
        updateObj.setReturnPerson(returnPerson);
        updateObj.setReturnInspector(returnInspector);
        updateObj.setReturnOperator(returnOperator);
        updateObj.setReturnTime(new Date()); // 归还时间
        updateObj.setStatus(2); // 已归还状态
        updateObj.setRemark(StrUtil.isNotBlank(remark) ? remark : record.getRemark());
        updateObj.setUpdateTime(new Date());

        // 3. 执行更新
        operationTagRecordMapper.updateById(updateObj);
    }

    @Override
    public OperationTagRecord getOperationTagRecord(Long id) {
        return operationTagRecordMapper.selectById(id);
    }

    @Override
    @Cacheable(value = REDIS_KEY, key = "#id", unless = "#result == null")
    public OperationTagRecord getOperationTagRecordFromCache(Long id) {
        return operationTagRecordMapper.selectById(id);
    }

    @Override
    public List<OperationTagRecord> getOperationTagRecordList(Collection<Long> ids) {
        if (CollectionUtil.isEmpty(ids)) {
            return Collections.emptyList();
        }
        return operationTagRecordMapper.selectBatchIds(ids);
    }

    @Override
    public List<OperationTagRecord> getOperationTagRecordListFromCache(Collection<Long> ids) {
        if (CollectionUtil.isEmpty(ids)) {
            return Collections.emptyList();
        }
        // 批量从缓存获取（解决Spring Cache无法批量获取的问题）
        OperationTagRecordServiceImpl self = getSelf();
        return convertList(ids, self::getOperationTagRecordFromCache);
    }

    @Override
    public List<OperationTagRecord> getOperationTagRecordListByStatus(Collection<Integer> statuses) {
        if (CollectionUtil.isEmpty(statuses)) {
            return Collections.emptyList();
        }
        LambdaQueryWrapper<OperationTagRecord> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.in(OperationTagRecord::getStatus, statuses)
                .eq(OperationTagRecord::getDeleted, false); // 过滤已删除的记录
        return operationTagRecordMapper.selectList(queryWrapper);
    }

    @Override
    public List<OperationTagRecord> getOperationTagRecordListByTagId(Long tagId, Collection<Integer> statuses) {
        if (tagId == null) {
            return Collections.emptyList();
        }
        LambdaQueryWrapper<OperationTagRecord> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(OperationTagRecord::getTagId, tagId)
                .eq(OperationTagRecord::getDeleted, false);
        // 可选状态筛选
        if (CollectionUtil.isNotEmpty(statuses)) {
            queryWrapper.in(OperationTagRecord::getStatus, statuses);
        }
        // 按领用时间倒序
        queryWrapper.orderByDesc(OperationTagRecord::getUseTime);
        return operationTagRecordMapper.selectList(queryWrapper);
    }

    @Override
    public List<OperationTagRecord> getOperationTagRecordListByStationRoomId(Long stationRoomId, Collection<Integer> statuses) {
        if (stationRoomId == null) {
            return Collections.emptyList();
        }
        LambdaQueryWrapper<OperationTagRecord> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(OperationTagRecord::getStationRoomId, stationRoomId)
                .eq(OperationTagRecord::getDeleted, false);
        // 可选状态筛选
        if (CollectionUtil.isNotEmpty(statuses)) {
            queryWrapper.in(OperationTagRecord::getStatus, statuses);
        }
        // 按领用时间倒序
        queryWrapper.orderByDesc(OperationTagRecord::getUseTime);
        return operationTagRecordMapper.selectList(queryWrapper);
    }

    @Override
    public List<OperationTagRecord> getOperationTagRecordList() {
        LambdaQueryWrapper<OperationTagRecord> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(OperationTagRecord::getDeleted, false)
                .orderByDesc(OperationTagRecord::getCreateTime);
        return operationTagRecordMapper.selectList(queryWrapper);
    }

    @Override
    public PageResult<OperationTagRecord> getOperationTagRecordPage(OperationTagRecordPageReqVO reqVO) {
        // 1. 构建分页条件
        Page<OperationTagRecord> page = new Page<>(reqVO.getPageNo(), reqVO.getPageSize());
        // 2. 构建查询条件
        LambdaQueryWrapper<OperationTagRecord> queryWrapper = buildQueryWrapper(reqVO);
        // 3. 执行分页查询
        IPage<OperationTagRecord> iPage = operationTagRecordMapper.selectPage(page, queryWrapper);
        // 4. 转换为PageResult（适配项目分页返回格式）
        return new PageResult<>(iPage.getRecords(), iPage.getTotal());
    }

    @Override
    public void validateOperationTagRecordList(Collection<Long> ids) {
        if (CollectionUtil.isEmpty(ids)) {
            return;
        }
        // 1. 查询记录列表
        List<OperationTagRecord> records = operationTagRecordMapper.selectBatchIds(ids);
        Map<Long, OperationTagRecord> recordMap = convertMap(records, OperationTagRecord::getId);

        // 2. 逐个校验
        ids.forEach(id -> {
            OperationTagRecord record = recordMap.get(id);
            // 校验1：记录不存在
            if (record == null) {
                throw exception(OPERATION_TAG_RECORD_ERROR); // 替换为项目实际异常类
            }
            // 校验2：记录已删除
            if (record.getDeleted()) {
                throw exception(OPERATION_TAG_RECORD_ERROR);
            }
            // 校验3：记录已作废
            if (record.getStatus().equals(3)) {
                throw exception(OPERATION_TAG_RECORD_ERROR);
            }
        });
    }


    // 查询属于tagId的status为（1=已领用未归还）的领用记录
    /**
     * 根据tagId查询所有状态为1（已领用未归还）的领用记录列表
     * @param tagId 操作牌ID
     * @return 领用记录VO列表
     */
    @Override
    public List<OperationTagRecordRespVO> getOperationTagRecordByTagId(Long tagId) {
        // 空值校验
        if (tagId == null) {
            // 返回空列表而非null，避免前端处理NPE
            return Collections.emptyList();
        }

        // 构建查询条件
        LambdaQueryWrapper<OperationTagRecord> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(OperationTagRecord::getTagId, tagId)
                .eq(OperationTagRecord::getStatus, 1) // 仅查询已领用未归还的记录
                .eq(OperationTagRecord::getDeleted, false) // 未删除的记录
                .orderByAsc(OperationTagRecord::getUseTime); // 按领用时间升序

        // 查询多条记录（改为selectList）
        List<OperationTagRecord> recordList = operationTagRecordMapper.selectList(queryWrapper);

        // 转换为VO列表（批量拷贝）
        return recordList.stream()
                .map(record -> BeanUtil.copyProperties(record, OperationTagRecordRespVO.class))
                .collect(Collectors.toList());
    }


    @Override
    public boolean isTagInUse(Long tagId) {
        if (tagId == null) {
            return false;
        }
        LambdaQueryWrapper<OperationTagRecord> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(OperationTagRecord::getTagId, tagId)
                .eq(OperationTagRecord::getStatus, 1) // 已领用未归还
                .eq(OperationTagRecord::getDeleted, false);
        // 存在未归还记录则返回true
        return operationTagRecordMapper.selectCount(queryWrapper) > 0;
    }

    // ==================== 私有辅助方法 ====================

    /**
     * 构建分页查询条件
     */
    private LambdaQueryWrapper<OperationTagRecord> buildQueryWrapper(OperationTagRecordPageReqVO reqVO) {
        LambdaQueryWrapper<OperationTagRecord> queryWrapper = new LambdaQueryWrapper<>();
        // 基础过滤：未删除
        queryWrapper.eq(OperationTagRecord::getDeleted, false);
        // 条件1：操作牌ID
        if (reqVO.getTagId() != null) {
            queryWrapper.eq(OperationTagRecord::getTagId, reqVO.getTagId());
        }
        // 条件2：站室ID
        if (reqVO.getStationRoomId() != null) {
            queryWrapper.eq(OperationTagRecord::getStationRoomId, reqVO.getStationRoomId());
        }
        // 条件3：领用单位
        if (StrUtil.isNotBlank(reqVO.getUseUnit())) {
            queryWrapper.like(OperationTagRecord::getUseUnit, reqVO.getUseUnit());
        }
        // 条件4：领用人
        if (StrUtil.isNotBlank(reqVO.getUsePerson())) {
            queryWrapper.like(OperationTagRecord::getUsePerson, reqVO.getUsePerson());
        }
        // 条件5：状态
        if (reqVO.getStatus() != null) {
            queryWrapper.eq(OperationTagRecord::getStatus, reqVO.getStatus());
        }
        // 条件6：领用时间范围
        if (reqVO.getUseTimeStart() != null) {
            queryWrapper.ge(OperationTagRecord::getUseTime, reqVO.getUseTimeStart());
        }
        if (reqVO.getUseTimeEnd() != null) {
            queryWrapper.le(OperationTagRecord::getUseTime, reqVO.getUseTimeEnd());
        }
        // 条件7：租户ID（多租户隔离）
        if (reqVO.getTenantId() != null) {
            queryWrapper.eq(OperationTagRecord::getTenantId, reqVO.getTenantId());
        }
        // 排序：创建时间倒序
        queryWrapper.orderByDesc(OperationTagRecord::getCreateTime);
        return queryWrapper;
    }

    /**
     * 校验创建记录的业务规则
     */
    private void validateCreateRecord(OperationTagRecordSaveReqVO createReqVO) {
        // 1. 校验操作牌是否已被领用未归还
        if (isTagInUse(createReqVO.getTagId())) {
            throw exception(OPERATION_TAG_RECORD_ERROR);
        }
        // 2. 必传参数校验（也可通过VO的JSR303注解，此处做业务级校验）
        if (createReqVO.getTagId() == null) {
            throw exception(OPERATION_TAG_RECORD_ERROR);
        }
        if (createReqVO.getStationRoomId() == null) {
            throw exception(OPERATION_TAG_RECORD_ERROR);
        }
    }

    /**
     * 校验更新记录的业务规则
     */
    private void validateUpdateRecord(OperationTagRecordSaveReqVO updateReqVO, OperationTagRecord oldRecord) {
        // 1. 已归还的记录不允许修改核心字段
        if (oldRecord.getStatus().equals(2)) {
            // 可修改的字段白名单（仅允许修改备注等非核心字段）
            Set<String> allowFields = new HashSet<>(Arrays.asList("remark", "updater"));
            // 此处可通过反射对比新旧字段，校验是否修改了非白名单字段，示例：
            // if (hasModifyForbiddenFields(updateReqVO, oldRecord, allowFields)) {
            //     throw new BusinessException("已归还的记录不允许修改核心字段");
            // }
        }
        // 2. 已作废的记录不允许修改
        if (oldRecord.getStatus().equals(3)) {
            throw exception(OPERATION_TAG_RECORD_ERROR);
        }
        // 3. 如果修改了操作牌ID，校验新操作牌是否已被领用
        if (updateReqVO.getTagId() != null && !updateReqVO.getTagId().equals(oldRecord.getTagId())) {
            if (isTagInUse(updateReqVO.getTagId())) {
                throw exception(OPERATION_TAG_RECORD_ERROR);
            }
        }
    }

    /**
     * 校验记录是否可更新/删除
     */
    private OperationTagRecord validateRecordForUpdate(Long id) {
        if (id == null) {
            throw exception(OPERATION_TAG_RECORD_ERROR);
        }
        // 1. 查询记录
        OperationTagRecord record = operationTagRecordMapper.selectById(id);
        if (record == null) {
            throw exception(OPERATION_TAG_RECORD_ERROR);
        }
        // 2. 校验是否已删除
        if (record.getDeleted()) {
            throw exception(OPERATION_TAG_RECORD_ERROR);
        }
        return record;
    }

    /**
     * 获得自身代理对象，解决AOP缓存等失效问题
     */
    private OperationTagRecordServiceImpl getSelf() {
        return SpringUtil.getBean(getClass());
    }
}




