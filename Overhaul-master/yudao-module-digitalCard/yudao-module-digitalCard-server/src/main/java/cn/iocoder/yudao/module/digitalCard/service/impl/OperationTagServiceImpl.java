package cn.iocoder.yudao.module.digitalCard.service.impl;


import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollectionUtil;
import cn.iocoder.yudao.module.digitalCard.domain.OperationTag;
import cn.iocoder.yudao.module.digitalCard.mapper.OperationTagMapper;
import cn.iocoder.yudao.module.digitalCard.model.vo.card.OperationTagVO;
import cn.iocoder.yudao.module.digitalCard.model.vo.card.SimpleOperationTagVO;
import cn.iocoder.yudao.module.digitalCard.service.OperationTagService;
import com.baomidou.mybatisplus.core.toolkit.ObjectUtils;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author 鹏
 * @description 针对表【operation_tag(操作牌表)】的数据库操作Service实现
 * @createDate 2026-01-21 15:00:05
 */
@Service
public class OperationTagServiceImpl extends ServiceImpl<OperationTagMapper, OperationTag>
        implements OperationTagService {


    @Override
    public List<OperationTagVO> getOperationTagList() {
        // 1. 查询所有未删除的操作牌记录（补充业务过滤：只查未删除的数据）
        List<OperationTag> operationTags = list(Wrappers.lambdaQuery(OperationTag.class));

        // 为空的话，直接返回空
        if (CollectionUtil.isEmpty(operationTags)) {
            return Collections.emptyList();
        }

        // 使用 Hutool BeanUtil（更强大，支持更多类型转换，需引入hutool依赖）
        List<OperationTagVO> voList = BeanUtil.copyToList(operationTags, OperationTagVO.class);

        // 返回转换后的VO列表
        return voList;
    }


    @Override
    public List<SimpleOperationTagVO> getSimpleOperationTagList() {
        return null;
    }


    @Override
    public OperationTagVO getOperationTagById(Long id) {
        return null;
    }

    @Override
    public List<OperationTagVO> getOperationTagListByTenantId(Long tenantId) {
        return null;
    }

    @Override
    public List<OperationTagVO> getOperationTagListByTagType(String tagType) {
        return null;
    }


    @Override
    public List<OperationTagVO> getOperationTagListByStationRoomId(Long stationRoomId) {
        // 1. 入参校验：避免空指针和无效查询
        if (ObjectUtils.isEmpty(stationRoomId)) {
            return Collections.emptyList(); // 返回空列表而非 null，更安全
        }

        // 2. 优化：建议将过滤逻辑放到数据库层面（而非内存过滤），提升性能
        // 原逻辑是先查所有数据再过滤，数据量大时性能差，推荐改为条件查询
        List<OperationTag> tagList = lambdaQuery()
                .eq(OperationTag::getStationRoomId, stationRoomId)
                .list();

        // 3. 空列表处理 + 对象转换，避免 NPE
        if (ObjectUtils.isEmpty(tagList)) {
            return Collections.emptyList();
        }

        // 4. 转换并返回 VO 列表
        return tagList.stream()
                .map(tag -> BeanUtil.copyProperties(tag, OperationTagVO.class))
                .collect(Collectors.toList());
    }
}




