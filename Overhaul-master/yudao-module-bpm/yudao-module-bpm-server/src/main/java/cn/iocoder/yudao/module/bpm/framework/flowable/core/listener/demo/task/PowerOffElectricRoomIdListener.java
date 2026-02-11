package cn.iocoder.yudao.module.bpm.framework.flowable.core.listener.demo.task;

import lombok.extern.slf4j.Slf4j;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.delegate.TaskListener;
import org.flowable.task.service.delegate.DelegateTask;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.Objects;

/**
 * 断电标识监听器
 * 核心功能：当is_power_off为true时，设置electricRoomId为148
 *
 * @author 芋道源码
 */
@Slf4j
@Component
public class PowerOffElectricRoomIdListener implements TaskListener {

    // 注入RuntimeService，用于操作流程实例级全局变量
    @Resource
    private RuntimeService runtimeService;

    // 常量定义：硬编码值统一管理，便于维护
    private static final Integer TARGET_ELECTRIC_ROOM_ID = 148;
    private static final String POWER_OFF_KEY = "is_power_off";
    private static final String ELECTRIC_ROOM_ID_KEY = "electricRoomId";

    @Override
    public void notify(DelegateTask delegateTask) {
        String taskId = delegateTask.getId();
        log.info("[notify][task({}) 断电标识监听器开始执行]", taskId);

        try {
            // 1. 获取is_power_off变量
            Object powerOffObj = delegateTask.getVariable(POWER_OFF_KEY);
            log.info("[notify][task({}) 当前{}值为：{}]", taskId, POWER_OFF_KEY, powerOffObj);

            // 2. 严格校验变量类型并判断值
            if (Boolean.TRUE.equals(powerOffObj)) {
                // 获取流程实例ID，确保变量设置到全局作用域
                String executionId = delegateTask.getExecutionId();

                // 设置electricRoomId为148（流程实例级全局变量）
                runtimeService.setVariable(executionId, ELECTRIC_ROOM_ID_KEY, TARGET_ELECTRIC_ROOM_ID);

                log.info("[notify][task({}) 检测到{}为true，已设置{}为{}]",
                        taskId, POWER_OFF_KEY, ELECTRIC_ROOM_ID_KEY, TARGET_ELECTRIC_ROOM_ID);

                // 可选：同时设置到当前任务局部变量（双保险）
                delegateTask.setVariable(ELECTRIC_ROOM_ID_KEY, TARGET_ELECTRIC_ROOM_ID);
            } else {
                log.info("[notify][task({}) {}值不为true，不设置{}]",
                        taskId, POWER_OFF_KEY, ELECTRIC_ROOM_ID_KEY);
            }

        } catch (Exception e) {
            log.error("[notify][task({}) 断电标识监听器执行失败]", taskId, e);
            // 捕获所有异常，避免监听器异常导致流程中断
        }

        log.info("[notify][task({}) 断电标识监听器执行完成，当前electricRoomId：{}]",
                taskId, delegateTask.getVariable(ELECTRIC_ROOM_ID_KEY));
    }
}
