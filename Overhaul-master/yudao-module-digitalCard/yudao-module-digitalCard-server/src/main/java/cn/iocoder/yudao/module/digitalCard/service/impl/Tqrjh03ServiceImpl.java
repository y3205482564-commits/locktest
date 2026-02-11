package cn.iocoder.yudao.module.digitalCard.service.impl;

import cn.iocoder.yudao.module.digitalCard.domain.Tqrjh03;
import cn.iocoder.yudao.module.digitalCard.mapper.Tqrjh03Mapper;
import cn.iocoder.yudao.module.digitalCard.model.vo.RepairEntrustOrderVO;
import cn.iocoder.yudao.module.digitalCard.model.vo.SimpleTqrjh03VO;
import cn.iocoder.yudao.module.digitalCard.model.vo.Tqrjh03VO;
import cn.iocoder.yudao.module.digitalCard.service.Tqrjh03Service;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
* @author 鹏
* @description 针对表【tqrjh03(检修委托单表)】的数据库操作Service实现
* @createDate 2026-01-12 15:54:38
*/
@Service
public class Tqrjh03ServiceImpl extends ServiceImpl<Tqrjh03Mapper, Tqrjh03>
    implements Tqrjh03Service{


    @Autowired
    private Tqrjh03Mapper tqrjh03Mapper;


    /**
     * 状态字段：开启（根据实际业务调整值，示例用"1"表示开启）
     */
//    private static final String STATUS_ENABLE = "1";

    @Override
    public List<SimpleTqrjh03VO> getSimpleWorkOrderList() {
        // 1. 构建查询条件：只查询开启状态的工单
        LambdaQueryWrapper<Tqrjh03> queryWrapper = new LambdaQueryWrapper<Tqrjh03>()
//                .eq(Tqrjh03::getStatus, STATUS_ENABLE) // 筛选开启状态的工单
                .select(
                        Tqrjh03::getInternalCode,
                        Tqrjh03::getTrustId,
                        Tqrjh03::getDeviceId,
                        Tqrjh03::getDeviceName,
                        Tqrjh03::getProjectType
                ); // 只查询需要的字段，提升性能

        // 2. 查询数据库
        List<Tqrjh03> tqrjh03List = this.list(queryWrapper);

        // 3. 实体转VO（属性拷贝）
        return tqrjh03List.stream().map(tqrjh03 -> {
            SimpleTqrjh03VO vo = new SimpleTqrjh03VO();
            BeanUtils.copyProperties(tqrjh03, vo);
            return vo;
        }).collect(Collectors.toList());
    }


    @Override
    public Tqrjh03VO getSimpleWorkOrderByInternalCode(String internalCode) {
        // 1. 参数校验：内码不能为空
//        Assert.isTrue(StringUtils.hasText(internalCode), "工单内码不能为空");

        // 2. 构建查询条件：内码精准匹配 + 开启状态
        LambdaQueryWrapper<Tqrjh03> queryWrapper = new LambdaQueryWrapper<Tqrjh03>()
                .eq(Tqrjh03::getInternalCode, internalCode)
//                .eq(Tqrjh03::getStatus, STATUS_ENABLE)
                .select(
                        Tqrjh03::getInternalCode,
                        Tqrjh03::getTrustId,
                        Tqrjh03::getDeviceId,
                        Tqrjh03::getDeviceName,
                        Tqrjh03::getProjectType
                );

        // 3. 查询单个数据（内码是唯一键，用getOne）
        Tqrjh03 tqrjh03 = this.getOne(queryWrapper, false); // false：无数据时返回null，不抛异常

        // 4. 实体转VO（无数据则返回null）
        if (tqrjh03 == null) {
            return null;
        }
        Tqrjh03VO vo = new Tqrjh03VO();
        BeanUtils.copyProperties(tqrjh03, vo);
        return vo;
    }

    /**
     * 通过内码查询工单，返回RepairEntrustOrderVO
     *
     * @param internalCode 工单内码（主键）
     * @return RepairEntrustOrderVO 工单信息，无数据则返回null
     */
    public RepairEntrustOrderVO getRepairEntrustOrderByInternalCode(String internalCode) {
        // 1. 参数校验：内码不能为空/空字符串
        if (internalCode == null || internalCode.trim().isEmpty()) {
            return null;
        }

        // 2. MyBatis-Plus构建查询条件：内码匹配 + 状态为开启
        LambdaQueryWrapper<Tqrjh03> queryWrapper = new LambdaQueryWrapper<Tqrjh03>()
                .eq(Tqrjh03::getInternalCode, internalCode); // 匹配内码

        // 3. 执行查询：获取数据库实体
        Tqrjh03 entity = tqrjh03Mapper.selectOne(queryWrapper);

        // 4. 实体转VO：无数据则返回null，有数据则转换为RepairEntrustOrderVO
        if (entity == null) {
            return null;
        }
        RepairEntrustOrderVO vo = new RepairEntrustOrderVO();
        BeanUtils.copyProperties(entity, vo); // 字段名驼峰匹配时自动拷贝

        // 5. 返回VO对象
        return vo;
    }

}




