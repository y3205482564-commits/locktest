package cn.iocoder.yudao.module.digitalCard.service;


import cn.iocoder.yudao.module.digitalCard.domain.Tqrjh03;
import cn.iocoder.yudao.module.digitalCard.model.vo.RepairEntrustOrderVO;
import cn.iocoder.yudao.module.digitalCard.model.vo.SimpleTqrjh03VO;
import cn.iocoder.yudao.module.digitalCard.model.vo.Tqrjh03VO;
import com.baomidou.mybatisplus.extension.service.IService;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

/**
* @author 鹏
* @description 针对表【tqrjh03(检修委托单表)】的数据库操作Service
* @createDate 2026-01-12 15:54:38
*/
public interface Tqrjh03Service extends IService<Tqrjh03> {

    /**
     * 获取工单精简信息列表（仅返回开启状态的工单）
     * @return 工单精简信息列表
     */
    List<SimpleTqrjh03VO> getSimpleWorkOrderList();

    /**
     * 通过内码查询单个开启状态的工单精简信息
     * @param internalCode 工单内码（不能为空）
     * @return 工单精简信息（无数据则返回null）
     */
    Tqrjh03VO getSimpleWorkOrderByInternalCode(String internalCode);


    RepairEntrustOrderVO getRepairEntrustOrderByInternalCode(String internalCode);

}
