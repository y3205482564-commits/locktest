package cn.iocoder.yudao.module.digitalCard.service;

import cn.iocoder.yudao.module.digitalCard.domain.OperationTag;
import cn.iocoder.yudao.module.digitalCard.model.vo.card.OperationTagVO;
import cn.iocoder.yudao.module.digitalCard.model.vo.card.SimpleOperationTagVO;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;


/**
* @author 鹏
* @description 针对表【operation_tag(操作牌表)】的数据库操作Service
* @createDate 2026-01-21 15:00:05
*/
public interface OperationTagService extends IService<OperationTag> {


    /**
     * 获取操作标签列表
     */
    List<OperationTagVO> getOperationTagList();

    /**
     * 获取操作标签精简信息列表
     */
    List<SimpleOperationTagVO> getSimpleOperationTagList();

    /**
     * 通过ID查询操作标签完整信息
     */
    OperationTagVO getOperationTagById(Long id);

    /**
     * 通过租户ID查询操作标签列表
     */
    List<OperationTagVO> getOperationTagListByTenantId(Long tenantId);

    /**
     * 通过标签类型查询操作标签列表
     */
    List<OperationTagVO> getOperationTagListByTagType(String tagType);


    /**
     * 通过站室ID查询操作标签列表
     */
    List<OperationTagVO> getOperationTagListByStationRoomId(Long stationRoomId);

}
