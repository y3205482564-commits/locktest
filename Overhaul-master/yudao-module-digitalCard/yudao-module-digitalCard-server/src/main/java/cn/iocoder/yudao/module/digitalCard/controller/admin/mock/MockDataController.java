package cn.iocoder.yudao.module.digitalCard.controller.admin.mock;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.module.digitalCard.model.vo.mock.ElectricRoomVO;
import cn.iocoder.yudao.module.digitalCard.model.vo.mock.OperationRoomVO;
import cn.iocoder.yudao.module.digitalCard.model.vo.mock.RepairStaffVO;
import cn.iocoder.yudao.module.digitalCard.model.vo.mock.TeamSelectVO;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

/**
 * 模拟数据控制器
 * 专门用于返回各类模拟数据，方便前端联调测试
 */
@RestController
@RequestMapping("/digitalCard/mock") // 统一的模拟数据接口前缀
public class MockDataController {

    /**
     * 示例方法：获取模拟的精简信息列表
     * 用于前端下拉选项等场景的模拟数据返回
     * @return 包含模拟精简列表的通用返回结果
     */
//    @GetMapping({"/list-all-simple", "/simple-list"})
//    @Operation(summary = "获取模拟精简信息列表", description = "只返回模拟的精简数据，主要用于前端的下拉选项测试")
//    public CommonResult<List<SimpleMockVO>> getSimpleMockList() {
//        // 构建模拟数据列表
//        List<SimpleMockVO> mockList = new ArrayList<>();
//        mockList.add(new SimpleMockVO(1L, "模拟数据1", "启用"));
//        mockList.add(new SimpleMockVO(2L, "模拟数据2", "启用"));
//        mockList.add(new SimpleMockVO(3L, "模拟数据3", "启用"));
//
//        // 返回通用成功结果
//        return CommonResult.success(mockList);
//    }



    // todo:1.班组选择模拟数据
    /**
     * 获取模拟的班组选择列表
     * 用于前端班组下拉选择框等场景的模拟数据返回
     * @return 包含模拟班组列表的通用返回结果
     */
    @GetMapping({"/team-select-list", "/list-team-select"}) // 支持多个访问路径，提升灵活性
    @Operation(summary = "获取模拟班组选择列表", description = "返回模拟的班组名称和班组账号数据，用于前端班组下拉选项测试")
    public CommonResult<List<TeamSelectVO>> getTeamSelectMockList() {
        // 构建模拟的班组数据列表
        List<TeamSelectVO> teamList = new ArrayList<>();

        // 直接new对象并设置属性，替代原有工具方法
        TeamSelectVO team1 = new TeamSelectVO();
        team1.setTeamName("检修一组");
        team1.setTeamAccount(150L);
        teamList.add(team1);

        TeamSelectVO team2 = new TeamSelectVO();
        team2.setTeamName("检修二组");
        team2.setTeamAccount(151L);
        teamList.add(team2);

        // 返回通用成功结果（沿用项目已有的CommonResult工具类）
        return CommonResult.success(teamList);
    }


    /**
     * 获取模拟的检修人员列表
     * 用于前端检修人员下拉选择、列表展示等场景的模拟数据返回
     * @return 包含模拟检修人员列表的通用返回结果
     */
    @GetMapping({"/repair-staff-list", "/list-repair-staff"})
    @Operation(summary = "获取模拟检修人员列表", description = "返回模拟的检修人员ID、姓名、所属班组等数据，用于前端检修人员相关联调测试")
    public CommonResult<List<RepairStaffVO>> getRepairStaffMockList() {
        // 构建模拟检修人员数据列表
        List<RepairStaffVO> staffList = new ArrayList<>();

        // 第一条模拟数据：高级检修工（启用状态）
        RepairStaffVO staff1 = new RepairStaffVO();
        staff1.setStaffId(152L);
        staff1.setStaffName("检修方人员01");
        staffList.add(staff1);

        // 第二条模拟数据：检修班长（启用状态）
        RepairStaffVO staff2 = new RepairStaffVO();
        staff2.setStaffId(153L);
        staff2.setStaffName("检修方人员02");
        staffList.add(staff2);

        // 第三条模拟数据：初级检修工（禁用状态）
//        RepairStaffVO staff3 = new RepairStaffVO();
//        staff3.setStaffId(1003L);
//        staff3.setStaffName("王五");
//        staffList.add(staff3);

        // 第四条模拟数据：中级检修工（启用状态）
//        RepairStaffVO staff4 = new RepairStaffVO();
//        staff4.setStaffId(1004L);
//        staff4.setStaffName("赵六");
//        staffList.add(staff4);

        // 返回通用成功结果
        return CommonResult.success(staffList);
    }


