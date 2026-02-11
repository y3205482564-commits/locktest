package cn.iocoder.yudao.module.digitalCard.controller.admin.user;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.validation.Valid;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@RestController
@RequestMapping("/digitalCard/user")
@Validated
public class UserController {

//    @Resource
//    private AdminUserService userService;
//    @Resource
//    private DeptService deptService;

//    @PostMapping("/create")
//    @Operation(summary = "新增用户")
//    @PreAuthorize("@ss.hasPermission('system:user:create')")
//    public CommonResult<Long> createUser(@Valid @RequestBody UserSaveReqVO reqVO) {
//        Long id = userService.createUser(reqVO);
//        return success(id);
//    }


    // 获取所有检修班长



    // 获取检修班下的检修人员


}
