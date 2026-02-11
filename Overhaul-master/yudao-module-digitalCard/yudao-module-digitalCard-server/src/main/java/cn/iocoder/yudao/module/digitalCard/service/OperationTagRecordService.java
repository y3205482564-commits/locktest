package cn.iocoder.yudao.module.digitalCard.service;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.digitalCard.domain.OperationTagRecord;
import cn.iocoder.yudao.module.digitalCard.model.dto.card.OperationTagRecordPageReqVO;
import cn.iocoder.yudao.module.digitalCard.model.dto.card.OperationTagRecordRespVO;
import cn.iocoder.yudao.module.digitalCard.model.dto.card.OperationTagRecordSaveReqVO;
import com.baomidou.mybatisplus.extension.service.IService;
import org.springframework.web.bind.annotation.RequestParam;

import javax.validation.Valid;
import java.util.Collection;
import java.util.List;

/**
 * @author 鹏
 * @description 针对表【operation_tag_record(操作牌领用归还记录表)】的数据库操作Service
 * @createDate 2026-01-23 09:05:42
 */
public interface OperationTagRecordService extends IService<OperationTagRecord> {

    /**
     * 创建操作牌领用归还记录
     *
     * @param createReqVO 创建记录信息
     * @return 记录编号
     */
    Long createOperationTagRecord(@Valid OperationTagRecordSaveReqVO createReqVO);

    /**
     * 更新操作牌领用归还记录
     *
     * @param updateReqVO 更新记录信息
     */
    void updateOperationTagRecord(@Valid OperationTagRecordSaveReqVO updateReqVO);

    /**
     * 删除操作牌领用归还记录
     *
     * @param id 记录编号
     */
    void deleteOperationTagRecord(Long id);

    /**
     * 批量删除操作牌领用归还记录
     *
     * @param ids 记录编号数组
     */
    void deleteOperationTagRecordList(List<Long> ids);

    /**
     * 作废操作牌领用归还记录（业务逻辑删除，非物理删除）
     *
     * @param id     记录编号
     * @param remark 作废备注
     */
    void invalidOperationTagRecord(Long id, String remark);

    /**
     * 完成操作牌归还操作
     *
     * @param id              记录编号
     * @param returnPerson    归还人
     * @param returnInspector 归还点检人员
     * @param returnOperator  归还操作人员
     * @param remark          归还备注
     */
    void completeReturn(Long id, String returnPerson, String returnInspector, String returnOperator, String remark);

    /**
     * 获得操作牌领用归还记录
     *
     * @param id 记录编号
     * @return 操作牌领用归还记录
     */
    OperationTagRecord getOperationTagRecord(Long id);

    /**
     * 从缓存中获得操作牌领用归还记录
     *
     * @param id 记录编号
     * @return 操作牌领用归还记录
     */
    OperationTagRecord getOperationTagRecordFromCache(Long id);

    /**
     * 获得操作牌领用归还记录列表
     *
     * @param ids 记录编号数组
     * @return 操作牌领用归还记录列表
     */
    List<OperationTagRecord> getOperationTagRecordList(Collection<Long> ids);

    /**
     * 从缓存中获得操作牌领用归还记录列表
     *
     * @param ids 记录编号数组
     * @return 操作牌领用归还记录列表
     */
    List<OperationTagRecord> getOperationTagRecordListFromCache(Collection<Long> ids);

    /**
     * 根据状态筛选操作牌领用归还记录列表
     *
     * @param statuses 筛选的状态（1=已领用未归还 2=已归还 3=作废）
     * @return 操作牌领用归还记录列表
     */
    List<OperationTagRecord> getOperationTagRecordListByStatus(Collection<Integer> statuses);

    /**
     * 根据操作牌ID获取其领用归还记录列表
     *
     * @param tagId    操作牌ID
     * @param statuses 筛选的状态（可选）
     * @return 操作牌领用归还记录列表
     */
    List<OperationTagRecord> getOperationTagRecordListByTagId(Long tagId, Collection<Integer> statuses);

    /**
     * 根据站室ID获取操作牌领用归还记录列表
     *
     * @param stationRoomId 站室ID
     * @param statuses      筛选的状态（可选）
     * @return 操作牌领用归还记录列表
     */
    List<OperationTagRecord> getOperationTagRecordListByStationRoomId(Long stationRoomId, Collection<Integer> statuses);

    /**
     * 获得所有操作牌领用归还记录列表
     *
     * @return 操作牌领用归还记录列表
     */
    List<OperationTagRecord> getOperationTagRecordList();

    /**
     * 获得操作牌领用归还记录分页
     *
     * @param reqVO 分页查询条件
     * @return 操作牌领用归还记录分页结果
     */
    PageResult<OperationTagRecord> getOperationTagRecordPage(OperationTagRecordPageReqVO reqVO);


    // 查询属于tagId的status为（1=已领用未归还）的领用记录
    List<OperationTagRecordRespVO> getOperationTagRecordByTagId(Long tagId);

    /**
     * 校验操作牌领用归还记录是否有效。如下情况，视为无效：
     * 1. 记录编号不存在
     * 2. 记录已被删除（deleted=1）
     * 3. 记录已作废（status=3）
     *
     * @param ids 记录编号数组
     */
    void validateOperationTagRecordList(Collection<Long> ids);

    /**
     * 检查操作牌是否已被领用未归还（用于防止重复领用）
     *
     * @param tagId 操作牌ID
     * @return 是否已领用未归还
     */
    boolean isTagInUse(Long tagId);

}