    /**
     * 获取模拟的操作室列表
     * 用于前端操作室下拉选择、列表展示等场景的模拟数据返回
     * @return 包含模拟操作室列表的通用返回结果
     */
    @GetMapping({"/operation-room-list", "/list-operation-room"})
    @Operation(summary = "获取模拟操作室列表", description = "返回模拟的操作室ID和名称数据，用于前端操作室相关联调测试")
    public CommonResult<List<OperationRoomVO>> getOperationRoomMockList() {
        // 构建模拟操作室数据列表
        List<OperationRoomVO> roomList = new ArrayList<>();

        // 第一条模拟数据：一号操作室
        OperationRoomVO room1 = new OperationRoomVO();
        room1.setRoomId(146L);
        room1.setRoomName("一号操作室");
        roomList.add(room1);

        // 第二条模拟数据：二号操作室
        OperationRoomVO room2 = new OperationRoomVO();
        room2.setRoomId(147L);
        room2.setRoomName("二号操作室");
        roomList.add(room2);

        // 第三条模拟数据：三号操作室
//        OperationRoomVO room3 = new OperationRoomVO();
//        room3.setRoomId(3L);
//        room3.setRoomName("三号操作室");
//        roomList.add(room3);

        // 第四条模拟数据：中控操作室
//        OperationRoomVO room4 = new OperationRoomVO();
//        room4.setRoomId(4L);
//        room4.setRoomName("中控操作室");
//        roomList.add(room4);

        // 返回通用成功结果
        return CommonResult.success(roomList);
    }


    /**
     * 获取模拟的电气室列表
     * 用于前端电气室下拉选择、列表展示等场景的模拟数据返回
     * @return 包含模拟电气室列表的通用返回结果
     */
    @GetMapping({"/electric-room-list", "/list-electric-room"})
    @Operation(summary = "获取模拟电气室列表", description = "返回模拟的电气室ID和名称数据，用于前端电气室相关联调测试")
    public CommonResult<List<ElectricRoomVO>> getElectricRoomMockList() {
        // 构建模拟电气室数据列表
        List<ElectricRoomVO> electricRoomList = new ArrayList<>();

        // 第一条模拟数据：一号电气室
        ElectricRoomVO electricRoom1 = new ElectricRoomVO();
        electricRoom1.setElectricRoomId(148L);
        electricRoom1.setElectricRoomName("一号电气室");
        electricRoomList.add(electricRoom1);

        // 第二条模拟数据：二号电气室
        ElectricRoomVO electricRoom2 = new ElectricRoomVO();
        electricRoom2.setElectricRoomId(149L);
        electricRoom2.setElectricRoomName("二号电气室");
        electricRoomList.add(electricRoom2);

        // 第三条模拟数据：高压电气室
//        ElectricRoomVO electricRoom3 = new ElectricRoomVO();
//        electricRoom3.setElectricRoomId(3L);
//        electricRoom3.setElectricRoomName("高压电气室");
//        electricRoomList.add(electricRoom3);

        // 第四条模拟数据：低压电气室
//        ElectricRoomVO electricRoom4 = new ElectricRoomVO();
//        electricRoom4.setElectricRoomId(4L);
//        electricRoom4.setElectricRoomName("低压电气室");
//        electricRoomList.add(electricRoom4);

        // 第五条模拟数据：备用电气室
//        ElectricRoomVO electricRoom5 = new ElectricRoomVO();
//        electricRoom5.setElectricRoomId(5L);
//        electricRoom5.setElectricRoomName("备用电气室");
//        electricRoomList.add(electricRoom5);

        // 返回通用成功结果
        return CommonResult.success(electricRoomList);
    }









}
